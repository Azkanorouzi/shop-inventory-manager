import express from "express";
import getStatistics from "../controlers/statisticsController";
const router = express.Router();

console.log(getStatistics, "this is statistics")
router.get("/", getStatistics);

export default router;