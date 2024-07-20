import { model, Schema } from "mongoose";
import { Customer } from "../definitions";
import { isAlpha } from "validator";
import { isNameInvalid, isPhoneNumberValid } from "../utils/customValidators";
import isEmail from "validator/lib/isEmail";

const customerSchema = new Schema<Customer>({
  name: {
    type: String,
    trim: true,
    maxlength: [550, "Can't be more than 550 characters"],
    validate: {
      validator: (value) => !isNameInvalid(value),
    },
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
    required: [true, "Phone number is required for shop"],
    trim: true,
    validate: {
      validator: isPhoneNumberValid,
    },
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sale",
    },
  ],
});

export default model("customer", customerSchema);
