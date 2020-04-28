import createError from 'http-errors';
import * as AWS from '../../services/aws';

const register = (signupDetails) => {
  const { name, email, password } = signupDetails;
  const attributeList = AWS.createCognitoUserAttributeList(email, name);
  const userPool = AWS.getUserPool();

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

const getTokens = (authenticationInfo) => ({
  accessToken: authenticationInfo.getAccessToken().getJwtToken(),
  idToken: authenticationInfo.getIdToken().getJwtToken(),
  refreshToken: authenticationInfo.getRefreshToken().getToken(),
});

const login = (loginCredentials) => {
  const authenticationDetails = AWS.createAuthenticationDetailsObject(loginCredentials);
  const cognitoUser = AWS.getCognitoUser(loginCredentials.email);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(getTokens(result)),
      onFailure: (error) => reject(createError(400, error)),
    });
  });
};

const verifyLogin = async (token) => {
  const keys = await AWS.getKeys();
  const pems = AWS.createPEM(keys);
  const payload = AWS.validateToken(token, pems);
  return payload;
};

export default {
  register, login, verifyLogin,
};
