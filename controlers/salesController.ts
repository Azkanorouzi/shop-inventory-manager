import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ResponseTransformer } from "../utils/responseTransformer";
import SaleModel from "../models/salesModel";
import { getMaxCurPage } from "../utils/getMaxCurPag";
import { Sale } from "../definitions";

export const getSales = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const countResponse = SaleModel.countDocuments();
  const response = new ResponseTransformer(
    SaleModel.find({})
      .select(["products", "totalSold", "totalPrice", "profit"])
      .populate("products.product", "productInfo price buyPrice"),
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
    renderer: (sale: Sale) => {
      return {
        header: `${sale?.totalQuantity} products sold with ${sale.profit} profit`,
        description: "",
        linkTo: `/sales/${sale._id}`,
      };
    },
  });
});
