function formatDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        return 'Invalid date format';
    }

    const [year, month, day] = parts;
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

export default formatDate;