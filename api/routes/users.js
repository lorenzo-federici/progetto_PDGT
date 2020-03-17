const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

const User = require("../models/user_model");

const UserController = require("../controllers/users_ctrl");

router.get('/', UserController.users_get_all);

router.post('/signup', UserController.users_signup);

router.post('/login', UserController.users_login);

module.exports = router;