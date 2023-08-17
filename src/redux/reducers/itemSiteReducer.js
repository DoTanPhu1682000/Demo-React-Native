export const SET_SELECTED_ITEM_SITE = "SET_SELECTED_ITEM_SITE";

const initialState = {
    selectedItemSite: null,
};

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_ITEM_SITE:
            return { ...state, selectedItemSite: action.payload, };
        default:
            return state;
    }
};