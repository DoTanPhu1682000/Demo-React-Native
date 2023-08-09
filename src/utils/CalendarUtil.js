// FORMAT_DISPLAY_DATE: "dd/MM/yyyy"
export const formatDate = (dateString) => {
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        return 'Invalid date format';
    }

    const [year, month, day] = parts;
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

// FORMAT_SERVER_DATE: "yyyy-MM-dd"
export const formatISODateToServerDate = (isoDateString) => {
    const isoDate = new Date(isoDateString);
    const formattedDate = isoDate.toISOString().split("T")[0];
    return formattedDate;
}