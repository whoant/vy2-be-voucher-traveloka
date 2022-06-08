const AppError = require("./appError.helper");
module.exports = (amount, condition) => {
    if (Number(amount) < Number(condition.threshold)) {
        throw new AppError("Không đủ điều kiện", 400);
    }

    let deduct = Number(condition.maxAmount);
    if (Number(condition.discount) > 0) {
        let deductTemp = Number(amount) * Number(condition.discount) / 100;
        if (deductTemp < deduct) deduct = deductTemp;
    }

    return Math.round(deduct);
}