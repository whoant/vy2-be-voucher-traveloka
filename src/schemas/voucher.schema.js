const yup = require("yup");

exports.voucherSchema = yup.object({
	body: yup.object({
		title: yup.string().required(),
		content: yup.string().required(),
		limitUse: yup.number().required().positive().integer(),
		voucherCode: yup.string().required(),
		limitDay: yup.number().required().positive().integer(),
		amount: yup.number().required().positive().integer(),
		effectiveAt: yup.date().required(),
		expirationAt: yup.date().required(),
		threshold: yup.number().required().positive().integer(),
		discount: yup.number().required().positive().integer(),
		maxAmount: yup.number().required().positive().integer()
	})
});