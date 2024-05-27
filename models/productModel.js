const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, requried: true, unique: true },
    price: { type: Number, required: true },
    tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    desc: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
