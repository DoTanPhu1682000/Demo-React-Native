export const SET_SELECTED_ITEM_PATIENT_RECORD = "SET_SELECTED_ITEM_PATIENT_RECORD";

const initialState = {
    selectedItemPatientRecord: null,
};

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_ITEM_PATIENT_RECORD:
            return { ...state, selectedItemPatientRecord: action.payload, };
        default:
            return state;
    }
};