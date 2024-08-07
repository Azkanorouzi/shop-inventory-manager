import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryWithId,
  getCreateCategory,
  getUpdateCategory,
  updateCategory,
} from "../controlers/categoriesController";

const router = express.Router();

router.get("/", getCategories);

router.get("/add", getCreateCategory);

router.post("/add", createCategory);

router.get("/:id", getCategoryWithId);

router.post("/:id/delete", deleteCategory);

router.post("/:id/update", updateCategory);
//
router.get("/:id/update", getUpdateCategory);
export default router;
