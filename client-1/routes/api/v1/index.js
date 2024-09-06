const express = require('express');
const router = express.Router();
const USERS_ROUTER = require('./users/users');
const REGISTRATION_ROUTER = require('./registration/register');
const MAIL_ROUTER = require('./mail/mail');
const AUTH_ROUTER= require('./auth/auth');
const AUTH_MIDDLEWARE = require('../../../middlewares/restrict');

// Routes protected using Middleware
router.use('/users', AUTH_MIDDLEWARE, USERS_ROUTER);

router.use('/registration', REGISTRATION_ROUTER);
router.use('/mail', MAIL_ROUTER);
router.use('/auth', AUTH_ROUTER)
  
module.exports = router;