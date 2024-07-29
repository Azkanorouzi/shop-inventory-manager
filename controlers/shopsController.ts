import { NextFunction, Request, Response } from "express";
import shopModel from "../models/shopModel";
import { ResponseTransformer } from "../utils/responseTransformer";

export async function getShops(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log("IS getting called ❌");
  const response = new ResponseTransformer(shopModel.find({}), req.query)
    .implementSort()
    .implementPagination();

  const shops = await response.query;

  res.status(200).render("pages/shop", { shops });
}

//eexport async function getAddShop(req: Request, res: Response, next: NextFunction) {
//
// }
