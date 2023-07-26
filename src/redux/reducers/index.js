import { combineReducers } from "redux";
import info from './infoReducer';

const rootReducer = combineReducers({
    personalInfo: info
})

export default (state, action) => rootReducer(state, action)