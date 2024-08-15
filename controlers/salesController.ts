import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ResponseTransformer } from "../utils/responseTransformer";
import SaleModel from "../models/salesModel";
import { getMaxCurPage } from "../utils/getMaxCurPag";
import { PopulatedSale, Sale, Shop } from "../definitions";
import { DateTime } from "luxon";
import productModel from "../models/productModel";
import workerModel from "../models/workerModel";
import shopModel from "../models/shopModel";

export const getAddSale = expressAsyncHandler(async function(req: Request, res: Response, next: NextFunction) {
  const [products, workers, shops] = await Promise.all([
    productModel.find().select("productInfo"),
    workerModel.find().select(["role", "personalInfo"]),
    shopModel.find().select(["name", "_id"]),
  ]);

  res.render("pages/saleAdd", { products, workers, shops});
})

export const deleteSale = expressAsyncHandler(async function(req: Request, res: Response, next: NextFunction) {
  await SaleModel.findByIdAndDelete(req?.params?.id)

  res.redirect("/sales")
})


export const getSaleWithId = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Getting the producst here
  const saleDetails = await SaleModel.findById(req.params.id)
    .populate("products.product", "productInfo price buyPrice")
    .populate("workerId", "role personalInfo.firstName personalInfo.lastName")
    .populate("shopId", "name opensAt closeAt");


  const formattedDate = DateTime.fromJSDate(saleDetails?.createdAt || new Date()).toISODate()


  res.render("pages/saleWithId", { item: saleDetails, hasDependencies: false, createdAt: formattedDate});
});


export const getSales = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const countResponse = SaleModel.countDocuments();
  const response = new ResponseTransformer(
    SaleModel.find({})
      .select(["products", "totalSold", "totalPrice", "profit", "createdAt"])
      .populate("products.product", "productInfo price buyPrice")
      .populate("shopId", "name"),
    req.query,
  )
    .implementSort()
    .implementPagination();

  let limit = Number(req.query?.limit) ?? 3;

  const [sales, count] = await Promise.all([response.query, countResponse]);
  const { maxPage, curPage } = getMaxCurPage(req, count);

  res.status(200).render("pages/page", {
    items: sales,
    count,
    maxPage,
    curPage,
    limit,
    entity: "sales",
    renderer: (sale: PopulatedSale) => {
      return {
        description: `${sale?.totalQuantity} products sold with ${sale.profit} profit`,
        header: `Sale at ${DateTime.fromJSDate(sale?.createdAt || new Date()).toISODate()} in ${sale.shopId?.name}`,
        linkTo: `/sales/${sale._id}`,
      };
    },
  });
});
