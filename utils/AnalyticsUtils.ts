export const formatDateToShortWithYear = (dateString: string) => {
    'worklet';
    const date = new Date(dateString + 'T00:00:00');

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day}, ${date.getFullYear()}`;
}