const express = require('express');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categorys');
const Roles = require('../utils/roles');

// //Include resource from router
const subjectRouter = require('./subjects');
// const reviewRouter = require('./review');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// // Rer-route into other resource routers
router.use('/:categoryId/subject', subjectRouter);
// router.use('/:catergoryId/review', reviewRouter);

router.use(protect);

router.route('/').get(getCategories).post(authorize(Roles.SUPER_ADMIN, Roles.ADMIN), createCategory);

router
    .route('/:id')
    .get(getCategory)
    .put(authorize(Roles.SUPER_ADMIN, Roles.ADMIN), updateCategory)
    .delete(authorize(Roles.SUPER_ADMIN, Roles.ADMIN), deleteCategory);

module.exports = router;
