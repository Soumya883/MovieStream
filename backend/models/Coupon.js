const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed']
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumPurchase: {
    type: Number,
    default: 0
  },
  maximumDiscount: {
    type: Number,
    default: null // For percentage discounts
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }], // Empty array means applicable to all movies
  applicableUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }], // Empty array means applicable to all users
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient code lookup
couponSchema.index({ code: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function(userId = null, movieId = null, purchaseAmount = 0) {
  const now = new Date();

  // Check basic validity
  if (!this.isActive) return false;
  if (now < this.validFrom || now > this.validUntil) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  if (purchaseAmount < this.minimumPurchase) return false;

  // Check user applicability
  if (this.applicableUsers.length > 0 && userId && !this.applicableUsers.includes(userId)) {
    return false;
  }

  // Check movie applicability
  if (this.applicableMovies.length > 0 && movieId && !this.applicableMovies.includes(movieId)) {
    return false;
  }

  return true;
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(amount) {
  let discount = 0;

  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  } else if (this.discountType === 'fixed') {
    discount = this.discountValue;
  }

  // Ensure discount doesn't exceed the purchase amount
  return Math.min(discount, amount);
};

module.exports = mongoose.model('Coupon', couponSchema);
