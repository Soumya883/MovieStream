const express = require('express');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');
const { validateCouponCreation, validateCouponUpdate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/coupons
// @desc    Get all coupons (admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/coupons/:id
// @desc    Get coupon by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Coupon not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/coupons
// @desc    Create a new coupon (admin only)
// @access  Private
router.post('/', auth, validateCouponCreation, async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      validFrom,
      validUntil,
      usageLimit,
      applicableMovies,
      applicableUsers
    } = req.body;

    // Check if coupon code already exists
    let existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ msg: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      validFrom,
      validUntil,
      usageLimit,
      applicableMovies,
      applicableUsers
    });

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/coupons/:id
// @desc    Update a coupon (admin only)
// @access  Private
router.put('/:id', auth, validateCouponUpdate, async (req, res) => {
  try {
    const {
      description,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      validFrom,
      validUntil,
      usageLimit,
      isActive,
      applicableMovies,
      applicableUsers
    } = req.body;

    let coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }

    // Update fields
    coupon.description = description || coupon.description;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue || coupon.discountValue;
    coupon.minimumPurchase = minimumPurchase !== undefined ? minimumPurchase : coupon.minimumPurchase;
    coupon.maximumDiscount = maximumDiscount !== undefined ? maximumDiscount : coupon.maximumDiscount;
    coupon.validFrom = validFrom || coupon.validFrom;
    coupon.validUntil = validUntil || coupon.validUntil;
    coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
    coupon.applicableMovies = applicableMovies || coupon.applicableMovies;
    coupon.applicableUsers = applicableUsers || coupon.applicableUsers;

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Coupon not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon (admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }

    await coupon.remove();
    res.json({ msg: 'Coupon removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Coupon not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/coupons/validate
// @desc    Validate a coupon code
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { code, userId, movieId, purchaseAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ msg: 'Invalid coupon code' });
    }

    const isValid = coupon.isValid(userId, movieId, purchaseAmount);
    if (!isValid) {
      return res.status(400).json({ msg: 'Coupon is not valid for this purchase' });
    }

    const discountAmount = coupon.calculateDiscount(purchaseAmount);

    res.json({
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
