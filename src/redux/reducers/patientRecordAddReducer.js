export const SET_PATIENT_RECORD_ADD_REQUEST = "SET_PATIENT_RECORD_ADD_REQUEST";
export const SET_PATIENT_RECORD_ADD_SUCCESS = "SET_PATIENT_RECORD_ADD_SUCCESS";
export const SET_PATIENT_RECORD_ADD_FAILURE = "SET_PATIENT_RECORD_ADD_FAILURE";

const initialState = {
    isLoading: false,
    patientRecordAdd: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PATIENT_RECORD_ADD_REQUEST:
            return { ...state, isLoading: true };
        case SET_PATIENT_RECORD_ADD_SUCCESS:
            return { ...state, isLoading: false, patientRecordAdd: action.payload, error: null };
        case SET_PATIENT_RECORD_ADD_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state
    }
}