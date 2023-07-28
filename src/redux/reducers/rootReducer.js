import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import categoryReducer from './categoryReducer'
import accessTokenReducer from "./accessTokenReducer"
import refreshTokenReducer from "./refreshTokenReducer"

const rootReducer = combineReducers({
    infoReducer,
    categoryReducer,
    accessTokenReducer,
    refreshTokenReducer,
})

export default (state, action) => rootReducer(state, action)