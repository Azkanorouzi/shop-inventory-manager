import { model, Schema } from "mongoose";
import { Customer } from "../definitions";
import { isAlpha } from "validator";
import { isNameInvalid, isPhoneNumberValid } from "../utils/customValidators";
import isEmail from "validator/lib/isEmail";

const customerSchema = new Schema<Customer>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [550, "Can't be more than 550 characters"],
      // TODO: Will be uncommented later
      // validate: {
      //   validator: (value) => !isNameInvalid(value),
      // },
    },
    email: {
      type: String,
      trim: true,
      maxlength: [550, "Email can not be more than 550 characters"],
      validate: {
        validator: (value) => isEmail(value),
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required for custmer"],
      trim: true,

      // TODO: Will be uncommented later
      // validate: {
      //   validator: isPhoneNumberValid,
      // },
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sale",
      },
    ],
  },

  {
    timestamps: true, // This adds createdAt and updatedAt fields
  },
);

export default model("customer", customerSchema);
