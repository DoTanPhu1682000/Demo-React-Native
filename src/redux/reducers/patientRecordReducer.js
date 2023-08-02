export const SET_PATIENT_RECORD_REQUEST = "SET_PATIENT_RECORD_REQUEST";
export const SET_PATIENT_RECORD_SUCCESS = "SET_PATIENT_RECORD_SUCCESS";
export const SET_PATIENT_RECORD_FAILURE = "SET_PATIENT_RECORD_FAILURE";

const initialState = {
    isLoading: false,
    patientRecord: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PATIENT_RECORD_REQUEST:
            return { ...state, isLoading: true };
        case SET_PATIENT_RECORD_SUCCESS:
            return { ...state, isLoading: false, patientRecord: action.payload, error: null };
        case SET_PATIENT_RECORD_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state
    }
}