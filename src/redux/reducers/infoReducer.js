export const CAP_NHAT_EMAIL = "CAP_NHAT_EMAIL";

const initialState = {
    email: "",
}

export default function actionForReducer(state = initialState, action) {
    switch (action.type) {
        case "CAP_NHAT_EMAIL":
            return { ...state, email: action.email }
        default:
            return state
    }
}