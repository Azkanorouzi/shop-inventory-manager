import { NextFunction, Request, Response } from "express";
import shopModel from "../models/shopModel";
import { ResponseTransformer } from "../utils/responseTransformer";
import { getMaxCurPage } from "../utils/getMaxCurPag";
import { Shop } from "../definitions";
import expressAsyncHandler from "express-async-handler";
import categoryModel from "../models/categoryModel";
import workerModel from "../models/workerModel";
import saleModel from "../models/salesModel";
import { body, validationResult } from "express-validator";
import { Types } from "mongoose";

export const getShops = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const countResponse = shopModel.countDocuments();

  const response = new ResponseTransformer(
    shopModel.find({}).select(["name", "closeAt", "salesPerMon", "workers"]),
    req.query,
  )
    .implementSort()
    .implementPagination();

  let limit = Number(req.query?.limit) ?? 3;

  const [shops, count] = await Promise.all([response.query, countResponse]);

  const { maxPage, curPage } = getMaxCurPage(req, count);

  res.status(200).render("pages/page", {
    items: shops,
    count,
    maxPage,
    curPage,
    limit,
    entity: "shops",
    renderer: (shop: Shop) => {
      return {
        header: shop.name,
        description: `Sales this shop ${shop?.isLucrative ? "is" : "is not"} lucrative.  
    has ${shop?.numberOfWorkers} workers. \n
    and is currently ${shop?.isOpen ? "open" : "closed"}`,
        linkTo: `/shops/${shop._id}`,
      };
    },
  });
});

export const getShopWithId = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const shopDetails = await shopModel
    .findById(req.params.id)
    .populate("workers", "personalInfo role")
    .populate("categories", "name products");

  res.render("pages/pageWithId", { item: shopDetails });
});

export const getShopAdd = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const [categories, workers, sales] = await Promise.all([
    categoryModel.find(),
    workerModel.find().select(["role", "personalInfo"]),
    saleModel.find().select(["_id"]),
  ]);

  res.render("pages/shopAdd", { categories, workers, sales });
});

export const createShop = [
  // Transfomration to geolocation data
  function (req: Request, res: Response, next: NextFunction) {
    const { latitude, longitude } = req.body;

    req.body.location = {
      type: "Point",
      coordinates: [parseFloat(latitude), parseFloat(longitude)],
    };

    return next();
  },

  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 0, max: 60 })
    .escape(),
  body("opensAt").trim().toInt().escape(),
  body("founded").isISO8601().withMessage("Founded must be a valid iso8601"),
  body("salesPerMon")
    .toFloat()
    .isFloat({ min: 0 })
    .escape()
    .withMessage("Sale per month can't be less than zero"),
  body("closeAt").trim().toInt().escape(),
  body("categories")
    .isArray()
    .custom((categories) =>
      categories.every((id: string) => Types.ObjectId.isValid(id)),
    )
    .escape()
    .withMessage("Categories need to be an array"),
  body("workers")
    .isArray()
    .custom((categories) =>
      categories.every((id: string) => Types.ObjectId.isValid(id)),
    )
    .escape()
    .withMessage("Workers need to be an array"),

  body("sales")
    .isArray()
    .custom((categories) =>
      categories.every((id: string) => Types.ObjectId.isValid(id)),
    )
    .escape()
    .withMessage("Sales need to be an array"),

  body("opnesAt").custom((value, { req }) => {
    if (new Date(value) >= new Date(req.body.closesAt)) {
      throw new Error("opensAt must be earlier than closesAt");
    }
    return true;
  }),
  body("closeAt").custom((value, { req }) => {
    if (new Date(value) >= new Date(req.body.closeAt)) {
      throw new Error("closeAt must be after opensAt");
    }
    return true;
  }),
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

    req.body.categories.map((id: string) => new Types.ObjectId(id));
    req.body.categories.map((id: string) => new Types.ObjectId(id));
    req.body.sales = req.body.sales.map((id: string) => new Types.ObjectId(id));

    const shop = new shopModel(req.body);
    await shop.save();
    res.redirect("/shops");
  }),
];

export const deleteShop = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  await shopModel.findByIdAndDelete(req?.params?.id);
  res.redirect("/shops");
});

export const updateShop = [
  // Transfomration to geolocation data
  function (req: Request, res: Response, next: NextFunction) {
    const { latitude, longitude } = req.body;

    req.body.location = {
      type: "Point",
      coordinates: [parseFloat(latitude), parseFloat(longitude)],
    };

    return next();
  },
  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 0, max: 60 })
    .escape(),
  body("opensAt").trim().toInt().escape(),
  body("founded").isISO8601().withMessage("Founded must be a valid iso8601"),
  body("salesPerMon")
    .toFloat()
    .isFloat({ min: 0 })
    .escape()
    .withMessage("Sale per month can't be less than zero"),
  body("closeAt").trim().toInt().escape(),
  body("categories")
    .isArray()
    .custom((categories) =>
      categories.every((id: string) => Types.ObjectId.isValid(id)),
    )
    .withMessage("Categories need to be an array of valid ObjectIds"),
  body("workers")
    .isArray()
    .custom((categories) =>
      categories.every((id: string) => Types.ObjectId.isValid(id)),
    )
    .withMessage("Workers need to be an array of valid ObjectIds"),
  body("sales")
    .isArray()
    .custom((categories) =>
      categories.every((id: string) => Types.ObjectId.isValid(id)),
    )
    .withMessage("Sales need to be an array of valid ObjectIds"),
  body("opnesAt").custom((value, { req }) => {
    if (new Date(value) >= new Date(req.body.closesAt)) {
      throw new Error("opensAt must be earlier than closesAt");
    }
    return true;
  }),
  body("closeAt").custom((value, { req }) => {
    if (new Date(value) >= new Date(req.body.opensAt)) {
      throw new Error("closeAt must be after opensAt");
    }
    return true;
  }),

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

    await shopModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/shops");
  }),
];

export const getShopUpdate = expressAsyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const shop = await shopModel.findById(req?.params?.id);

  const [categories, workers, sales] = await Promise.all([
    categoryModel.find(),
    workerModel.find().select(["role", "personalInfo"]),
    saleModel.find().select(["_id"]),
  ]);

  res.render("pages/shopUpdate", { item: shop, categories, workers, sales });
});
