import express from "express";
import {
  createShop,
  deleteShop,
  getShopAdd,
  getShops,
  getShopUpdate,
  getShopWithId,
  updateShop,
} from "../controlers/shopsController";
const route = express.Router();

route.get("/", getShops);

route.get("/add", getShopAdd);

route.post("/add", createShop);

route.get("/:id", getShopWithId);

route.post("/:id/delete", deleteShop);

route.post("/:id/update", updateShop);

route.get("/:id/update", getShopUpdate);

export default route;
