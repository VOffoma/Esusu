import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import axios from 'axios';
import createError from 'http-errors';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import nodeFetch from 'node-fetch';
import config from '../config/index';

// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({ profile: 'esusu' });
AWS.config.credentials = credentials;


global.fetch = nodeFetch;
global.navigator = () => null;


export function getUserPool() {
  const poolData = {
    UserPoolId: config.get('cognito:userpoolid'),
    ClientId: config.get('cognito:clientid'),
  };

  const userPool = new CognitoUserPool(poolData);
  return userPool;
}


export function createCognitoUserAttributeList(email, name) {
  const attributeList = [];
  attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: email }));
  attributeList.push(new CognitoUserAttribute({ Name: 'name', Value: name }));
  return attributeList;
}

export function createAuthenticationDetailsObject(loginCredentials) {
  const authenticationDetails = new AuthenticationDetails({
    Username: loginCredentials.email,
    Password: loginCredentials.password,
  });
  return authenticationDetails;
}


export function getCognitoUser(username) {
  const userPool = getUserPool();
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  return cognitoUser;
}


export async function getKeys() {
  const userPoolId = config.get('cognito:userpoolid');
  const poolRegion = config.get('cognito:region');
  const url = `https://cognito-idp.${poolRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const response = await axios.get(url);
  const { keys } = response.data;
  return keys;
}

export function createPEM(keys) {
  const pems = {};
  for (let i = 0; i < keys.length; i += 1) {
    // eslint-disable-next-line camelcase
    const key_id = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    // eslint-disable-next-line camelcase
    const key_type = keys[i].kty;
    const jwk = { kty: key_type, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);
    pems[key_id] = pem;
  }
  return pems;
}

export function validateToken(token, pems) {
  const decodedJwt = jwt.decode(token, { complete: true });
  if (!decodedJwt) {
    throw createError(400, 'Not a valid JWT token!');
  }

  const { kid } = decodedJwt.header;
  const pem = pems[kid];
  if (!pem) {
    throw createError(400, 'Not a valid JWT token!');
  }

  const payload = jwt.verify(token, pem);
  if (!payload) {
    throw createError(400, 'Not a valid JWT token!');
  }
  return (payload);
}


export function getUsers(email) {
  const filterInput = `email = '${email}'`;

  const params = {
    UserPoolId: config.get('cognito:userpoolid'),
    AttributesToGet: [
      'email',
    ],
    Filter: filterInput,
    Limit: 10,
  };

  AWS.config.update({ region: config.get('cognito:region') });
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.listUsers(params, (error, data) => {
      if (error) {
        reject(createError(400, error));
      } else {
        resolve(data);
      }
    });
  });
}
