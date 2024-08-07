// TODO: helmet, compression, rate limit must be added
import { NextFunction, Request, Response } from "express";
import { CustomError } from "./definitions";
import mongoose from "mongoose";

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");

// Routes
import indexRouter from "./routes/indexRoute";
import statisticsRouter from "./routes/statisticsRoute";
import shopsRouter from "./routes/shopsRoute";
import categoryRouter from "./routes/categoriesRoute";
import saleRouter from "./routes/salesRoute";
import productRouter from "./routes/productsRoute";
import supplierRouter from "./routes/productsRoute";
import workersRouter from "./routes/workersRoute";
import customerRouter from "./routes/customersRoute";

dotenv.config({ path: "./config.env" });

const app = express();

const dbUri = process?.env?.DATABASE_URI ?? "mongodb://localhost:27017";
// Connecting to mongo
mongoose
  .connect(dbUri)
  .then(() => {
    console.log("DB connection was successful");
  })
  .catch((err) => console.error(err));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use("/", indexRouter);
app.use("/statistics", statisticsRouter);
app.use("/shops", shopsRouter);
app.use("/categories", categoryRouter);
app.use("/sales", saleRouter);
app.use("/products", productRouter);
app.use("/suppliers", supplierRouter);
app.use("/workers", workersRouter);
app.use("/customers", customerRouter);

app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // if (err.status === 404) res.render("pages/p404");
  // render the error page
  res.status(err.status || 500);
  res.render("pages/error", { status: err.status, message: err.message });
});

module.exports = app;
