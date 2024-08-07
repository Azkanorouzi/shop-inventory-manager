import { NextFunction, Request, Response } from "express";
import categoryModel from "../models/categoryModel";
import { ResponseTransformer } from "../utils/responseTransformer";
import { getMaxCurPage } from "../utils/getMaxCurPag";
import { Category } from "../definitions";
import expressAsyncHandler from "express-async-handler";
import productModel from "../models/productModel";
import { body, validationResult } from "express-validator";
import { Types } from "mongoose";

export const updateCategory = [
  function (req: Request, res: Response, next: NextFunction) {
    if (!req.body?.products) req.body.products = [];

    return next();
  },
  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 0, max: 60 })
    .escape(),
  body("products")
    .isArray()
    .custom((categories) =>
      categories.every((id: string) => Types.ObjectId.isValid(id)),
    )
    .escape()
    .withMessage("products need to be an array"),
  expressAsyncHandler(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    await categoryModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/categories");
  }),
];

export const getUpdateCategory = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const [products, category] = await Promise.all([
    productModel.find().select(["productInfo"]),
    categoryModel.findById(req?.params?.id),
  ]);

  res.render("pages/categoryUpdate", {
    item: category,
    products,
  });
});

export const deleteCategory = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const category = await categoryModel.findById(req?.params?.id);

  // dependencies
  const hasDependencies = Number(category?.products?.length) > 0;

  if (hasDependencies) {
    res.redirect("/categories");
    return;
  }

  await categoryModel.findByIdAndDelete(req?.params?.id);
  res.redirect("/categories");
});

export const getCategoryWithId = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const categoryDetails = await categoryModel
    .findById(req.params.id)
    .populate("products", "productInfo");

  console.log(categoryDetails);

  // For checking if we have dependency so that we don't show the user the delete button
  const hasDependencies = Number(categoryDetails?.products?.length) > 0;
  res.status(200).render("pages/categoryWithId", {
    item: categoryDetails,
    hasDependencies,
  });
});

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

  res.render("pages/categoryAdd", { products });
});

export const createCategory = [
  function (req: Request, res: Response, next: NextFunction) {
    if (!req.body?.products) req.body.products = [];

    return next();
  },
  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 0, max: 60 })
    .escape(),
  body("products")
    .isArray()
    .custom((categories) =>
      categories.every((id: string) => Types.ObjectId.isValid(id)),
    )
    .escape()
    .withMessage("products need to be an array"),
  expressAsyncHandler(async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    req.body.products.map((id: string) => new Types.ObjectId(id));

    const category = new categoryModel(req.body);
    await category.save();
    res.redirect("/categories");
  }),
];
