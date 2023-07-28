import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import categoryReducer from './categoryReducer'
import loginReducer from "./loginReducer"

const rootReducer = combineReducers({
    infoReducer,
    categoryReducer,
    loginReducer,
})

export default (state, action) => rootReducer(state, action)