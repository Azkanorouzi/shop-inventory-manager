import { model, Schema } from "mongoose";
import { Product } from "../definitions";

const productSchema = new Schema<Product>({
  productInfo: {
    name: {
      type: String,
      required: [true, "name must be defined for product"],
      maxlength: [550, "name can not be more than 550 characters"],
      trim: true,
      unique: true,
    },
    quantityInStock: {
      type: Number,
      min: [0, "quantity can't be less than 0"],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Category must be defined"],
      default: [],
      ref: "Categories",
    },
    description: {
      type: String,
      maxlength: [550, "can't be more than 550 characters"],
      trim: true,
    },
  },
  lastBuy: {
    type: Date,
    validate: {
      validator: (value) => value <= Date.now(),
      message: "Last buy can not be set to a future date",
    },
  },
  price: {
    type: Number,
    min: [0.25, "Price can not be less than .25"],
    required: [true, "Price is required"],
  },
  buyPrice: {
    type: Number,
    min: [0.25, "Buy price can not be less than .25"],
  },
  supplier: {
    type: Schema.Types.ObjectId,
    required: [true, "Supplier must be specified"],
    ref: "Supplier",
  },
  shopsId: [
    {
      type: Schema.Types.ObjectId,
      required: [true, "Shops id must be specified"],
      ref: "Shop",
    },
  ],
});

module.exports = model("Product", productSchema);
