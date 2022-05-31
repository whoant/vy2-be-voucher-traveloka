const AppError = require('./appError.helper');

const handleUniqueErrorDB = err => {
    return new AppError(err.errors[0].message, 400);
};

const handleJwtError = err => {
    return new AppError("Token không hợp lệ !", 400);
}

module.exports = {
    handleUniqueErrorDB,
    handleJwtError
};