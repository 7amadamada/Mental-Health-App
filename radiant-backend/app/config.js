import { Platform } from 'react-native';

let baseURL;
if (Platform.OS === 'android') {
    baseURL = 'http://10.0.2.2:3000';} else if (Platform.OS === 'ios') {
    }else{
        baseURL = 'http://localhost:3000/';}





export const API_URL = 'http://localhost:3000/';