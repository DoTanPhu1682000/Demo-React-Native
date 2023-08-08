export const SET_PATIENT_RECORD_DEFAULT_REQUEST = "SET_PATIENT_RECORD_DEFAULT_REQUEST";
export const SET_PATIENT_RECORD_DEFAULT_SUCCESS = "SET_PATIENT_RECORD_DEFAULT_SUCCESS";
export const SET_PATIENT_RECORD_DEFAULT_FAILURE = "SET_PATIENT_RECORD_DEFAULT_FAILURE";

const initialState = {
    isLoading: false,
    patientRecord: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PATIENT_RECORD_DEFAULT_REQUEST:
            return { ...state, isLoading: true };
        case SET_PATIENT_RECORD_DEFAULT_SUCCESS:
            return { ...state, isLoading: false, patientRecord: action.payload, error: null };
        case SET_PATIENT_RECORD_DEFAULT_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state
    }
}