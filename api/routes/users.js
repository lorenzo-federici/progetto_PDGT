//-------------------------------------------------------------
const express = require('express');
const router  = express.Router();

const checkAuth = require('../middleware/check-auth'); //authorization
const UserController = require("../controllers/users_ctrl"); //user_ctrl
//-------------------------------------------------------------

//-------------------------------------------------------------
router.get('/', checkAuth, UserController.users_get_all);
router.post('/signup', UserController.users_signup);
router.post('/login', UserController.users_login);
router.delete('/:userId', checkAuth, UserController.users_delete_user);
//-------------------------------------------------------------

module.exports = router;