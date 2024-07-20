import { model, Schema } from "mongoose";
import { Sale } from "../definitions";

const saleSchema = new Schema<Sale>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Shop ID is required"],
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: [true, "Worker ID is required"],
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        productPrice: {
          type: Number,
          min: [0.25, "Price can't be less than 0.25"],
          require: true,
        },
        quantityBought: {
          type: Number,
          required: [true, "Quantity bought is required"],
          min: [1, "Quantity bought can't be less than one"],
        },
      },
    ],
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

saleSchema.virtual("totalPrice").get(function () {
  // Assume profit calculation logic is defined here, for example:
  return this.products.reduce(
    (sumPrice, product) =>
      sumPrice + product.product.buyPrice * product.quantityBought,
    0,
  );
});
saleSchema.virtual("totalSold").get(function () {
  // Assume profit calculation logic is defined here, for example:
  return this.products.reduce(
    (sumPrice, product) =>
      sumPrice + product.product.price * product.quantityBought,
    0,
  );
});

saleSchema.virtual("profit").get(function () {
  if (!this?.totalSold || !this?.totalPrice) return 0;
  return this.totalSold - this.totalPrice;
});

const SaleModel = model<Sale>("Sale", saleSchema);
export default SaleModel;
