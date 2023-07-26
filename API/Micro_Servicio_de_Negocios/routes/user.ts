const express = require('express');
const router = express.Router();
const controller_user = require('../controllers/userController');

router.get('/users', controller_user.users);

module.exports = router;