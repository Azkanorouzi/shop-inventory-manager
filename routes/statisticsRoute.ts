import express from "express";
import getStatistics from "../controlers/statisticsController";
const router = express.Router();

router.get("/", getStatistics);

export default router;

