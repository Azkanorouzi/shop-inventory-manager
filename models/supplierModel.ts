import { Schema, model } from "mongoose";
import { Supplier } from "../definitions"; // Import your Supplier interface
import { isNameInvalid, isPhoneNumberValid } from "../utils/customValidators"; // Import custom validators if available
import { isEmail } from "validator";

const supplierSchema = new Schema<Supplier>(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can't be more than 50 characters"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: isPhoneNumberValid,
        message: "Invalid phone number format",
      },
      maxlength: [15, "can't be more than 15 characters"],
      minlength: [7, "must be at least 7 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator: (value) => isEmail(value),
        message: "Invalid email format",
      },
      maxlength: [550, "Can't be more than 550 characters"],
    },
    address: {
      type: String,
      minlength: [5, "Address must be at least 5 characters"],
      trim: true,
      maxlength: [550, "Can't be more than 550 characters"],
    },
    contactPersonaName: {
      type: String,
      trim: true,
      validate: {
        validator: isNameInvalid,
        message: "Contact name was not valid",
      },
      maxlength: [255, "Can't be more than 255 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [550, "Can't be more than 550 characters"],
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },

  {
    timestamps: true,
  },
);

const SupplierModel = model("Supplier", supplierSchema);
module.exports = SupplierModel;
