const catchAsync = require('../../helpers/catchAsync.helper');
const PartnerService = require("../../services/Partner");

exports.getGiftCards = catchAsync(async (req, res, next) => {
    const { type } = req.query;
    const partner = new PartnerService(res.locals.partner, type);
    const giftCards = await partner.getGiftCards();

    res.json({
        status: 'success',
        message: 'Lấy danh sách phiếu điểm thưởng thành công !',
        data: {
            giftCards
        }
    });
});

exports.createGiftCard = catchAsync(async (req, res, next) => {
    const { type } = req.body;
    const partner = new PartnerService(res.locals.partner, type);
    await partner.createGiftCard(req.body);

    res.json({
        status: 'success',
        message: 'Tạo phiếu điểm thưởng thành công !'
    });
});

exports.getCountGiftCards = catchAsync(async (req, res, next) => {
    const partner = new PartnerService(res.locals.partner, '');
    const count = await partner.getCountGiftCards();

    res.json({
        status: 'success',
        message: 'Lấy thông tin thành công !',
        data: {
            count
        }
    });
});

exports.getDetailGiftCard = catchAsync(async (req, res, next) => {
    const { type, code, typeView } = req.query;
    const partner = new PartnerService(res.locals.partner, type);
    const info = await partner.getDetailGift(code, typeView);

    res.json({
        status: 'success',
        message: 'Lấy thông tin thành công !',
        data: {
            info
        }
    });
});

exports.getAnalyzeGiftCard = catchAsync(async (req, res, next) => {
    const { type, code } = req.query;
    const partner = new PartnerService(res.locals.partner, type);
    const analyze = await partner.getAnalyzeGiftCard(code);

    res.json({
        status: 'success',
        message: 'Lấy thông tin thành công !',
        data: {
            ...analyze
        }
    });
});