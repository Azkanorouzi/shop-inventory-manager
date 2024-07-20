// models/Worker.ts
import { Schema, model } from "mongoose";
import { Worker } from "../definitions"; // Import your Worker interface
import { DateTime } from "luxon"; // Import DateTime for virtuals if needed
import { isAlpha } from "validator";
import { RoleArray } from "../utils/enums";

const workerSchema = new Schema<Worker>(
  {
    // for nested objeccts you can as well store it like this:
    personalInfo: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        validate: {
          message: "First name must be alphabetic",
          validator: isAlpha,
        },
        maxlength: [255, "Can't be more than 255 characters"],
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        validate: {
          message: "Last name must be alphabetic",
          validator: isAlpha,
        },

        maxlength: [255, "Can't be more than 255 characters"],
      },
      age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "Age must be at least 18"],
      },
      isMarried: {
        type: Boolean,
        default: false,
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      enum: RoleArray,
    },
    contract: {
      contractType: {
        type: String, // Adjust this if you have specific enum values
        enum: [],
        required: [true, "Contract type is required"],
      },
      startContract: {
        type: Date,
        required: [true, "Contract start date is required"],
        validate: {
          validator: function (value) {
            return this?.contract?.endContract ?? 0 > value;
          },
        },
      },
      endContract: {
        type: Date,
        required: [true, "Contract end date is required"],
        validate: {
          validator: function (value) {
            return this?.contract?.startContract ?? 0 < value;
          },
        },
      },
      salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary must be a positive number"],
      },
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: [0, "Score must be at least 0"],
      max: [5, "score can't be more than 5"],
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Shop ID is required"],
    },
    saleId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sale",
        required: [true, "Sales ID is required"],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

workerSchema.virtual("isContractFinished").get(function () {
  return DateTime.now() > DateTime.fromJSDate(this.contract.endContract);
});

const Worker = model("Worker", workerSchema);

export default Worker;
