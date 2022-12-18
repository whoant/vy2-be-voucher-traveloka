const yup = require("yup");

exports.giftCardSchema = yup.object({
    body: yup.object({
        title: yup.string().required('Tiêu đề phải tồn tại'),
        content: yup.string().required('Nội dung phải tồn tại'),
        limitUse: yup.number().min(0, 'Số người sử dụng phải là số nguyên dương').required().integer('Số người sử dụng phải là số nguyên dương'),
        giftCardCode: yup.string().required('Mã thẻ quà tặng không tồn tại'),
        effectiveAt: yup.date().typeError('Ngày áp dụng không đúng định dạng').required('Ngày hiệu lực phải tồn tại'),
        expirationAt: yup.date().typeError('Ngày hết hạn không đúng định dạng').required('Ngày hết hạn phải tồn tại'),
        discount: yup.number().typeError('Phần trăm phải là số').min(0, 'Số phần trăm giảm không nhỏ hơn 0').max(100, 'Số phần trăm giảm không vượt quá 100').required('Phần trăm giảm phải tồn tại').integer('Phần trăm giảm phải là số nguyên dương'),
        threshold: yup.number().min(0, 'Ngưỡng nhận tiền không được bé hơn 0').required().integer('Ngưỡng nhận tiền phải là số nguyên dương'),
        maxAmount: yup.number().min(0, 'Số tiền tối đa có thể nhận được không được bé hơn 0').required().integer('Số tiền tối đa có thể nhận được phải là số nguyên dương'),
        pointExchange: yup.number().min(0, 'Số điểm quy đổi không được nhỏ hơn 0').required().integer(),
    })
});