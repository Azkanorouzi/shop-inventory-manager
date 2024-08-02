import { model, Schema } from "mongoose";
import { Category } from "../definitions";

const categorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [550, "Can't be more than 550 characters"],
    },
    products: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },

  {
    timestamps: true, // This adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual("numProducts").get(function () {
  return this?.products?.length;
});

export default model("Category", categorySchema);
