export const SET_ACCESS_TOKEN_SUCCESS = "SET_ACCESS_TOKEN_SUCCESS";
export const SET_ACCESS_TOKEN_FAILURE = "SET_ACCESS_TOKEN_FAILURE";

const initialState = {
    access_token: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ACCESS_TOKEN_SUCCESS:
            return { ...state, access_token: action.payload, error: null, };
        case SET_ACCESS_TOKEN_FAILURE:
            return { ...state, error: action.payload, };
        default:
            return state
    }
}