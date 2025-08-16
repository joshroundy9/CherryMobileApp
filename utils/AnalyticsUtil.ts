export const getTimeframeName = (timeframe: number) => {
    switch (timeframe) {
        case 7:
            return "Weekly";
        case 30:
            return "Monthly";
        case 90:
            return "Quarterly";
        case 365:
            return "Yearly";
        default:
            return `${timeframe} Day`;
    }
}
export const formatDateToShort = (dateString: string) => {
    'worklet';
    const date = new Date(dateString);
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day}`;
}