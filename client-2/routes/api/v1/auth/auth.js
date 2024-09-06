var express = require('express');
var router = express.Router();
const auth = require('../../../../controllers/auth.controller');
const AUTH_MIDDLEWARE = require('../../../../middlewares/restrict');

router.post('/login', auth.authenticate);
router.post('/logout', auth.clearJWT);
router.post('/verify-otp', auth.verifyOTP);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);
router.get('/whoami', AUTH_MIDDLEWARE, auth.whoami);

module.exports = router;
