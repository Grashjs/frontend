export const auth0Config = {
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN
};

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

export const amplifyConfig = {
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id:
    process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID
};

export const googleMapsConfig = {
  apiKey: 'AIzaSyBGk5a8ivYnqF3jFQQONB2OfCaroDGnNwM'
};
export const apiUrl = process.env.REACT_APP_API_URL;
export const frontendUrl = process.env.REACT_APP_FRONT_URL;
export const OAUTH2_REDIRECT_URI = `${frontendUrl}oauth2/redirect`;
export const googleAuthUrl =
  apiUrl + 'oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const wso2AuthUrl =
  apiUrl + 'oauth2/authorize/wso2?redirect_uri=' + OAUTH2_REDIRECT_URI;
