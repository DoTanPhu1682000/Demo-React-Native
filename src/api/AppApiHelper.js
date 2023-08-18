import axios from 'axios';

export const URL = 'https://sandboxapi.365medihome.com.vn';

// ApiEndPoints
export const LOGIN = 'auth/oauth/token'
export const PATIENT_RECORD_BY_USER_KEY = 'patient/patient-record/by-user-key'
export const PATIENT_RECORD_CREATE = 'patient/patient-record/'
export const PATIENT_RECORD_SET_DEFAULT = 'patient/patient-record/set-default'
export const SITE_GET_LIST = 'auth/site/get-list'
export const DOCTOR_SERVICE_LIST = 'doctor/dr-service/get-list-show'
export const DOCTOR_LIST_DOCTOR = 'doctor/doctor/list-doctor'