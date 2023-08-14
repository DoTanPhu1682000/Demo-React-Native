export const SET_SITE_REQUEST = "SET_SITE_REQUEST";
export const SET_SITE_SUCCESS = "SET_SITE_SUCCESS";
export const SET_SITE_FAILURE = "SET_SITE_FAILURE";

const initialState = {
    isLoading: false,
    siteList: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SITE_REQUEST:
            return { ...state, isLoading: true };
        case SET_SITE_SUCCESS:
            return { ...state, isLoading: false, siteList: action.payload, error: null };
        case SET_SITE_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state
    }
}