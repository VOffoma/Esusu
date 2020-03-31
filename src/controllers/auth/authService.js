import registerWithAWSCognito from './awsCognito';

async function register(signupdetails) {
  try {
    const user = await registerWithAWSCognito(signupdetails);
    return user;
  } catch (error) {
    console.log(error);
  }
}

export default { register };
