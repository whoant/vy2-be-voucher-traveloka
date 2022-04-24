const { formatMoney } = require("./utilities.helper");

exports.combineDescriptionVoucher = (condition) => {
	const { threshold, discount, maxAmount } = condition;
	const formatThreshold = formatMoney(threshold);
	const formatMaxAmount = formatMoney(maxAmount);
	if (discount === 0) {
		return `Đơn hàng trị giá trên ${formatThreshold}đ sẽ nhận được giảm giá ${formatMaxAmount}đ`;
	}
	return `Đơn hàng trị giá trên ${formatThreshold}đ sẽ nhận được giảm giá ${discount}%, không vượt quá ${formatMaxAmount}đ`;
}

exports.combineDescriptionGiftCard = (giftCard) => {
	const { discount, typeGift } = giftCard;

	if (typeGift === 'PERCENT') {
		return `Đơn hàng sẽ được giảm giá ${discount}%`;
	}

	return `Đơn hàng sẽ được giảm giá ${formatMoney(discount)} đ`;
}