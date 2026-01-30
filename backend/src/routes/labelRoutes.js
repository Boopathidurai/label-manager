const express = require('express');
const router = express.Router();
const { 
  getAllLabels, 
  updateLabel, 
  getLabelHistory,
  searchLabels 
} = require('../controllers/labelController');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/labels
// @desc    Get all labels (public for frontend to load labels)
router.get('/', getAllLabels);

// @route   GET /api/labels/search
// @desc    Search labels
router.get('/search', protect, adminOnly, searchLabels);

// @route   GET /api/labels/history
// @desc    Get label change history
router.get('/history', protect, adminOnly, getLabelHistory);

// @route   PUT /api/labels/:key
// @desc    Update label
router.put('/:key', protect, adminOnly, updateLabel);

module.exports = router;
