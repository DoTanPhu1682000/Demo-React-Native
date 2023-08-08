import axios from 'axios';

export const URL = 'https://sandboxapi.365medihome.com.vn';

// ApiEndPoints
export const LOGIN = 'auth/oauth/token'
export const PATIENT_RECORD_BY_USER_KEY = 'patient/patient-record/by-user-key'
export const PATIENT_RECORD_CREATE = 'patient/patient-record/'
export const PATIENT_RECORD_SET_DEFAULT = 'patient/patient-record/set-default/{code}'