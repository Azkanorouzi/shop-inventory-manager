import express from "express"
import { getShops } from "../controlers/shopsController";
const route = express.Router();

route.get("/", getShops)

export default route;