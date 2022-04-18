const moment = require('moment');

exports.compareDate = (firstDate, secondDate) => {
	return moment(firstDate).isBefore(secondDate);
};

exports.formatMoney = (money) => {
	return money.split('').reverse().reduce((prev, next, index) => {
		return ((index % 3) ? next : (next + ',')) + prev
	});
};