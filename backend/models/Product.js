const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const imageSchema = new mongoose.Schema(
  {
    public_id: { type: String },
    url: { type: String }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    category: { type: String },
    images: [imageSchema],
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ ratings: -1, isActive: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
