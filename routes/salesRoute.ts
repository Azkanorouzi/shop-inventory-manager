import express from "express";
import { deleteSale, getAddSale, getSales, getSaleWithId } from "../controlers/salesController";

const router = express.Router();
router.get("/", getSales);

router.get("/add", getAddSale)

router.get("/:id", getSaleWithId)

router.post("/:id/delete", deleteSale)


export default router;
