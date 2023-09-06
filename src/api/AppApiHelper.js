import axios from 'axios';

export const URL = 'https://sandboxapi.365medihome.com.vn';

// ApiEndPoints
export const LOGIN = 'auth/oauth/token'
export const PATIENT_RECORD_BY_USER_KEY = 'patient/patient-record/by-user-key'
export const PATIENT_RECORD_CREATE = 'patient/patient-record/'
export const PATIENT_RECORD_SET_DEFAULT = 'patient/patient-record/set-default'
export const PATIENT_ORDER = 'patient/order/'
export const SITE_GET_LIST = 'auth/site/get-list'
export const DOCTOR_SERVICE_LIST = 'doctor/dr-service/get-list-show'
export const DOCTOR_LIST_DOCTOR = 'doctor/doctor/list-doctor'
export const DOCTOR_TIME_TABLE = 'doctor/time-table/get-all-by-doctor-code-and-date'
export const DOCTOR_CALCULATE_FEE = 'doctor/appointment/calculate-fee'
export const DOCTOR_APPOINTMENT_CHECK_EXISTED = 'doctor/appointment/check-existed'
export const DOCTOR_APPOINTMENT = 'doctor/appointment/'
export const DOCTOR_MY_APPOINTMENT = 'doctor/appointment/my-appointment'
export const UTILS_HOME_NEWS = 'utils/home/list'
export const UTILS_COMMON_LIST = 'utils/common/list'