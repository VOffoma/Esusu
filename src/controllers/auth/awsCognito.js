import nodeFetch from 'node-fetch';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import config from '../../config/index';

global.fetch = nodeFetch;
global.navigator = () => null;

const poolData = {
  UserPoolId: config.get('cognito:userpoolid'),
  ClientId: config.get('cognito:clientid'),
};

const pool_region = config.get('cognito:region');
// const { CognitoUserPool } = AmazonCognitoIdentity;

const userPool = new CognitoUserPool(poolData);

export default function registerWithAWSCognito(signupDetails) {
  const attributeList = [];
  attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: signupDetails.email }));
  attributeList.push(new CognitoUserAttribute({ Name: 'name', Value: signupDetails.name }));
  return new Promise((resolve, reject) => {
    userPool.signUp(signupDetails.email, signupDetails.password, attributeList, null,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          const cognitoUser = result.user;
          resolve(cognitoUser);
        }
      });
  });
}
