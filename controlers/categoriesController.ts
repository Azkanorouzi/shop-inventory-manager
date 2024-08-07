import { NextFunction, Request, Response } from "express";
import categoryModel from "../models/categoryModel";
import { ResponseTransformer } from "../utils/responseTransformer";
import { getMaxCurPage } from "../utils/getMaxCurPag";
import { Category } from "../definitions";
import expressAsyncHandler from "express-async-handler";
import productModel from "../models/productModel";

export const getCategories = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const countResponse = categoryModel.countDocuments();

  const response = new ResponseTransformer(
    categoryModel
      .find({})
      .select(["name", "closeAt", "salesPerMon", "workers"]),
    req.query,
  )
    .implementSort()
    .implementPagination();

  let limit = Number(req.query?.limit) ?? 3;

  const [categories, count] = await Promise.all([
    response.query,
    countResponse,
  ]);

  const { maxPage, curPage } = getMaxCurPage(req, count);

  res.status(200).render("pages/page", {
    items: categories,
    count,
    maxPage,
    curPage,
    limit,
    entity: "categories",
    renderer: (category: Category) => {
      return {
        header: category.name,
        description: "",
        linkTo: `/categories/${category._id}`,
      };
    },
  });
});

export const getCreateCategory = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const products = await productModel.find();

  res.render("pages/shopAdd", { products });
});

export const createCategory = [
  expressAsyncHandler(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {}),
];
