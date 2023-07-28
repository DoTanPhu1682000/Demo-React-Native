import axios from 'axios';
import { CAP_NHAT_EMAIL, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, FETCH_USER_DATA_SUCCESS, FETCH_USER_DATA_FAILURE } from "../reducers/infoReducer"
import { FETCH_CATEGORIES_DATA_SUCCESS, FETCH_CATEGORIES_DATA_FAILURE } from '../reducers/categoryReducer'
import { SET_ACCESS_TOKEN } from '../reducers/loginReducer'
import * as Constants from '../../api/AppApiHelper';

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
                    const accessToken = response.data.access_token;
                    console.log(response.data)
                    dispatch({ type: SET_ACCESS_TOKEN, payload: accessToken });

                    if (accessToken) {
                        // Điều hướng đến màn hình HomeScreen
                        navigation.navigate('HomeTabs')
                    }
                })
        } catch (error) {
            console.error('Lỗi khi gọi API get-access-token:', error);
        }
    };
};