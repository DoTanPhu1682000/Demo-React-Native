export const SET_DOCTOR_REQUEST = "SET_DOCTOR_REQUEST";
export const SET_DOCTOR_SUCCESS = "SET_DOCTOR_SUCCESS";
export const SET_DOCTOR_FAILURE = "SET_DOCTOR_FAILURE";

const initialState = {
    isLoading: false,
    doctorList: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_DOCTOR_REQUEST:
            return { ...state, isLoading: true };
        case SET_DOCTOR_SUCCESS:
            return { ...state, isLoading: false, doctorList: action.payload, error: null };
        case SET_DOCTOR_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state
    }
}