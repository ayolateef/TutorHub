const express = require('express');
const { register, getStudent, getStudents } = require('../controllers/students');

//Include resource from router
const subjectRouter = require('./subjects');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Rer-route into other resource routers
router.use('/:catergoryId/subjects', subjectRouter);

router.route('/').get(getStudents).post(register);

router.route('/:id').get(getStudent);

module.exports = router;
