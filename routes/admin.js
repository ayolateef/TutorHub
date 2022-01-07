const express = require('express');
const {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    activateAdmin,
    deactivateAdmin,
} = require('../controllers/admin');
const Roles = require('../utils/roles');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.put('/:id/activate', authorize(Roles.SUPER_ADMIN), activateAdmin);
router.put('/:id/deactivate', authorize(Roles.SUPER_ADMIN), deactivateAdmin);

router 
.route('/')
    .get(authorize(Roles.SUPER_ADMIN), getAdmins)
    .post(authorize(Roles.SUPER_ADMIN), createAdmin);
            
router
    .route('/:id')
    .get(authorize(Roles.SUPER_ADMIN), getAdmin)
    .put(authorize(Roles.ADMIN, Roles.SUPER_ADMIN), updateAdmin);

module.exports = router;