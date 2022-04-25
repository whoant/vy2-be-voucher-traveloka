const express = require('express');

const router = express.Router();

const authUserController = require('../controllers/user/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware");

router.post('/login', authMiddleware.validateUser, authUserController.login);

router.post('/register', authMiddleware.validateUser, authUserController.createUser);

module.exports = router;