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

dotenv.config({ path: "./config.env" });

// const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");

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
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
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

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
