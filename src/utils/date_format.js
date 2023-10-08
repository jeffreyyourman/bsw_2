import moment from 'moment-timezone';

export const formatDate = (dateStr) => {
    console.log('dateStr',dateStr);
    const parsedDate = moment(dateStr, 'ddd, MMMM Do [at] h:mm A z');

    if (!parsedDate.isValid()) {
        return "Invalid date";
    }

    // Extract timezone abbreviation from the input string
    const matches = dateStr.match(/\b(EDT|EST|CDT|CST|MDT|MST|PDT|PST)\b/);
    let zoneAbbr = matches ? matches[0] : '';
    if (zoneAbbr === 'EDT' || zoneAbbr === 'EST') {
        zoneAbbr = 'ET';
    }
    return parsedDate.format(`ddd - h:mma [${zoneAbbr}]`);
};


// export const formatDate = (dateStr) => {
//     // Update the format string to correctly parse the date
//     const parsedDate = moment(dateStr, 'ddd, MMMM Do [at] h:mm A z');

//     // Check if the parsed date is valid
//     if (!parsedDate.isValid()) {
//         return "Invalid date";
//     }

//     // Get the timezone abbreviation
//     const zoneAbbr = parsedDate.format('z');

//     // Return the desired format
//     return parsedDate.format(`ddd - h:mm a [${zoneAbbr}]`);
// };

// export const formatDate = (dateStr) => {
//     return moment(dateStr).format('ddd - h:mm a');
// };

// export const formatDate = (dateStr) => {
//     const localZone = moment.tz(dateStr, moment.tz.guess()).zoneAbbr();
//     return moment(dateStr).format(`ddd - h:mm a [${localZone}]`);
// };

// Format: Sun - 9:30 am ET
// export const formatDate = (dateStr) => {
//     return moment(dateStr).format('ddd - h:mm a') + ' ET';
// };

// Format: 9:30 am
export const formatTime = (dateStr) => {
    return moment(dateStr).format('h:mm a');
};

// Format: Sunday, 6 October 2023
export const fullDateFormat = (dateStr) => {
    return moment(dateStr).format('dddd, D MMMM YYYY');
};

// Format: 6 October 2023
export const dayMonthYear = (dateStr) => {
    return moment(dateStr).format('D MMMM YYYY');
};

// Format: 06/10/2023 (day/month/year)
export const numericDate = (dateStr) => {
    return moment(dateStr).format('DD/MM/YYYY');
};
