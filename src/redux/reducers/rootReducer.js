import { combineReducers } from "redux";
import patientRecordReducer from "./patientRecordReducer"
import siteReducer from './siteReducer'
import appointmentServiceReducer from './appointmentServiceReducer'
import doctorReducer from './doctorReducer'
import doctorTimeTableReducer from './doctorTimeTableReducer'
import itemPatientRecordReducer from './itemPatientRecordReducer'
import itemSiteReducer from './itemSiteReducer'
import itemAppointmentServiceReducer from './itemAppointmentServiceReducer'
import itemDoctorReducer from './itemDoctorReducer'
import itemDoctorTimeTableReducer from './itemDoctorTimeTableReducer'

const rootReducer = combineReducers({
    patientRecordReducer,
    siteReducer,
    appointmentServiceReducer,
    doctorReducer,
    doctorTimeTableReducer,
    itemPatientRecordReducer,
    itemSiteReducer,
    itemAppointmentServiceReducer,
    itemDoctorReducer,
    itemDoctorTimeTableReducer,
})

export default (state, action) => rootReducer(state, action)