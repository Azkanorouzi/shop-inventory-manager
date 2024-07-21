#!/usr/bin/env node

import CategoryModel from "./models/categoryModel";
import CustomerModel from "./models/customerModel";
import SaleModel from "./models/salesModel";
import ProductModel from "./models/productModel";
import ShopModel from "./models/shopModel";
import SupplierModel from "./models/supplierModel";
import WorkerModel from "./models/workerModel";
import {
  Category,
  Customer,
  Product,
  RoleType,
  Sale,
  Shop,
  Supplier,
  Worker,
} from "./definitions";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

// Get arguments passed on the command line
const userArgs = process.argv.slice(2);

async function initDb({
  categoriesNum,
  customerNum,
  saleNum,
  productNum,
  shopNum,
  supplierNum,
  workerNum,
}: {
  categoriesNum: number;
  customerNum: number;
  saleNum: number;
  productNum: number;
  shopNum: number;
  supplierNum: number;
  workerNum: number;
}) {
  try {
    console.log("💥 Process initialized \n");

    const dbUri = "";
    mongoose
      .connect(dbUri)
      .then(() => {
        console.log("DB connection was successful");
      })
      .catch((err) => console.error(err));

    // Clear existing data
    await Promise.all([
      WorkerModel.deleteMany({}),
      SupplierModel.deleteMany({}),
      ShopModel.deleteMany({}),
      SaleModel.deleteMany({}),
      ProductModel.deleteMany({}),
      CustomerModel.deleteMany({}),
      CategoryModel.deleteMany({}),
    ]);
    console.log("⭕ Cleared existing data \n");

    // Create categories
    const categories: Category[] = await CategoryModel.insertMany(
      Array.from({ length: categoriesNum }, () => ({
        name: faker.commerce.department(),
        products: [],
      })),
    );
    console.log(`Created ${categoriesNum} categories 📖`);

    // Create suppliers
    const suppliers: Supplier[] = await SupplierModel.insertMany(
      Array.from({ length: supplierNum }, () => ({
        name: faker.company.name(),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
        address: faker.location.street(),
        contactPersonaName: faker.person.fullName(),
        description: faker.lorem.sentence(),
        products: [],
      })),
    );
    console.log(`Created ${supplierNum} suppliers 👲`);

    // Create shops
    const shops: Shop[] = await ShopModel.insertMany(
      Array.from({ length: shopNum }, () => ({
        name: faker.company.name(),
        opensAt: faker.number.int({ min: 0, max: 11 }),
        closeAt: faker.number.int({ min: 12, max: 23 }),
        phoneNumber: faker.phone.number(),
        location: {
          type: "Point",
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
        salesPerMon: faker.number.int({ min: 1000, max: 10000 }),
        categories: Array.from(
          { length: 4 },
          () =>
            faker.helpers.arrayElement(categories)
              ._id as mongoose.Types.ObjectId,
        ),
        founded: faker.date.past({
          years: faker.number.int({ min: 1, max: 40 }),
          refDate: Date.now(),
        }),
        workers: [],
        sales: [],
      })),
    );
    console.log(`Created ${shopNum} shops 🏘️`);

    // Create products
    const products: Product[] = await ProductModel.insertMany(
      Array.from({ length: productNum }, () => ({
        productInfo: {
          name: faker.commerce.productName(),
          quantityInStock: faker.number.int({ min: 0, max: 100 }),
          category: faker.helpers.arrayElement(categories)
            ._id as mongoose.Types.ObjectId,
          description: faker.lorem.sentence(),
        },
        lastBuy: faker.date.past({
          years: faker.number.int({ min: 1, max: 5 }),
          refDate: Date.now(),
        }),
        price: faker.number.float({ min: 0.25, max: 80 }),
        buyPrice: faker.number.float({ min: 0.25, max: 80 }),
        supplier: faker.helpers.arrayElement(suppliers)
          ._id as mongoose.Types.ObjectId,
        score: faker.number.int({ min: 0, max: 5 }),
        shopsId: Array.from(
          { length: 3 },
          () =>
            faker.helpers.arrayElement(shops)._id as mongoose.Types.ObjectId,
        ),
      })),
    );
    console.log(`Created ${productNum} products 🗳️`);

    // Create workers
    const workers: Worker[] = await WorkerModel.insertMany(
      Array.from({ length: workerNum }, () => ({
        personalInfo: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          age: faker.number.int({ min: 18, max: 65 }),
          isMarried: faker.datatype.boolean(),
        },
        role: faker.helpers.arrayElement<RoleType>([
          "Manager",
          "Cashier",
          "Stock Clerk",
          "Sales Associate",
          "Janitor",
          "Customer Service Representative",
          "Security Guard",
          "Marketing Specialist",
          "IT Support",
          "Human Resources",
          "CEO",
          "Procurement Specialist",
          "Logistics Coordinator",
        ]),
        contract: {
          contractType: faker.helpers.arrayElement(["Full-time", "Part-time"]),
          startContract: faker.date.past({ years: 5, refDate: Date.now() }),
          endContract: faker.date.future({ years: 1, refDate: Date.now() }),
          salary: faker.number.int({ min: 3000, max: 5000 }),
        },
        score: faker.number.int({ min: 0, max: 5 }),
        shopId: faker.helpers.arrayElement(shops)
          ._id as mongoose.Types.ObjectId,
        saleId: [],
      })),
    );
    console.log(`Created ${workerNum} workers 👷`);

    // Create customers
    const customers: Customer[] = await CustomerModel.insertMany(
      Array.from({ length: customerNum }, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        transactions: [],
      })),
    );
    console.log(`Created ${customerNum} customers 👨`);

    // Create sales
    const sales: Sale[] = await SaleModel.insertMany(
      Array.from({ length: saleNum }, () => ({
        shopId: faker.helpers.arrayElement(shops)
          ._id as mongoose.Types.ObjectId,
        workerId: faker.helpers.arrayElement(workers)
          ._id as mongoose.Types.ObjectId,
        products: [
          {
            product: faker.helpers.arrayElement(products)
              ._id as mongoose.Types.ObjectId,
            quantityBought: faker.number.int({ min: 1, max: 10 }),
          },
        ],
        customerId: faker.helpers.arrayElement(customers)
          ._id as mongoose.Types.ObjectId,
      })),
    );
    console.log(`Created ${saleNum} sales 💸`);

    // Update categories with products
    for (const category of categories) {
      category.products = Array.from(
        { length: 3 },
        () =>
          faker.helpers.arrayElement(products)._id as mongoose.Types.ObjectId,
      );
      await CategoryModel.findByIdAndUpdate(category._id, category);
      console.log(`🧞 Filled up products in category`);
    }

    // Update suppliers with products
    for (const supplier of suppliers) {
      supplier.products = Array.from(
        { length: 3 },
        () =>
          faker.helpers.arrayElement(products)._id as mongoose.Types.ObjectId,
      );
      await SupplierModel.findByIdAndUpdate(supplier._id, supplier);
      console.log(`🧞 Filled products in suppliers`);
    }

    // Update shops with workers and sales
    for (const shop of shops) {
      shop.sales = Array.from(
        { length: 3 },
        () => faker.helpers.arrayElement(sales)?._id as mongoose.Types.ObjectId,
      ).filter(Boolean); // Ensure there are no undefined values

      // Ensure unique worker IDs
      const uniqueWorkerIds = new Set(
        Array.from(
          { length: 3 },
          () =>
            faker.helpers.arrayElement(workers)?._id as mongoose.Types.ObjectId,
        ).filter(Boolean),
      );
      shop.workers = Array.from(uniqueWorkerIds);

      await ShopModel.findByIdAndUpdate(shop._id, shop);
      console.log(`🧞 Filled workers and sales in shop models`);
    }

    // Update workers with sales
    for (const worker of workers) {
      worker.saleId = Array.from(
        { length: 3 },
        () => faker.helpers.arrayElement(sales)?._id as mongoose.Types.ObjectId,
      ).filter(Boolean); // Ensure there are no undefined values

      await WorkerModel.findByIdAndUpdate(worker._id, worker);
      console.log(`🧞 Filled sales in workers`);
    }

    // Update customers with transactions
    for (const customer of customers) {
      customer.transactions = Array.from(
        { length: 3 },
        () => faker.helpers.arrayElement(sales)?._id as mongoose.Types.ObjectId,
      ).filter(Boolean); // Ensure there are no undefined values

      await CustomerModel.findByIdAndUpdate(customer._id, customer);
      console.log(`🧞 Filled transactions in customers`);
    }

    console.log("🌟 Database initialization complete! 🌟");
  } catch (error) {
    console.error(`Error during the generation of defaults: ${error}`);
  }
}

initDb({
  customerNum: 20,
  saleNum: 30,
  shopNum: 3,
  workerNum: 8,
  productNum: 45,
  categoriesNum: 8,
  supplierNum: 3,
});
