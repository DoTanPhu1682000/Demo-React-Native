import axios from 'axios';

export const APPLICATION_JSON = 'application/json';
export const APPLICATION_FORM_URL_ENCODE = 'application/x-www-form-urlencoded';

export const KEY_CONTENT_TYPE = 'Content-Type';
export const KEY_AUTHORIZATION = 'Authorization';
export const KEY_LANGUAGE = 'lang';
export const KEY_PAGE_SIZE = 'page_size';
export const KEY_PAGE_NUMBER = 'page_number';
export const KEY_PATIENT_RECORD_ID = 'patient_record_id';
export const KEY_FILES = 'files';

export const URL = 'https://sandboxapi.365medihome.com.vn';
export const URL_MOVIES = 'https://api.themoviedb.org/3/movie/popular?api_key=e7631ffcb8e766993e5ec0c1f4245f93';

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