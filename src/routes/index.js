const authRoute = require('./auth.route');

module.exports = app => {
    app.use('/api/v1/auth', authRoute);
};