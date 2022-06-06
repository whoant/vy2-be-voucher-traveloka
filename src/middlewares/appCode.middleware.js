const catchAsync = require('../helpers/catchAsync.helper');
const { APP_ID } = require("../constants");
const AppError = require('../helpers/appError.helper');

exports.checkAppId = catchAsync(async (req, res, next) => {
    let appId = req.get('app_id');

    if (!APP_ID[appId]) {
        appId = req.query.app_id;
        if (!APP_ID[appId]) {
            throw new AppError("Thêm app_id vào header với value theo nhóm: vy01, vy02, vy03, vy04. Ví dụ: app_id: vy03", 400)
        }
    }
    res.locals.appId = appId;
    next();
});