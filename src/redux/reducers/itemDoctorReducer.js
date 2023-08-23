export const SET_SELECTED_ITEM_DOCTOR = "SET_SELECTED_ITEM_DOCTOR";

const initialState = {
    selectedItemDoctor: null,
};

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_ITEM_DOCTOR:
            return { ...state, selectedItemDoctor: action.payload, };
        default:
            return state;
    }
};