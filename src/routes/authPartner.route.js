const express = require('express');

const router = express.Router();

const authController = require('../controllers/partner/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware");

router.post('/login', authMiddleware.validatePartner, authController.login);

router.post('/register', authMiddleware.validatePartner, authController.createPartner);

router.get('/login-token', authController.loginUsingToken);

module.exports = router;