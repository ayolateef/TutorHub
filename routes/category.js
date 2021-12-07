const express = require("express");
const {
  getCategories,
  getCategory,
  createCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

router.route("/").get(getCategories).post(protect, authorize(superAdmin, admin),createCategories);

router.route("/:id").get(getCategory).put(protect, updateCategory).delete(protect, authorize(superAdmin, admin),deleteCategory);

module.exports = router;
