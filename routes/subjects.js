const express = require('express');
const { getSubjects, getSubject, addSubject, updateSubject, deleteSubject } = require('../controllers/subjects');
const Roles = require('../utils/roles');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getSubjects).post(authorize(Roles.SUPER_ADMIN, Roles.ADMIN), addSubject);

router
    .route('/:id')
    .get(getSubject)
    .put(authorize(Roles.SUPER_ADMIN, Roles.ADMIN), updateSubject)
    .delete(authorize(Roles.SUPER_ADMIN, Roles.ADMIN), deleteSubject);

module.exports = router;
