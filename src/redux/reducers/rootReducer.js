import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import categoryReducer from './categoryReducer'

const rootReducer = combineReducers({
    infoReducer: infoReducer,
    categoryReducer: categoryReducer
})

export default (state, action) => rootReducer(state, action)