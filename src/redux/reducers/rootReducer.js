import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import patientRecordReducer from "./patientRecordReducer"
import itemPatientRecordReducer from './itemPatientRecordReducer'
import siteReducer from './siteReducer'

const rootReducer = combineReducers({
    infoReducer,
    patientRecordReducer,
    itemPatientRecordReducer,
    siteReducer,
})

export default (state, action) => rootReducer(state, action)