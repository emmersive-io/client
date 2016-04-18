// Trimmed down date humanization function to customize output in lieu of MomentJS bloat

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function getDate(date) {
    var today = new Date();
    if (isSameDay(date, today)) {
        return 'today';
    }

    var yesterday = new Date(today.getTime());
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(date, yesterday)) {
        return 'yesterday';
    }

    var year = date.getFullYear();
    var dateString = months[date.getMonth()] + ' ' + date.getDate();
    if (year !== today.getFullYear()) {
        return dateString + ', ' + year;
    }

    return dateString;
}

function getTime(date) {
    var period;
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (hours > 11) {
        hours -= 12;
        period = 'pm';
    }
    else {
        hours = hours || 12;
        period = 'am';
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return hours + ':' + minutes + period;
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function humanizeDate(dateTime) {
    var duration = Date.now() - dateTime;
    if (duration < 12e4) { // Less than 2min basically just happened
        return 'just now';
    }

    if (duration < 33e5) { // Measure 2m - 55m in minutes
        return Math.round(duration / 6e4) + 'm';
    }

    if (duration < 432e5) { // Measure 1hr - 12hr in hours
        return Math.round(duration / 36e5) + 'h';
    }

    // For anything more than 12 hours old, use a full date string
    var date = new Date(dateTime);
    return getDate(date) + ' at ' + getTime(date);
}

export {humanizeDate};