var express = require('express');
var router = express.Router();
const user = require('../../../../controllers/users.controller');

router.get('/', user.getUsers);
router.get('/:id', user.getUser);
router.post('/create', user.createUser);
router.put('/update/:id', user.updateUser);
router.delete('/delete/:id', user.deleteUser);

module.exports = router;
