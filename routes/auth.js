const express = require('express');

const {adminLogin, superadminLogin, tutorLogin, studentLogin } = require('../controllers/auth');

const router = express.Router();

router.post('/admin', adminLogin);
router.post('/superadmin', superadminLogin);
router.post('/tutor', tutorLogin);
router.post('/student',  studentLogin);

module.exports = router;