const catchAsync = require('../helpers/catchAsync.helper');
const PartnerTypeVoucherService = require("../services/PartnerTypeVoucher");

exports.paramTypeVoucher = catchAsync(async (req, res, next) => {
    let typeVoucher = req.query?.typeVoucher;
    const partnerId = req.get('partner_id');
    if (!typeVoucher) typeVoucher = req.body?.typeVoucher;
    const partnerTypeVoucher = new PartnerTypeVoucherService();
    await partnerTypeVoucher.find(partnerId, typeVoucher);
    res.locals.partnerTypeVoucher = partnerTypeVoucher;
    
    next();
});