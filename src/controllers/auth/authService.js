import createError from 'http-errors';
import registerWithAWSCognito from './awsCognito';

async function register(signupdetails) {
  try {
    const user = await registerWithAWSCognito(signupdetails);
    return user;
  } catch (error) {
    throw createError(400, error);
  }
}

export default { register };
