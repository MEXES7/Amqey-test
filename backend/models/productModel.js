import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A Product must have a name"] },
    price: { type: Number, required: [true, "A Product must have a price"] },
    category: {
      type: String,
      required: [true, "A Product must have a category"],
    },
    description: { type: String },
    image: {
      type: String,
    },
    inStock: { type: Boolean, default: true },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
