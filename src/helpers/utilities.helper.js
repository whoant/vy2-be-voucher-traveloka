const moment = require('moment');

exports.compareDate = (firstDate, secondDate) => {
	return moment(firstDate).isBefore(secondDate);
};

exports.formatMoney = (money) => {
	return money.split('').reverse().reduce((prev, next, index) => {
		return ((index % 3) ? next : (next + ',')) + prev
	});
};

exports.randomString = length => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}

	return result;
};