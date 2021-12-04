const express = require("express");
const {
  getCategories,
  getCategory,
  createCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

const router = express.Router();

router.route("/").get(getCategories).post(createCategories);

router.route("/:id").get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;