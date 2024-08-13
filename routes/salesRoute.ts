import express from "express";
import { getSales } from "../controlers/salesController";

const router = express.Router();
router.get("/", getSales);

export default router;
