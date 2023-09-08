import axios from 'axios';
import * as Constants from '../../api/AppApiHelper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SET_PATIENT_RECORD_REQUEST, SET_PATIENT_RECORD_SUCCESS, SET_PATIENT_RECORD_FAILURE } from '../reducers/patientRecordReducer'
import { SET_SELECTED_ITEM_PATIENT_RECORD } from '../reducers/itemPatientRecordReducer'
import { SET_SITE_REQUEST, SET_SITE_SUCCESS, SET_SITE_FAILURE } from '../reducers/siteReducer'
import { SET_SELECTED_ITEM_SITE } from '../reducers/itemSiteReducer'
import { SET_APPOINTMENT_SERVICE_REQUEST, SET_APPOINTMENT_SERVICE_SUCCESS, SET_APPOINTMENT_SERVICE_FAILURE } from '../reducers/appointmentServiceReducer'
import { SET_SELECTED_ITEM_APPOINTMENT_SERVICE } from '../reducers/itemAppointmentServiceReducer'
import { SET_DOCTOR_REQUEST, SET_DOCTOR_SUCCESS, SET_DOCTOR_FAILURE } from '../reducers/doctorReducer'
import { SET_SELECTED_ITEM_DOCTOR } from '../reducers/itemDoctorReducer'
import { SET_DOCTOR_TIME_TABLE_REQUEST, SET_DOCTOR_TIME_TABLE_SUCCESS, SET_DOCTOR_TIME_TABLE_FAILURE } from '../reducers/doctorTimeTableReducer'
import { SET_SELECTED_ITEM_DOCTOR_TIME_TABLE } from '../reducers/itemDoctorTimeTableReducer'

const KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN';
const KEY_REFRESH_TOKEN = 'KEY_REFRESH_TOKEN';
const KEY_USER_KEY = 'KEY_USER_KEY';

const APPLICATION_JSON = 'application/json';
const APPLICATION_FORM_URL_ENCODE = 'application/x-www-form-urlencoded';
const KEY_CONTENT_TYPE = 'Content-Type';
const KEY_AUTHORIZATION = 'Authorization';
const KEY_LANGUAGE = 'lang';
const KEY_PAGE_SIZE = 'page_size';
const KEY_PAGE_NUMBER = 'page_number';
const KEY_PATIENT_RECORD_ID = 'patient_record_id';
const KEY_FILES = 'files';

const getKeyAuthorization = () => {
    return 'Basic bWVkaWhvbWU6bWVkaWhvbWVAMTIzNEAjJA==';
}

const api = axios.create({
    baseURL: `${Constants.URL}`,
    timeout: 10000, // Thời gian tối đa để chờ phản hồi từ API
    headers: {
        [KEY_CONTENT_TYPE]: APPLICATION_JSON,
    },
});

// Thêm interceptor để tự động thêm Authorization header với accessToken mỗi khi gửi yêu cầu
api.interceptors.request.use(
    async (config) => {
        const accessToken = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
        console.log("==> api accessToken: ", accessToken);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý lỗi 401 và tự động làm mới accessToken
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Gọi hàm để làm mới accessToken
                await getRefreshToken();
                // Sau khi làm mới token thành công, gọi lại yêu cầu ban đầu với access token mới
                const newAccessToken = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
                console.log("==> api newAccessToken: ", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// accessToken
export const login = async (phone, password) => {
    try {
        const response = await axios.post(`${Constants.URL}/${Constants.LOGIN}`, {
            username: phone,
            password: password,
            grant_type: 'password',
        }, {
            headers: {
                [KEY_CONTENT_TYPE]: APPLICATION_FORM_URL_ENCODE,
                [KEY_AUTHORIZATION]: getKeyAuthorization(),
            },
        });

        console.log(response.data);
        // Xử lý kết quả phản hồi và lưu accessToken và refreshToken vào AsyncStorage
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        await AsyncStorage.setItem(KEY_ACCESS_TOKEN, accessToken);
        await AsyncStorage.setItem(KEY_REFRESH_TOKEN, refreshToken);
        await AsyncStorage.setItem(KEY_USER_KEY, response.data.user_key);

        return response.data;
    } catch (error) {
        console.log('Error login:', error);
    }
};

// refreshToken
export const getRefreshToken = async () => {
    try {
        // lấy refreshToken từ AsyncStorage
        const refreshToken = await AsyncStorage.getItem(KEY_REFRESH_TOKEN);
        console.log("==> getRefreshToken:", refreshToken);

        const response = await axios.post(`${Constants.URL}/${Constants.LOGIN}`,
            {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
            {
                headers: {
                    [KEY_CONTENT_TYPE]: APPLICATION_FORM_URL_ENCODE,
                    [KEY_AUTHORIZATION]: getKeyAuthorization(),
                },
            }
        );

        console.log(response.data);
        // Xử lý kết quả phản hồi và lưu accessToken và refreshToken mới vào AsyncStorage
        await AsyncStorage.setItem(KEY_ACCESS_TOKEN, response.data.access_token);
        await AsyncStorage.setItem(KEY_REFRESH_TOKEN, response.data.refresh_token);
        await AsyncStorage.setItem(KEY_USER_KEY, response.data.user_key);

        return response.data;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.log('Error getRefreshToken:', error);
    }
};

// getPatientRecord
export const getPatientRecord = () => {
    return async (dispatch) => {
        try {
            // Gửi action request để hiển thị loading hoặc thực hiện các logic tương ứng
            dispatch({ type: SET_PATIENT_RECORD_REQUEST });

            const response = await api.get(`/${Constants.PATIENT_RECORD_BY_USER_KEY}`)
            console.log(response.data);

            // sắp xếp default_record= true cho lên đầu
            const sortedData = response.data.sort((a, b) => {
                if (a.patient_record.default_record === b.patient_record.default_record) {
                    return 0;
                }
                return a.patient_record.default_record ? -1 : 1;
            });

            dispatch({ type: SET_PATIENT_RECORD_SUCCESS, payload: sortedData });
        } catch (error) {
            dispatch({ type: SET_PATIENT_RECORD_FAILURE, payload: error });
            console.log(error)
        }
    };
};

// getPatientRecordAdd
export const getPatientRecordAdd = (defaultRecord, patientName, patientGender, patientDob, patientEmail,
    patientHeight, patientWeight, patientPhoneNumber, patientEthic, patientAddress) => {
    return async (dispatch) => {
        try {
            dispatch({ type: SET_PATIENT_RECORD_REQUEST });

            const userKey = await AsyncStorage.getItem(KEY_USER_KEY);

            const item = {
                "patient_name": patientName,
                "patient_gender": patientGender,
                "patient_dob": patientDob,
                "patient_email": patientEmail,
                "patient_height": patientHeight,
                "patient_weight": patientWeight,
                "patient_phone_number": patientPhoneNumber,
                "patient_ethic": patientEthic ? "25" : "55",
                "patient_nationality": "084",
                "patient_address": patientAddress,
            };

            let jsonObject = {};
            jsonObject = {
                "patient_record": item,
                "user_key": userKey,
            };

            const response = await api.post(`/${Constants.PATIENT_RECORD_CREATE}`, jsonObject)
            console.log(response.data);

            const patientRecord = response.data.patient_record;
            if (defaultRecord === true && patientRecord.code) {
                try {
                    await dispatch(getPatientRecordDefault(patientRecord.code))
                    dispatch({ type: SET_PATIENT_RECORD_SUCCESS, payload: response.data });
                } catch (error) {
                    console.log(error);
                }
            } else {
                dispatch({ type: SET_PATIENT_RECORD_SUCCESS, payload: response.data });
            }
        } catch (error) {
            dispatch({ type: SET_PATIENT_RECORD_FAILURE, payload: error });
            console.log(error)
        }
    };
};

// getPatientRecordDefault
export const getPatientRecordDefault = (code) => {
    return async (dispatch) => {
        try {
            dispatch({ type: SET_PATIENT_RECORD_REQUEST });

            const response = await api.put(`/${Constants.PATIENT_RECORD_SET_DEFAULT}/${code}`)
            console.log(response.data);
            dispatch({ type: SET_PATIENT_RECORD_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: SET_PATIENT_RECORD_FAILURE, payload: error });
            console.log(error)
        }
    };
};

// setSelectedItemPatientRecord
export const setSelectedItemPatientRecord = (item) => ({
    type: SET_SELECTED_ITEM_PATIENT_RECORD,
    payload: item,
});

// getSiteList
export const getSiteList = async (id, text, page, dispatchCallback) => {
    try {
        dispatchCallback({ type: SET_SITE_REQUEST });

        const paramsSiteList = {
            [KEY_PAGE_NUMBER]: page.toString(),
            [KEY_PAGE_SIZE]: 20,
        };

        if (text) {
            paramsSiteList.search_text = text;
        }
        if (id >= 0) {
            paramsSiteList.state_id = id.toString();
        }

        const response = await api.get(`/${Constants.SITE_GET_LIST}`, { params: paramsSiteList })
        console.log(response.data);

        dispatchCallback({ type: SET_SITE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatchCallback({ type: SET_SITE_FAILURE, payload: error });
        console.log(error)
    }
};

// setSelectedItemSite
export const setSelectedItemSite = (item) => ({
    type: SET_SELECTED_ITEM_SITE,
    payload: item,
});

// getCurrentLanguageCodeByEthic
const getCurrentLanguageCodeByEthic = (isVN) => {
    let lang = "";
    if (isVN) {
        lang = "vi";
    } else {
        lang = "en";
    }
    return lang;
}

// getAppointmentService
export const getAppointmentService = async (isVN, isOnline, siteCode, dispatchCallback) => {
    try {
        dispatchCallback({ type: SET_APPOINTMENT_SERVICE_REQUEST });

        const paramsAppointmentServiceList = {
            [KEY_LANGUAGE]: getCurrentLanguageCodeByEthic(isVN),
            "online": isOnline,
            "siteCode": siteCode,
        };

        const response = await api.get(`/${Constants.DOCTOR_SERVICE_LIST}`, { params: paramsAppointmentServiceList })
        console.log(response.data);

        dispatchCallback({ type: SET_APPOINTMENT_SERVICE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatchCallback({ type: SET_APPOINTMENT_SERVICE_FAILURE, payload: error });
        console.log(error)
    }
};

// setSelectedItemAppointmentService
export const setSelectedItemAppointmentService = (item) => ({
    type: SET_SELECTED_ITEM_APPOINTMENT_SERVICE,
    payload: item,
});

//  getDoctorListDatLich
export const getDoctorListDatLich = async (isOnline, siteCode, specializationCode, date, serviceCode, isVN, page, size, dispatchCallback) => {
    return getDoctorList(isOnline, siteCode, null, specializationCode, -1, date, null, serviceCode, isVN, page, size, dispatchCallback);
};

// getDoctorList
export const getDoctorList = async (isOnline, siteCode, stateCode, specializationCode, specializationId, date, doctorNameKeyword, serviceCode, isVN, page, size, dispatchCallback) => {
    try {
        dispatchCallback({ type: SET_DOCTOR_REQUEST });

        const queryParams = {
            "page": page.toString(),
            "size": size.toString(),
            "online": isOnline ? isOnline.toString() : undefined,
            "specialization": specializationId > 0 ? specializationId.toString() : undefined,
            "site_code": siteCode || undefined,
            "doctor_name": doctorNameKeyword || undefined,
            "state_code": stateCode || undefined,
            "specialization_code": specializationCode || undefined,
            "service_code": serviceCode || undefined,
            "lang": getCurrentLanguageCodeByEthic(isVN),
            "appt_date": date || undefined,
        };

        const response = await api.get(`/${Constants.DOCTOR_LIST_DOCTOR}`, { params: queryParams })
        console.log(response.data);

        dispatchCallback({ type: SET_DOCTOR_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatchCallback({ type: SET_DOCTOR_FAILURE, payload: error });
        console.log(error)
    }
};

// setSelectedItemDoctor
export const setSelectedItemDoctor = (item) => ({
    type: SET_SELECTED_ITEM_DOCTOR,
    payload: item,
});

// getDoctorTimeTable
export const getDoctorTimeTable = async (doctorCode, assignDate, dispatchCallback) => {
    try {
        dispatchCallback({ type: SET_DOCTOR_TIME_TABLE_REQUEST });

        const queryParams = {
            "assign_date": assignDate,
        };

        const response = await api.get(`/${Constants.DOCTOR_TIME_TABLE}/${doctorCode}`, { params: queryParams })
        console.log(response.data);

        dispatchCallback({ type: SET_DOCTOR_TIME_TABLE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatchCallback({ type: SET_DOCTOR_TIME_TABLE_FAILURE, payload: error });
        console.log(error)
    }
};

// setSelectedItemDoctorTimeTable
export const setSelectedItemDoctorTimeTable = (item) => ({
    type: SET_SELECTED_ITEM_DOCTOR_TIME_TABLE,
    payload: item,
});

// calculateFee
export const calculateFee = async (patientRecord, site, appointmentService, doctor, date, note, timeTable, healthInsuranceCard, promotion, isVN) => {
    try {
        const queryParams = {
            [KEY_LANGUAGE]: getCurrentLanguageCodeByEthic(isVN),
        };

        const listService = [appointmentService]

        const item = {
            "appointment_date": date,
            "symptoms": note,
            "time_table_period": timeTable,
            "patient_record": patientRecord,
            "doctor": doctor,
            "site_name": site.name,
            "site_code": site.code,
            "appointment_type": "OFFLINE",
            "appointment_used_services": listService.map(service => ({
                ...service,
                "service_id": appointmentService.id // Thêm trường service_id
            })),
            // "appointment_insurance": healthInsuranceCard,
            // "appointment_promotions": promotion ? [{ promoCode: promotion.name }] : [],
        };
        console.log(item);

        const response = await api.post(`/${Constants.DOCTOR_CALCULATE_FEE}`, item, { params: queryParams });
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error calculateFee:', error);
        throw error;
    }
};

// checkAppointmentExisted
export const checkAppointmentExisted = async (patientRecord, site, appointmentService, doctor, date, note, timeTable, healthInsuranceCard, promotion) => {
    try {
        const listService = [appointmentService]

        const item = {
            "appointment_date": date,
            "symptoms": note,
            "time_table_period": timeTable,
            "patient_record": patientRecord,
            "doctor": doctor,
            "site_name": site.name,
            "site_code": site.code,
            "appointment_type": "OFFLINE",
            "appointment_used_services": listService.map(service => ({
                ...service,
                "service_id": appointmentService.id // Thêm trường service_id
            })),
            // "appointment_insurance": healthInsuranceCard,
            // "appointment_promotions": promotion ? [{ promoCode: promotion.name }] : [],
        };
        console.log(item);

        const response = await api.post(`/${Constants.DOCTOR_APPOINTMENT_CHECK_EXISTED}`, item);
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error checkAppointmentExisted:', error);
        throw error;
    };
};

// createAppointment
export const createAppointment = async (patientRecord, site, appointmentService, doctor, date, note, timeTable, healthInsuranceCard, promotion) => {
    try {
        const listService = [appointmentService]

        const item = {
            "appointment_date": date,
            "symptoms": note,
            "time_table_period": timeTable,
            "patient_record": patientRecord,
            "doctor": doctor,
            "site_name": site.name,
            "site_code": site.code,
            "appointment_type": "OFFLINE",
            "appointment_used_services": listService.map(service => ({
                ...service,
                "service_id": appointmentService.id // Thêm trường service_id
            })),
            // "appointment_insurance": healthInsuranceCard,
            // "appointment_promotions": promotion ? [{ promoCode: promotion.name }] : [],
        };
        console.log(item);

        const response = await api.post(`/${Constants.DOCTOR_APPOINTMENT}`, item);
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error createAppointment:', error);
        throw error;
    };
};

// order
export const order = async (patientRecord, site, appointmentService, key, appointmentPrice, date, isVN) => {
    try {
        const queryParams = {
            [KEY_LANGUAGE]: getCurrentLanguageCodeByEthic(isVN),
        };

        const listService = [appointmentService]

        const item = {
            "customer_name": patientRecord.patient_name,
            "customer_phone": patientRecord.patient_phone_number,
            "customer_address": patientRecord.patient_address,
            "customer_email": patientRecord.patient_email,
            "order_type": "APPT",
            "ref_key": key,
            "total_amounts": appointmentPrice.actual_fee,
            "discount_amounts": appointmentPrice.discount,
            "real_amounts": appointmentPrice.total_fee,
            "site_name": site.name,
            "site_code": site.code,
            "description": `Thanh toan lich hen - ${listService[0].note} - ${date}`,
            "bank_code": "MOMO",
        };
        console.log(item);

        const response = await api.post(`/${Constants.PATIENT_ORDER}`, item, { params: queryParams });
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error order:', error);
        throw error;
    };
};

// getHomeNews
export const getHomeNews = async () => {
    try {
        const headers = {
            [KEY_CONTENT_TYPE]: APPLICATION_JSON,
        };

        const queryParams = {
            [KEY_LANGUAGE]: "vi",
        };

        const response = await axios.get(`${Constants.URL}/${Constants.UTILS_HOME_NEWS}`, { headers: headers }, { params: queryParams });
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error getHomeNews:', error);
        throw error;
    };
};

// getCommonList
export const getCommonList = async () => {
    try {
        const headers = {
            [KEY_CONTENT_TYPE]: APPLICATION_JSON,
        };

        const response = await axios.get(`${Constants.URL}/${Constants.UTILS_COMMON_LIST}`, { headers: headers });
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error getCommonList:', error);
        throw error;
    };
};

// getMyAppointment
export const getMyAppointment = async (page) => {
    try {
        const queryParams = {
            "page": page.toString(),
            "size": 20,
        };

        const response = await api.get(`/${Constants.DOCTOR_MY_APPOINTMENT}`, { params: queryParams });
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error getMyAppointment:', error);
        throw error;
    };
};

// getAppointment
export const getAppointment = async (appointmentId) => {
    try {
        const response = await api.get(`/${Constants.DOCTOR_GET_APPOINTMENT}/${appointmentId}`)
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error getAppointment:', error);
        throw error;
    };
};

// getAppointmentRating
export const getAppointmentRating = async (appointmentId) => {
    try {
        const response = await api.get(`/${Constants.DOCTOR_GET_APPOINTMENT_RATING}/${appointmentId}`)
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error getAppointmentRating:', error);
        throw error;
    };
};

// createAppointmentRating
export const createAppointmentRating = async (appointmentId, point, comment) => {
    try {
        const item = {
            "appointment_id": appointmentId.toString(),
            "point": point.toString(),
            "comment": comment,
        };
        const response = await api.post(`/${Constants.DOCTOR_APPOINTMENT_RATING}`, item);
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.log('==> Error createAppointmentRating:', error);
        throw error;
    };
};