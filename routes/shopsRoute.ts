import express from "express";
import {
  createShop,
  getShopAdd,
  getShops,
  getShopWithId,
} from "../controlers/shopsController";
const route = express.Router();

route.get("/", getShops);

route.get("/add", getShopAdd);

route.post("/add", createShop);

route.get("/:id", getShopWithId);

export default route;
