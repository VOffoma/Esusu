import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import axios from 'axios';
import createError from 'http-errors';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import nodeFetch from 'node-fetch';
import config from '../../config/index';


global.fetch = nodeFetch;
global.navigator = () => null;

const poolData = {
  UserPoolId: config.get('cognito:userpoolid'),
  ClientId: config.get('cognito:clientid'),
};
const poolRegion = config.get('cognito:region');
const userPool = new CognitoUserPool(poolData);

const createCognitoUserAttributeList = (email, name) => {
  const attributeList = [];
  attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: email }));
  attributeList.push(new CognitoUserAttribute({ Name: 'name', Value: name }));
  return attributeList;
};

const register = (signupDetails) => {
  const { name, email, password } = signupDetails;
  const attributeList = createCognitoUserAttributeList(email, name);
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null,
      (error, result) => {
        if (error) {
          reject(createError(400, error));
        } else {
          const cognitoUser = result.user;
          resolve(cognitoUser);
        }
      });
  });
};

const getTokens = (authenticationInfo) => {
  return {
    accessToken: authenticationInfo.getAccessToken().getJwtToken(),
    idToken: authenticationInfo.getIdToken().getJwtToken(),
    refreshToken: authenticationInfo.getRefreshToken().getToken(),
  };
};

const login = (loginCredentials) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: loginCredentials.email,
    Password: loginCredentials.password,
  });

  const userData = {
    Username: loginCredentials.email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(getTokens(result)),
      onFailure: (error) => reject(createError(400, error)),
    });
  });
};


const getKeys = async () => {
  const url = `https://cognito-idp.${poolRegion}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`;
  const response = await axios.get(url);
  const { keys } = response.data;
  return keys;
};

const createPEM = (keys) => {
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
};

const verifyToken = (token, pems) => {
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
};


const validateToken = async (token) => {
  const keys = await getKeys();
  const pems = createPEM(keys);
  const payload = verifyToken(token, pems);
  return payload;
};

export default { register, login, validateToken };
