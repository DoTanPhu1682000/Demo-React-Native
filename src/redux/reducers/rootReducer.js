import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import patientRecordReducer from "./patientRecordReducer"
import itemPatientRecordReducer from './itemPatientRecordReducer'
import siteReducer from './siteReducer'
import itemSiteReducer from './itemSiteReducer'
import appointmentServiceReducer from './appointmentServiceReducer'
import itemAppointmentServiceReducer from './itemAppointmentServiceReducer'
import doctorReducer from './doctorReducer'
import doctorTimeTableReducer from './doctorTimeTableReducer'

const rootReducer = combineReducers({
    infoReducer,
    patientRecordReducer,
    itemPatientRecordReducer,
    siteReducer,
    itemSiteReducer,
    appointmentServiceReducer,
    itemAppointmentServiceReducer,
    doctorReducer,
    doctorTimeTableReducer,
})

export default (state, action) => rootReducer(state, action)