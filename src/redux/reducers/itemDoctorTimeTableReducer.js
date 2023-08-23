export const SET_SELECTED_ITEM_DOCTOR_TIME_TABLE = "SET_SELECTED_ITEM_DOCTOR_TIME_TABLE";

const initialState = {
    selectedItemDoctorTimeTable: null,
};

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_ITEM_DOCTOR_TIME_TABLE:
            return { ...state, selectedItemDoctorTimeTable: action.payload, };
        default:
            return state;
    }
};