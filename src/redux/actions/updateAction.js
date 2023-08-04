import axios from 'axios';
import * as Constants from '../../api/AppApiHelper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CAP_NHAT_EMAIL, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, FETCH_USER_DATA_SUCCESS, FETCH_USER_DATA_FAILURE } from "../reducers/infoReducer"
import { FETCH_CATEGORIES_DATA_SUCCESS, FETCH_CATEGORIES_DATA_FAILURE } from '../reducers/categoryReducer'
import { SET_ACCESS_TOKEN_SUCCESS, SET_ACCESS_TOKEN_FAILURE, REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE } from '../reducers/tokenReducer'
import { SET_PATIENT_RECORD_REQUEST, SET_PATIENT_RECORD_SUCCESS, SET_PATIENT_RECORD_FAILURE } from '../reducers/patientRecordReducer'

const KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN';
const KEY_REFRESH_TOKEN = 'KEY_REFRESH_TOKEN';

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

export const updateEmail = (email) => async dispatch => {
    try {
        // 1. Side-effect gọi lên server hoặc làm gì đấy bất đồng bộ (dùng middleware redux-thunk giúp bạn làm việc này)
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 2000)
        })
        await console.log("Đã cập nhật email lên server!")

        // 2. Cập nhật thông tin của infoReducer trong store
        dispatch({ type: CAP_NHAT_EMAIL, email: email })
    } catch (error) {

    }
}

// {"id": 1,"name": "Commodore 64"}
export const getData = () => {
    return async (dispatch) => {
        try {
            const response = await Constants.fetchData();
            dispatch({ type: FETCH_DATA_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
        }
    };
};

// [{"id": 1, "name": "Commodore 64"}, {"id": 2, "name": "Atari 2600"}, {"id": 3, "name": "Sega Master System"}, {"id": 4, "name": "Super Nintendo"}]
export const getUserData = () => {
    return async (dispatch) => {
        try {
            const response = await Constants.fetchUsersData();
            dispatch({ type: FETCH_USER_DATA_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: FETCH_USER_DATA_FAILURE, payload: error.message });
        }
    };
};

// {"categories": [{"idCategory": "1", "strCategory": "Beef"}, {"idCategory": "2", "strCategory": "Chicken"}]}
export const getCategoriesData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
            dispatch({ type: FETCH_CATEGORIES_DATA_SUCCESS, payload: response.data.categories });
        } catch (error) {
            dispatch({ type: FETCH_CATEGORIES_DATA_FAILURE, payload: error.message });
        }
    };
};

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

        return response.data;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.log('Error getRefreshToken:', error);
    }
};

// getPatientRecord
export const getPatientRecord = () => {
    return async (dispatch, useSelector) => {
        try {
            // Gửi action request để hiển thị loading hoặc thực hiện các logic tương ứng
            dispatch({ type: SET_PATIENT_RECORD_REQUEST });

            // Lấy accessToken từ AsyncStorage
            const accessToken = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
            console.log("==> getPatientRecord accessToken: ", accessToken);

            await axios.get(`${Constants.URL}/${Constants.PATIENT_RECORD_BY_USER_KEY}`,
                {
                    headers: {
                        [KEY_CONTENT_TYPE]: APPLICATION_JSON,
                        [KEY_AUTHORIZATION]: `Bearer ${accessToken}`,
                    }
                })
                .then(async (response) => {
                    console.log(response.data)
                    dispatch({ type: SET_PATIENT_RECORD_SUCCESS, payload: response.data });
                })
                .catch(async (error) => {
                    if (error.response && error.response.status === 401) {
                        // Xử lý khi API trả về lỗi 401 (Unauthorized)
                        console.log("Lỗi 401: Unauthorized");
                        try {
                            // Thực hiện gọi hàm để refresh access_token
                            await dispatch(getRefreshToken());
                            // Sau khi access_token mới đã được lưu vào Redux store, tiếp tục gọi lại API getPatientRecord
                            const newToken = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
                            console.log("New accessToken getPatientRecord: ", newToken);

                            // Tiếp tục gọi lại API getPatientRecord sau khi có access_token mới
                            const response = await axios.get(`${Constants.URL}/${Constants.PATIENT_RECORD_BY_USER_KEY}`, {
                                headers: {
                                    [KEY_CONTENT_TYPE]: APPLICATION_JSON,
                                    [KEY_AUTHORIZATION]: `Bearer ${accessToken}`,
                                }
                            });
                            console.log(response.data);
                            dispatch({ type: SET_PATIENT_RECORD_SUCCESS, payload: response.data });
                        } catch (refreshError) {
                            // Xử lý khi refresh access_token cũng gặp lỗi
                            console.log("Lỗi khi refresh access_token: ", refreshError);
                            dispatch({ type: SET_PATIENT_RECORD_FAILURE, payload: refreshError });
                        }
                    } else {
                        // Xử lý khi xảy ra lỗi khác
                        dispatch({ type: SET_PATIENT_RECORD_FAILURE, payload: error });
                        console.log("lỗi khác: ", error);
                    }
                });
        } catch (error) {
            dispatch({ type: SET_PATIENT_RECORD_FAILURE, payload: error });
            console.log(error)
        }
    };
};

// getUserLoginQrCode
export const getUserLoginQrCode = () => {
    return async (dispatch) => {
        try {
            // Lấy accessToken từ AsyncStorage
            const accessToken = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
            console.log("==> getUserLoginQrCode accessToken: ", accessToken);

            await axios.get('https://sandboxapi.365medihome.com.vn/auth/user/get-login-qrcode',
                {
                    headers: {
                        [KEY_CONTENT_TYPE]: APPLICATION_JSON,
                        [KEY_AUTHORIZATION]: `Bearer ${accessToken}`,
                    }
                })
                .then((response) => {
                    console.log(response.data)
                })
        } catch (error) {
            console.log(error);
        }
    };
};