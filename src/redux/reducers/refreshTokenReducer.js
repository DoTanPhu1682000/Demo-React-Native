export const REFRESH_TOKEN_REQUEST = "REFRESH_TOKEN_REQUEST";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const REFRESH_TOKEN_FAILURE = "REFRESH_TOKEN_FAILURE";

const initialState = {
    isLoading: false,
    token: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case REFRESH_TOKEN_REQUEST:
            return { ...state, isLoading: true, };
        case REFRESH_TOKEN_SUCCESS:
            return { ...state, isLoading: false, token: action.payload, error: null, };
        case REFRESH_TOKEN_FAILURE:
            return { ...state, isLoading: false, error: action.payload, };
        default:
            return state
    }
}