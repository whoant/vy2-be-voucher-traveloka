const moment = require('moment');

exports.compareDate = (firstDate, secondDate) => {
	return moment(firstDate).isBefore(secondDate);
};