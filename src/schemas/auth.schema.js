const yup = require("yup");

exports.authSchema = yup.object({
	body: yup.object({
		username: yup.string().required(),
		password: yup.string().required(),
		// secretKey: yup.string().required(),
	})
});