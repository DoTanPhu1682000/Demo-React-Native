export const SET_CALCULATE_FEE_REQUEST = "SET_CALCULATE_FEE_REQUEST";
export const SET_CALCULATE_FEE_SUCCESS = "SET_CALCULATE_FEE_SUCCESS";
export const SET_CALCULATE_FEE_FAILURE = "SET_CALCULATE_FEE_FAILURE";

const initialState = {
    isLoading: false,
    calculateFee: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CALCULATE_FEE_REQUEST:
            return { ...state, isLoading: true };
        case SET_CALCULATE_FEE_SUCCESS:
            return { ...state, isLoading: false, calculateFee: action.payload, error: null };
        case SET_CALCULATE_FEE_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state
    }
}