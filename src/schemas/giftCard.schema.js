const yup = require("yup");

exports.giftCardSchema = yup.object({
	body: yup.object({
		title: yup.string().required(),
		content: yup.string().required(),
		limitUse: yup.number().required().positive().integer(),
		giftCardCode: yup.string().required(),
		typeGift: yup.string().required(),
		limitDay: yup.number().required().positive().integer(),
		effectiveAt: yup.date().required(),
		expirationAt: yup.date().required(),
		discount: yup.number().required().positive().integer(),
		pointExchange: yup.number().required().positive().integer(),
	})
});