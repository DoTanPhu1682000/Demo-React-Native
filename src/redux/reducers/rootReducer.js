import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import categoryReducer from './categoryReducer'
import accessTokenReducer from "./accessTokenReducer"
import refreshTokenReducer from "./refreshTokenReducer"
import patientRecordReducer from "./patientRecordReducer"

const rootReducer = combineReducers({
    infoReducer,
    categoryReducer,
    accessTokenReducer,
    refreshTokenReducer,
    patientRecordReducer,
})

export default (state, action) => rootReducer(state, action)