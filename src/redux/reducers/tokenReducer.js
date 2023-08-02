export const SET_ACCESS_TOKEN_SUCCESS = "SET_ACCESS_TOKEN_SUCCESS";
export const SET_ACCESS_TOKEN_FAILURE = "SET_ACCESS_TOKEN_FAILURE";
export const REFRESH_TOKEN_REQUEST = "REFRESH_TOKEN_REQUEST";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const REFRESH_TOKEN_FAILURE = "REFRESH_TOKEN_FAILURE";

const initialState = {
    access_token: null,
    accessError: null,
    isLoading: false,
    refresh_token: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ACCESS_TOKEN_SUCCESS:
            return { ...state, access_token: action.payload, accessError: null, };
        case SET_ACCESS_TOKEN_FAILURE:
            return { ...state, accessError: action.payload, };
        case REFRESH_TOKEN_REQUEST:
            return { ...state, isLoading: true, };
        case REFRESH_TOKEN_SUCCESS:
            return { ...state, isLoading: false, refresh_token: action.payload, error: null, };
        case REFRESH_TOKEN_FAILURE:
            return { ...state, isLoading: false, error: action.payload, };
        default:
            return state
    }
}