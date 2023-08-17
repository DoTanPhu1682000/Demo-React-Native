export const SET_SELECTED_ITEM_APPOINTMENT_SERVICE = "SET_SELECTED_ITEM_APPOINTMENT_SERVICE";

const initialState = {
    selectedItemAppointmentService: null,
};

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_ITEM_APPOINTMENT_SERVICE:
            return { ...state, selectedItemAppointmentService: action.payload, };
        default:
            return state;
    }
};