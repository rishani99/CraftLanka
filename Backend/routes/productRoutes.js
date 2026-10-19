const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load products.',
    });
  }
});

// GET products belonging to the logged-in seller
router.get('/mine', protect, async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Get my products error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load your products.',
    });
  }
});

// POST a new product
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      stock,
      image,
    } = req.body;

    // Validate required fields
    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof description !== 'string' ||
      !description.trim() ||
      typeof category !== 'string' ||
      !category.trim() ||
      price === undefined ||
      price === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the product name, category, price, and description.',
      });
    }

    const numericPrice = Number(price);
    const numericStock =
      stock === undefined || stock === '' ? 0 : Number(stock);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isFinite(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Price and stock must be valid non-negative numbers.',
      });
    }

    const allowedCategories = [
      'Wood Carving',
      'Batik',
      'Pottery',
      'Handloom',
    ];

    if (!allowedCategories.includes(category.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product category.',
      });
    }

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      price: numericPrice,
      stock: numericStock,
      image: typeof image === 'string' ? image.trim() : '',
      seller: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      product,
    });
  } catch (error) {
    console.error('Add product error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to add product.',
    });
  }
});

// DELETE a product belonging to the logged-in seller
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.',
      });
    }

    const product = await Product.findOne({
      _id: id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have permission to delete it.',
      });
    }

    await Product.deleteOne({ _id: product._id });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.error('Delete product error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
    });
  }
});

module.exports = router;