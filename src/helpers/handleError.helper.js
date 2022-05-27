const AppError = require('./appError.helper');

const handleUniqueErrorDB = err => {
    return new AppError(err.errors[0].message, 400);
};

module.exports = {
    handleUniqueErrorDB,
};