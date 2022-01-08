const express = require('express');
const {
    getTutors,
    getTutor,
    updateTutor,
    registerTutorToSubject,
    unRegisterTutorToSubject,
} = require('../controllers/tutor');
const Roles = require('../utils/roles');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/subject/:id/register', authorize(Roles.TUTOR), registerTutorToSubject);
router.post('/subject/:id/unregister', authorize(Roles.TUTOR), unRegisterTutorToSubject);
router.route('/').get(authorize(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STUDENT), getTutors);

router
    .route('/:id')
    .get(authorize(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STUDENT), getTutor)
    .put(authorize(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.TUTOR), updateTutor);

module.exports = router;
