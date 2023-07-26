const express_ = require('express');
const router = express_.Router();
const logIn = require('../controllers/logInController');

router.post('/register', logIn.register);

router.post('/login', logIn.login);

router.get('/users', logIn.users);

module.exports = router;