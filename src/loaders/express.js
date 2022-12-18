const express = require('express');
const helmet = require('helmet');
const responseHelper = require("../helpers/response.helper");
const routes = require('../routes');
const morgan = require("morgan");
const AppError = require("../helpers/appError.helper");
const cors = require('cors');
const telegramNotify = require('../modules/TelegramNotify');
const { TOKEN_TELEGRAM, GROUP_TELEGRAM } = require("../config");

module.exports = app => {

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    app.use(helmet());
    app.use(express.json());
    app.use(cors());
    routes(app);
    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server !`, 400));
    });
    app.use(telegramNotify({
        botToken: TOKEN_TELEGRAM,
        chatId: GROUP_TELEGRAM
    }));
    app.use(responseHelper);

};
