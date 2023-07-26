const express_ = require('express');
const router = express_.Router();
const logIn = require('../controllers/dbControllers');

router.post('/register', logIn.register);

router.post('/login', logIn.login);

router.get('/users', logIn.users);

router.get('/users/pagination', logIn.usersPagination);

module.exports = router;