import nodeFetch from 'node-fetch';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import createError from 'http-errors';
import config from '../../config/index';


global.fetch = nodeFetch;
global.navigator = () => null;

const poolData = {
  UserPoolId: config.get('cognito:userpoolid'),
  ClientId: config.get('cognito:clientid'),
};
const pool_region = config.get('cognito:region');

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

export default { register, login };
