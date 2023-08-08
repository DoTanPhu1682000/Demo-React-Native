import { getPatientRecordAdd, getPatientRecordDefault } from '../../../redux/actions/updateAction'

export const insert = async (list, isDefault, hoTen, gioiTinh, ngaySinh, isQuocTichVN, phone) => {
    try {
        const item = {
            patientDob: CalendarUtil.convertDate(StringConstant.FORMAT_DISPLAY_DATE, StringConstant.FORMAT_SERVER_DATE, ngaySinh),
            patientGender: gioiTinh,
            patientName: hoTen,
            patientEthic: isQuocTichVN ? "25" : "55",
            patientPhoneNumber: phone,
        };

        let jsonObject = {};
        jsonObject = item;

        // Call createPatientRecord
        const response = await api.post(`/${Constants.PATIENT_RECORD_CREATE}`, jsonObject);
        const patientRecordDto = response.data;
        const patientRecord = patientRecordDto.patientRecord;

        if (isDefault && patientRecord?.code) {
            await api.put(`/${Constants.PATIENT_RECORD_SET_DEFAULT}`, { code: patientRecord.code });
        }
    } catch (error) {
        handleError(error);
    }
};