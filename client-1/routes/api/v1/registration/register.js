var express = require('express');
var router = express.Router();
const registration = require('../../../../controllers/registration.controller');

router.post('/', registration.register);

module.exports = router;
