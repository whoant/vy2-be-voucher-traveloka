const express = require('express');

const router = express.Router();

const authUserController = require('../controllers/user/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware");
const appCodeMiddleware = require("../middlewares/appCode.middleware");

router.post('/login', authMiddleware.validateUser, authUserController.login);

router.post('/register', appCodeMiddleware.checkAppId, authMiddleware.validateUser, authUserController.createUser);

router.get('/login-token', appCodeMiddleware.checkAppId, authUserController.loginUsingToken);

module.exports = router;