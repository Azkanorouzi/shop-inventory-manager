import express from "express";
import { getCategories } from "../controlers/categoriesController";
const router = express.Router();

router.get("/", getCategories);
export default router;
