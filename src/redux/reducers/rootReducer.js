import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import patientRecordReducer from "./patientRecordReducer"

const rootReducer = combineReducers({
    infoReducer,
    patientRecordReducer,
})

export default (state, action) => rootReducer(state, action)