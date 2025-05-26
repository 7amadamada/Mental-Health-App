import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

export const isNetworkConnected = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

export const getNetworkInfo = async () => {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected,
    type: state.type,
    isWifi: state.type === 'wifi',
    details: state.details
  };
};

export const isUrlReachable = async (url, timeout = 5000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`URL ${url} is not reachable:`, error.message);
    return false;
  }
};

export const getLocalhostUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000'; 
  } else {
    return 'http://localhost:3000'; 
  }
};