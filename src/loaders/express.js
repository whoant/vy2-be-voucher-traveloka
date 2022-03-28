const express = require('express');
const helmet = require('helmet');
const {handleError} = require("../helpers/response.helper");
const routes = require('../routes');
const morgan = require("morgan");
const AppError = require("../helpers/appError.helper");

module.exports = app => {
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    app.use(helmet());
    app.use(express.json());
    routes(app);
    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server !`, 400));
    });
    app.use(handleError);

};