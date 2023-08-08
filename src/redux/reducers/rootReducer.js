import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import categoryReducer from './categoryReducer'
import loginInfoReducer from "./loginInfoReducer"
import patientRecordReducer from "./patientRecordReducer"
import patientRecordAddReducer from "./patientRecordAddReducer"
import patientRecordDefaultReducer from "./patientRecordDefaultReducer"

const rootReducer = combineReducers({
    infoReducer,
    categoryReducer,
    loginInfoReducer,
    patientRecordReducer,
    patientRecordAddReducer,
    patientRecordDefaultReducer,
})

export default (state, action) => rootReducer(state, action)