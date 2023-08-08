import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import categoryReducer from './categoryReducer'
import tokenReducer from "./tokenReducer"
import patientRecordReducer from "./patientRecordReducer"
import patientRecordAddReducer from "./patientRecordAddReducer"
import patientRecordDefaultReducer from "./patientRecordDefaultReducer"

const rootReducer = combineReducers({
    infoReducer,
    categoryReducer,
    tokenReducer,
    patientRecordReducer,
    patientRecordAddReducer,
    patientRecordDefaultReducer,
})

export default (state, action) => rootReducer(state, action)