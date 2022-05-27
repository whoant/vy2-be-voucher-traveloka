const yup = require("yup");

exports.giftCardSchema = yup.object({
    body: yup.object({
        title: yup.string().required(),
        content: yup.string().required(),
        limitUse: yup.number().min(0).required().positive().integer(),
        giftCardCode: yup.string().required(),
        effectiveAt: yup.date().required(),
        expirationAt: yup.date().required(),
        discount: yup.number().min(0).max(100).required().positive().integer(),
        threshold: yup.number().min(0).required().positive().integer(),
        maxAmount: yup.number().min(0).required().positive().integer(),
        pointExchange: yup.number().min(0).required().positive().integer(),
    })
});