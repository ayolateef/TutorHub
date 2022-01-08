const express = require('express');
const { getTutors, getTutor, createTutor, addTutor } = require('../controllers/tutor');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getTutors).post(protect, authorize('superadmin', 'admin'), createTutor);

router.route('/:id').get(getTutor).put(protect, authorize('superadmin', 'admin'), addTutor);

module.exports = router;
