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
      unique: true,
      trim: true,
      maxlength: [30, "Name can't be more than 30 characters"],
      validate: {
        validator: isNameInvalid,
      },
    },
    opensAt: {
      required: true,
      type: Number,
      min: 0,
      max: [12, "Shops openning time can't be more than 12"],
      validate: {
        message: "Open time, can't be more than close time",
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
        message: "Close at time, can't be less than open time",
        validator: function (this: Shop, value) {
          return value > this?.opensAt;
        },
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required for shop"],
      trim: true,
      validate: {
        validator: isPhoneNumberValid,
      },
    },
    location: Geolocation,
    salesPerMon: {
      type: Number,
      min: [0, "Sales per month can't be  less than zero"],
      default: 0,
    },
    founded: {
      type: Date,
      default: Date.now(),
    },
    img: String,

    workers: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "Workers for shop must be defined"],
        default: [],
        ref: "Workers",
        unique: true,
      },
    ],

    sales: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "Sales for shop must be defined"],
        default: [],
        ref: "Workers",
      },
    ],

    categories: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "Categories id is required"],
        default: [],
        ref: "Worker",
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
  const isOpen = now < this.closeAt;
  return isOpen;
});

shopSchema.virtual("isLucrative").get(function () {
  const isLucrative = LUCRATIVE_SALES_THRESHOLD < this.salesPerMon;

  return isLucrative;
});

shopSchema.virtual("numberOfWorkers").get(function () {
  return this.workers.length;
});

module.exports = model("Shop", shopSchema);
