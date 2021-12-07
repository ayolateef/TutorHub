const express = require('express');
const {register, login, getMe} = require('../controllers/auth');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

router.post('/register', register).post('/login', login).get('/me',protect,authorize(superAdmin), getMe);

module.exports = router;