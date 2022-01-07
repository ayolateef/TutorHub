const express = require('express');
const {getTutors,getTutor, createTutor, addTutor} = require('../controllers/tutor');


const router = express.Router();

router.route('/').get(getTutors).post(createTutor);

router.route("/:id").get(getTutor).put(addTutor);

module.exports = router;