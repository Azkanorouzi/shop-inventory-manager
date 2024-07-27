import asyncHandler from "express-async-handler";
import categoryModel from "../models/categoryModel";
import customerModel from "../models/customerModel";
import productModel from "../models/productModel";
import SaleModel from "../models/salesModel";
import shopModel from "../models/shopModel";
import SupplierModel from "../models/supplierModel";
import workerModel from "../models/workerModel";

export default asyncHandler(async function (req, res, next) {
  try {
    const [
      numCategories,
      numCustomers,
      numProducts,
      numSales,
      numShops,
      numSuppliers,
      numWorkers,
      lastProducts,
      lastSales,
      mostLucrativeShops,
      suppliersWithMostProduct,
      workersWithMostSales,
      customersWithMostTransaction,
    ] = await Promise.all([
      // Number of documents
      categoryModel.countDocuments({}).exec(),
      customerModel.countDocuments({}).exec(),
      productModel.countDocuments({}).exec(),
      SaleModel.countDocuments({}).exec(),
      shopModel.countDocuments({}).exec(),
      SupplierModel.countDocuments({}).exec(),
      workerModel.countDocuments({}).exec(),
      // Last documents
      productModel.find({}).sort("-createdAt").limit(3).exec(),
      SaleModel.find({}).sort("-createdAt").limit(3).exec(),
      shopModel.find({}).sort("-salesPerMon").limit(3).exec(),
      // Most products/sales
      SupplierModel.aggregate([
        {
          $addFields: {
            productsNum: { $size: ["$products"] },
          },
        },
        {
          $sort: { productsNum: -1 },
        },
        {
          $limit: 3,
        },
      ]).exec(),
      workerModel
        .aggregate([
          {
            $addFields: {
              salesNum: { $size: ["$saleId"] },
            },
          },
          {
            $sort: { salesNum: -1 },
          },
          {
            $limit: 3,
          },
        ])
        .exec(),
      customerModel
        .aggregate([
          {
            $addFields: {
              transactionsNum: { $size: ["$transactions"] },
            },
          },
          {
            $sort: { salesNum: -1 },
          },
          {
            $limit: 3,
          },
        ])
        .exec(),
    ]);

    // Creating an object for 
    const statistics = {
      numCategories,
      numCustomers,
      numProducts,
      numSales,
      numShops,
      numSuppliers,
      numWorkers,
      lastProducts,
      lastSales,
      suppliersWithMostProduct,
      workersWithMostSales,
      mostLucrativeShops,
      customersWithMostTransaction,
    };

    console.log(suppliersWithMostProduct)

    res.render("pages/statistics", { statistics });
  } catch (err) {
    console.log(err);
  }
});
