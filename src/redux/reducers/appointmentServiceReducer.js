export const SET_APPOINTMENT_SERVICE_REQUEST = "SET_APPOINTMENT_SERVICE_REQUEST";
export const SET_APPOINTMENT_SERVICE_SUCCESS = "SET_APPOINTMENT_SERVICE_SUCCESS";
export const SET_APPOINTMENT_SERVICE_FAILURE = "SET_APPOINTMENT_SERVICE_FAILURE";

const initialState = {
    isLoading: false,
    appointmentServiceList: null,
    error: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_APPOINTMENT_SERVICE_REQUEST:
            return { ...state, isLoading: true };
        case SET_APPOINTMENT_SERVICE_SUCCESS:
            return { ...state, isLoading: false, appointmentServiceList: action.payload, error: null };
        case SET_APPOINTMENT_SERVICE_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state
    }
}