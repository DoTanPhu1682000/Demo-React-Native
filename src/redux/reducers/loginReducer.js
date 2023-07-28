export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";

const initialState = {
    access_token: null,
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ACCESS_TOKEN:
            return { ...state, access_token: action.payload };
        default:
            return state
    }
}