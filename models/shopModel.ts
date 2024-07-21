import { Schema, model } from "mongoose";
import { Shop } from "../definitions";
import { isNameInvalid, isPhoneNumberValid } from "../utils/customValidators";
import { DateTime } from "luxon";
import { LUCRATIVE_SALES_THRESHOLD } from "../utils/configs";

const shopSchema = new Schema<Shop>(
  {
    name: {
      type: String,
      required: [true, "shop name is required"],
      trim: true,
      maxlength: [60, "Name can't be more than 30 characters"],
    },
    opensAt: {
      type: Number,
      min: 0,
      max: [12, "Shops opening time can't be more than 12"],
      validate: {
        message: "Open time can't be more than close time",
        validator: function (this: Shop, value) {
          return value < this?.closeAt;
        },
      },
    },
    closeAt: {
      type: Number,
      min: 0,
      max: [24, "Shops closing time can't be more than 24"],
      validate: {
        message: "Close at time can't be less than open time",
        validator: function (this: Shop, value) {
          return value > this?.opensAt;
        },
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    salesPerMon: {
      type: Number,
      min: [0, "Sales per month can't be less than zero"],
      default: 0,
    },
    founded: {
      type: Date,
      default: Date.now,
    },
    img: String,
    workers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
    sales: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sale",
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

shopSchema.virtual("isOpen").get(function () {
  const now = DateTime.now().hour;
  return now < this.closeAt;
});

shopSchema.virtual("isLucrative").get(function () {
  return LUCRATIVE_SALES_THRESHOLD < this.salesPerMon;
});

shopSchema.virtual("numberOfWorkers").get(function () {
  return this.workers.length;
});

export default model("Shop", shopSchema);
