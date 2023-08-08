export const SET_KEY_REQUEST = "SET_KEY_REQUEST";
export const SET_LOGIN_PHONE_SUCCESS = "SET_LOGIN_PHONE_SUCCESS";
export const SET_LOGIN_PHONE_FAILURE = "SET_LOGIN_PHONE_FAILURE";

const initialState = {
    isLoading: false,
    phone: null,
    phone_error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_KEY_REQUEST:
            return { ...state, isLoading: true, };
        case SET_LOGIN_PHONE_SUCCESS:
            return { ...state, isLoading: false, phone: action.payload, phone_error: null, };
        case SET_LOGIN_PHONE_FAILURE:
            return { ...state, isLoading: false, phone_error: action.payload, };
        default:
            return state
    }
}