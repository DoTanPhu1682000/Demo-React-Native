import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import categoryReducer from './categoryReducer'
import tokenReducer from "./tokenReducer"
import patientRecordReducer from "./patientRecordReducer"

const rootReducer = combineReducers({
    infoReducer,
    categoryReducer,
    tokenReducer,
    patientRecordReducer,
})

export default (state, action) => rootReducer(state, action)