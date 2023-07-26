export const CAP_NHAT_EMAIL = "CAP_NHAT_EMAIL";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";
export const FETCH_USER_DATA_SUCCESS = "FETCH_USER_DATA_SUCCESS";
export const FETCH_USER_DATA_FAILURE = "FETCH_USER_DATA_FAILURE";

const initialState = {
    email: "",
    data: null,
    error: null,
    dataUser: null,
    errorUser: null,
    categoriesData: [],
    errorCategories: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case "CAP_NHAT_EMAIL":
            return { ...state, email: action.email }
        case 'FETCH_DATA_SUCCESS':
            return { ...state, data: action.payload, error: null }
        case 'FETCH_DATA_FAILURE':
            return { ...state, data: null, error: action.payload }
        case 'FETCH_USER_DATA_SUCCESS':
            return { ...state, dataUser: action.payload, errorUser: null }
        case 'FETCH_USER_DATA_FAILURE':
            return { ...state, dataUser: null, errorUser: action.payload }
        case 'FETCH_CATEGORIES_DATA_SUCCESS':
            return { ...state, categoriesData: action.payload, errorCategories: null };
        case 'FETCH_CATEGORIES_DATA_FAILURE':
            return { ...state, categoriesData: [], errorCategories: action.payload };
        default:
            return state
    }
}