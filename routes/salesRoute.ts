import express from "express";
import {
  addSale,
  deleteSale,
  getAddSale,
  getSales,
  getSaleUpdate,
  getSaleWithId,
  updateSale,
} from "../controlers/salesController";

const router = express.Router();
router.get("/", getSales);

router.get("/add", getAddSale);

router.post("/add", addSale);

router.get("/:id", getSaleWithId);

router.get("/:id/update", getSaleUpdate);

router.post("/:id/update", updateSale);

router.post("/:id/delete", deleteSale);

export default router;
