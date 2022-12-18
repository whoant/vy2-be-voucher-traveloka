const express = require('express');

const router = express.Router();

const authController = require('../controllers/partner/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware");
const appCodeMiddleware = require("../middlewares/appCode.middleware");

router.post('/login', authMiddleware.validatePartner, authController.login);

router.post('/register', appCodeMiddleware.checkAppId, authMiddleware.validatePartner, authController.createPartner);

router.get('/login-token', appCodeMiddleware.checkAppId, authController.loginUsingToken);

module.exports = router;