import { combineReducers } from "redux";
import infoReducer from './infoReducer';
import patientRecordReducer from "./patientRecordReducer"
import siteReducer from './siteReducer'
import appointmentServiceReducer from './appointmentServiceReducer'
import doctorReducer from './doctorReducer'
import doctorTimeTableReducer from './doctorTimeTableReducer'
import calculateFeeReducer from './calculateFeeReducer'
import itemPatientRecordReducer from './itemPatientRecordReducer'
import itemSiteReducer from './itemSiteReducer'
import itemAppointmentServiceReducer from './itemAppointmentServiceReducer'
import itemDoctorReducer from './itemDoctorReducer'
import itemDoctorTimeTableReducer from './itemDoctorTimeTableReducer'

const rootReducer = combineReducers({
    infoReducer,
    patientRecordReducer,
    itemPatientRecordReducer,
    siteReducer,
    itemSiteReducer,
    appointmentServiceReducer,
    itemAppointmentServiceReducer,
    doctorReducer,
    itemDoctorReducer,
    doctorTimeTableReducer,
    calculateFeeReducer,
    itemDoctorTimeTableReducer,
})

export default (state, action) => rootReducer(state, action)