import axios from 'axios';
import * as Constants from '../../api/AppApiHelper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CAP_NHAT_EMAIL, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, FETCH_USER_DATA_SUCCESS, FETCH_USER_DATA_FAILURE } from "../reducers/infoReducer"
import { FETCH_CATEGORIES_DATA_SUCCESS, FETCH_CATEGORIES_DATA_FAILURE } from '../reducers/categoryReducer'
import { SET_ACCESS_TOKEN_SUCCESS, SET_ACCESS_TOKEN_FAILURE, REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE } from '../reducers/tokenReducer'
import { SET_PATIENT_RECORD_REQUEST, SET_PATIENT_RECORD_SUCCESS, SET_PATIENT_RECORD_FAILURE } from '../reducers/patientRecordReducer'

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
export const getAccessToken = (navigation, phone, password) => {
    return async (dispatch) => {
        try {
            await axios.post(`${Constants.URL}/${Constants.LOGIN}`,
                {
                    username: phone,
                    password: password,
                    grant_type: 'password'
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic bWVkaWhvbWU6bWVkaWhvbWVAMTIzNEAjJA=='
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    // Lưu accessToken vào Redux store
                    const accessToken = response.data.access_token;
                    dispatch({ type: SET_ACCESS_TOKEN_SUCCESS, payload: accessToken });

                    // Lưu refreshToken vào Redux store
                    const refreshToken = response.data.refresh_token;
                    dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: refreshToken });

                    if (accessToken) {
                        // Điều hướng đến màn hình HomeScreen
                        navigation.navigate('HomeTabs')
                    }
                })
        } catch (error) {
            dispatch({ type: SET_ACCESS_TOKEN_FAILURE, payload: error });
            console.log(error);
        }
    };
};

// refreshToken
export const getRefreshToken = () => {
    return async (dispatch, useSelector) => {
        try {
            // Gửi action refresh token request để hiển thị loading hoặc thực hiện các logic tương ứng
            dispatch({ type: REFRESH_TOKEN_REQUEST });

            // Lấy refreshToken từ Redux Store
            const token = useSelector((state) => state.tokenReducer.refresh_token);
            const refreshToken = token.tokenReducer.refresh_token

            await axios.post(`${Constants.URL}/${Constants.LOGIN}`,
                {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic bWVkaWhvbWU6bWVkaWhvbWVAMTIzNEAjJA=='
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    // Lưu accessToken mới vào Redux store
                    const accessToken = response.data.access_token;
                    dispatch({ type: SET_ACCESS_TOKEN_SUCCESS, payload: accessToken });

                    // Lưu refreshToken mới vào Redux store
                    const refreshToken = response.data.refresh_token;
                    dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: refreshToken });

                    // Trả về newToken để sử dụng cho các yêu cầu API tiếp theo (nếu cần)
                    return accessToken
                })
        } catch (error) {
            dispatch({ type: REFRESH_TOKEN_FAILURE, payload: error });
            console.log(error);
        }
    };
};

// getPatientRecord
export const getPatientRecord = () => {
    return async (dispatch, useSelector) => {
        try {
            // Gửi action request để hiển thị loading hoặc thực hiện các logic tương ứng
            dispatch({ type: SET_PATIENT_RECORD_REQUEST });

            // Lấy access_token từ Redux store
            const access_token = useSelector((state) => state.tokenReducer.access_token);
            const accessToken = access_token.tokenReducer.access_token
            console.log("accessToken getPatientRecord: ", accessToken)

            await axios.get(`${Constants.URL}/${Constants.PATIENT_RECORD_BY_USER_KEY}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
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
                            const newAccessToken = useSelector((state) => state.tokenReducer.access_token);
                            const newToken = newAccessToken.tokenReducer.access_token;
                            console.log("New accessToken getPatientRecord: ", newToken);

                            // Tiếp tục gọi lại API getPatientRecord sau khi có access_token mới
                            const response = await axios.get(`${Constants.URL}/${Constants.PATIENT_RECORD_BY_USER_KEY}`, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${newToken}`,
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