import axios from 'axios';
import * as Constants from '../../api/AppApiHelper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CAP_NHAT_EMAIL, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, FETCH_USER_DATA_SUCCESS, FETCH_USER_DATA_FAILURE } from "../reducers/infoReducer"
import { FETCH_CATEGORIES_DATA_SUCCESS, FETCH_CATEGORIES_DATA_FAILURE } from '../reducers/categoryReducer'
import { SET_ACCESS_TOKEN_SUCCESS, SET_ACCESS_TOKEN_FAILURE } from '../reducers/accessTokenReducer'
import { REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE } from '../reducers/refreshTokenReducer'
import { SET_PATIENT_RECORD_REQUEST, SET_PATIENT_RECORD_SUCCESS, SET_PATIENT_RECORD_FAILURE } from '../reducers/patientRecordReducer'

const KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN';
const KEY_REFRESH_TOKEN = 'KEY_REFRESH_TOKEN';

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

                    if (accessToken) {
                        // Lưu accessToken vào AsyncStorage
                        AsyncStorage.setItem(KEY_ACCESS_TOKEN, response.data.access_token)
                        // Lưu refreshToken vào AsyncStorage
                        AsyncStorage.setItem(KEY_REFRESH_TOKEN, response.data.refresh_token)

                        // Điều hướng đến màn hình HomeScreen
                        navigation.navigate('HomeTabs')
                    }
                })
        } catch (error) {
            dispatch({ type: SET_ACCESS_TOKEN_FAILURE, payload: error });
        }
    };
};

// refreshToken
export const getRefreshToken = () => {
    return async (dispatch) => {
        try {
            // Gửi action refresh token request để hiển thị loading hoặc thực hiện các logic tương ứng
            dispatch({ type: REFRESH_TOKEN_REQUEST });

            // Lấy refreshToken từ AsyncStorage
            const refreshToken = await AsyncStorage.getItem(KEY_REFRESH_TOKEN);

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
                    // Lưu accessToken mới vào AsyncStorage
                    AsyncStorage.setItem(KEY_ACCESS_TOKEN, response.data.access_token)
                    // Lưu refreshToken mới vào AsyncStorage
                    AsyncStorage.setItem(KEY_REFRESH_TOKEN, response.data.refresh_token)

                    // Nếu API gọi thành công, cập nhật token mới vào Redux store
                    const newToken = response.data.access_token;
                    dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: newToken });

                    // Trả về newToken để sử dụng cho các yêu cầu API tiếp theo (nếu cần)
                    return newToken
                })
        } catch (error) {
            dispatch({ type: REFRESH_TOKEN_FAILURE, payload: error });
            throw error
        }
    };
};

// getPatientRecord
export const getPatientRecord = () => {
    return async (dispatch, useSelector) => {
        try {
            // Gửi action request để hiển thị loading hoặc thực hiện các logic tương ứng
            dispatch({ type: SET_PATIENT_RECORD_REQUEST });

            // Lấy access_token từ AsyncStorage
            // const accessToken = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);

            // Lấy access_token từ Redux store
            const access_token = useSelector((state) => state.accessTokenReducer.access_token);
            const accessToken = access_token.accessTokenReducer.access_token
            console.log(accessToken)

            await axios.get(`${Constants.URL}/${Constants.PATIENT_RECORD_BY_USER_KEY}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    dispatch({ type: SET_PATIENT_RECORD_SUCCESS, payload: response.data.patient_record });
                })
        } catch (error) {
            dispatch({ type: SET_PATIENT_RECORD_FAILURE, payload: error });
            console.log(error)
        }
    };
};