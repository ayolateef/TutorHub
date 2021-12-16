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

// const {protect,authorize} = require('../middleware/auth');
 
// Rer-route into other resource routers
router.use('/:catergoryId/subjects', subjectRouter);

router.route("/").get(getCategories).post(createCategory);

router.route("/:id").get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;
