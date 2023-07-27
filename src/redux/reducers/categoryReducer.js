export const FETCH_CATEGORIES_DATA_SUCCESS = "FETCH_CATEGORIES_DATA_SUCCESS";
export const FETCH_CATEGORIES_DATA_FAILURE = "FETCH_CATEGORIES_DATA_FAILURE";

const initialState = {
    categoriesData: [],
    errorCategories: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_CATEGORIES_DATA_SUCCESS':
            return { ...state, categoriesData: action.payload, errorCategories: null };
        case 'FETCH_CATEGORIES_DATA_FAILURE':
            return { ...state, categoriesData: [], errorCategories: action.payload };
        default:
            return state
    }
}