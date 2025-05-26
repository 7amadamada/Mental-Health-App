import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const DEV_SERVER_IP = '172.20.10.1';

const ALTERNATIVE_IPS = [
  '127.0.0.1',
  '10.0.2.2',
  'localhost'
];

export const API_URL = `http://${DEV_SERVER_IP}:3000`;

export const findWorkingApiUrl = async () => {
  const urls = [
    `http://${DEV_SERVER_IP}:3000`,
    ...ALTERNATIVE_IPS.map(ip => `http://${ip}:3000`)
  ];
  
  for (const url of urls) {
    try {
      console.log(`Testing API URL: ${url}/api/test`);
      const response = await fetch(`${url}/api/test`, { 
        method: 'GET',
        timeout: 5000
      });
      if (response.ok) {
        console.log(`Found working API URL: ${url}`);
        return url;
      }
    } catch (error) {
      console.log(`URL ${url} failed:`, error.message);
    }
  }
  
  console.warn('No working API URL found, using default');
  return `http://${DEV_SERVER_IP}:3000`;
};

if (__DEV__) {
  console.log('Platform:', Platform.OS);
  console.log('Using API URL:', API_URL);
  
  NetInfo.fetch().then(state => {
    console.log('Network state:', state);
    if (state.isConnected) {
      console.log('Device is connected to the network');
    } else {
      console.warn('Device is not connected to the network');
    }
  });
}
