import { Platform } from 'react-native';

const DEV_SERVER_IP = '172.20.10.1';

let baseURL;
if (__DEV__) {
  baseURL = `http://${DEV_SERVER_IP}:3000`;
  
  console.log('Platform:', Platform.OS);
  console.log('Using API URL:', baseURL);
}

export const API_URL = baseURL;
