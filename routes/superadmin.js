const express = require('express');
const { createSuperadmin,login} = require('../controllers/superadmin');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

// router.route("/").post(protect, authorize(superadmin),createSuperadmin).post('/login', authorize(superadmin),login);
router.route('/').post(createSuperadmin);

module.exports = router; 