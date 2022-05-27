const yup = require("yup");

exports.authSchema = yup.object({
    body: yup.object({
        username: yup.string().required("Vui lòng điền username !"),
        password: yup.string().required("Vui lòng điền password !"),
        // secretKey: yup.string().required(),
    })
});

exports.userSchema = yup.object({
    body: yup.object({
        //userId: yup.string().required("Vui lòng điền userId !"),
        email: yup.string().email("Vui lòng nhậpp đúng định dạng mail !").required("Vui lòng điền email !")
    })
})