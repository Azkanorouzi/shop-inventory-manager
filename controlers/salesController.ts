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
import customerModel from "../models/customerModel";
import { body, validationResult } from "express-validator";
import { Types } from "mongoose";

export const getAddSale = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const [products, workers, shops, customers] = await Promise.all([
    productModel.find().select("productInfo"),
    workerModel.find().select(["role", "personalInfo"]),
    shopModel.find().select(["name", "_id"]),
    customerModel.find().select(["name", "phoneNumber"]),
  ]);

  res.render("pages/saleAdd", { products, workers, shops, customers });
});

export const addSale = [
  // Transforms req.products to a proper format
  function (req: Request, res: Response, next: NextFunction) {
    // Checking if products is undefined
    if (req.body?.products === undefined) {
      req.body.products = [];
      // Checking for the type of products
      return next();
    } else if (typeof req.body?.products === "string") {
      req.body.products = [
        JSON.stringify({
          quantityBought: 1,
          product: req.body.products,
          productPrice: 1,
        }),
      ];
      return next();
    }

    req.body.products = req.body.products.map((product: string) => {
      return JSON.stringify({
        productPrice: 1,
        product: product,
        quantityBought: 1,
      });
    });
    next();
  },

  body("products")
    .isArray()
    .escape()
    .withMessage("Products need to be an array"),
  body("workerId")
    .custom((id) => Types.ObjectId.isValid(id))
    .escape()
    .withMessage("worker needs to be a valid id"),
  body("shopId")
    .custom((id) => Types.ObjectId.isValid(id))
    .escape()
    .withMessage("shop needs to be a valid id"),
  body("customerId")
    .custom((id) => Types.ObjectId.isValid(id))
    .escape()
    .withMessage("customer needs to be a valid id"),

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

    req.body.products = req.body.products.map((product: string) => {
      const updatedProduct = product.replaceAll(/&quot;/gi, '"');

      console.log(updatedProduct);

      return JSON.parse(updatedProduct);
    });

    console.log(req.body);

    const sale = new SaleModel(req.body);

    await sale.save();
    res.redirect("/sales");
  }),
];

export const deleteSale = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  await SaleModel.findByIdAndDelete(req?.params?.id);

  res.redirect("/sales");
});

export const getSaleWithId = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Getting the producst here
  const saleDetails = await SaleModel.findById(req.params.id)
    .populate("products.product", "productInfo price buyPrice")
    .populate("workerId", "role personalInfo.firstName personalInfo.lastName")
    .populate("shopId", "name opensAt closeAt")
    .populate("customerId", "name phoneNumber email");

  const formattedDate = DateTime.fromJSDate(
    saleDetails?.createdAt || new Date(),
  ).toISODate();

  res.render("pages/saleWithId", {
    item: saleDetails,
    hasDependencies: false,
    createdAt: formattedDate,
  });
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

export const getSaleUpdate = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sale = await SaleModel.findById(req?.params?.id);

  const [products, workers, shops, customers] = await Promise.all([
    productModel.find().select("productInfo"),
    workerModel.find().select(["role", "personalInfo"]),
    shopModel.find().select(["name", "_id"]),
    customerModel.find().select(["name", "phoneNumber"]),
  ]);

  res.render("pages/saleUpdate", {
    item: sale,
    customers,
    workers,
    shops,
    products,
  });
});

export const updateSale = [
  // Transforms req.products to a proper format
  function (req: Request, res: Response, next: NextFunction) {
    // Checking if products is undefined
    if (req.body?.products === undefined) {
      req.body.products = [];
      // Checking for the type of products
      return next();
    } else if (typeof req.body?.products === "string") {
      req.body.products = [
        JSON.stringify({
          quantityBought: 1,
          product: req.body.products,
          productPrice: 1,
        }),
      ];
      return next();
    }

    req.body.products = req.body.products.map((product: string) => {
      return JSON.stringify({
        productPrice: 1,
        product: product,
        quantityBought: 1,
      });
    });
    next();
  },

  body("products")
    .isArray()
    .escape()
    .withMessage("Products need to be an array"),
  body("workerId")
    .custom((id) => Types.ObjectId.isValid(id))
    .escape()
    .withMessage("worker needs to be a valid id"),
  body("shopId")
    .custom((id) => Types.ObjectId.isValid(id))
    .escape()
    .withMessage("shop needs to be a valid id"),
  body("customerId")
    .custom((id) => Types.ObjectId.isValid(id))
    .escape()
    .withMessage("customer needs to be a valid id"),

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

    await SaleModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/sales/${req.params.id}`);
  }),
];
