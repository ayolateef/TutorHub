const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categorys");

//Include resource from router
const subjectRouter = require('./subjects');

const router = express.Router();

 const {protect, authorize} = require('../middleware/auth');
 
// Rer-route into other resource routers
router.use('/:catergoryId/subjects', subjectRouter);

router.route("/").get(getCategories).post(protect, authorize('superadmin', 'admin', 'tutor', 'student'),createCategory);

router.route("/:id").get(getCategory).put(protect, updateCategory).delete(protect, authorize('superadmin', 'admin'), deleteCategory);

module.exports = router;
