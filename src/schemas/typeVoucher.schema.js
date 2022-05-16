const yup = require("yup");

exports.typeVoucherSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        type: yup.string().required(),
    })
});