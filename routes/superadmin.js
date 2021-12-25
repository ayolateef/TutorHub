const express = require('express');
const { createSuperadmin} = require('../controllers/superadmin');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

// router.route("/").post(protect, authorize(superadmin),createSuperadmin).post('/login', authorize(superadmin),login);
router.route('/').post(protect, createSuperadmin);

module.exports = router; 