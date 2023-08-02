import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import categoryReducer from './categoryReducer'
import accessTokenReducer from "./accessTokenReducer"
import refreshTokenReducer from "./refreshTokenReducer"
import patientRecordReducer from "./patientRecordReducer"
import tokenReducer from "./tokenReducer"

const rootReducer = combineReducers({
    infoReducer,
    categoryReducer,
    accessTokenReducer,
    refreshTokenReducer,
    patientRecordReducer,
    tokenReducer,
})

export default (state, action) => rootReducer(state, action)