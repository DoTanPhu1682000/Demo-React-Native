export const SET_DOCTOR_TIME_TABLE_REQUEST = "SET_DOCTOR_TIME_TABLE_REQUEST";
export const SET_DOCTOR_TIME_TABLE_SUCCESS = "SET_DOCTOR_TIME_TABLE_SUCCESS";
export const SET_DOCTOR_TIME_TABLE_FAILURE = "SET_DOCTOR_TIME_TABLE_FAILURE";

const initialState = {
    isLoading: false,
    doctorTimeTable: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_DOCTOR_TIME_TABLE_REQUEST:
            return { ...state, isLoading: true };
        case SET_DOCTOR_TIME_TABLE_SUCCESS:
            return { ...state, isLoading: false, doctorTimeTable: action.payload, error: null };
        case SET_DOCTOR_TIME_TABLE_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state
    }
}