const express = require('express');
const { getBookings, getBooking, createBooking } = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getBookings);

router.route('/:id').get(getBooking).post(createBooking);

module.exports = router;
