import axios from 'axios';

export const URL = 'https://sandboxapi.365medihome.com.vn';

// Test
const api = axios.create({
    baseURL: 'https://testapi.jasonwatmore.com/products',
});

export const fetchUsersData = () => {
    return api.get('');
};

export const fetchData = () => {
    return api.get('/1');
};

// ApiEndPoints
export const LOGIN = 'auth/oauth/token'
export const PATIENT_RECORD_BY_USER_KEY = 'patient/patient-record/by-user-key'