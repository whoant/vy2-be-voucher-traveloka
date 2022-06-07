const telegramMiddleware = (err, req, res, next) => {
    console.log(err);

    next(err);
};

module.exports = telegramMiddleware;