const { Label, LabelHistory } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * @route   GET /api/labels
 * @desc    Get all labels
 * @access  Public
 */
const getAllLabels = async (req, res, next) => {
  try {
    const labels = await Label.findAll({
      order: [['page', 'ASC'], ['position', 'ASC']],
      attributes: ['id', 'label_key', 'label_value', 'page', 'position', 'description']
    });

    // Group labels by page for easier frontend consumption
    const groupedLabels = labels.reduce((acc, label) => {
      if (!acc[label.page]) {
        acc[label.page] = {};
      }
      acc[label.page][label.label_key] = label.label_value;
      return acc;
    }, {});

    return sendSuccess(res, 200, 'Labels retrieved successfully', {
      labels: groupedLabels,
      rawLabels: labels
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/labels/:key
 * @desc    Update label value
 * @access  Protected (Admin only)
 */
const updateLabel = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value, changeType = 'manual', chatbotCommand = null } = req.body;

    if (!value) {
      return sendError(res, 400, 'Label value is required');
    }

    // Find label by key
    const label = await Label.findOne({
      where: { label_key: key }
    });

    if (!label) {
      return sendError(res, 404, `Label with key '${key}' not found`);
    }

    const oldValue = label.label_value;

    // Update label
    label.label_value = value;
    label.updated_by = req.user.id;
    await label.save();

    // Create history record
    await LabelHistory.create({
      label_id: label.id,
      label_key: label.label_key,
      old_value: oldValue,
      new_value: value,
      changed_by: req.user.id,
      change_type: changeType,
      chatbot_command: chatbotCommand
    });

    return sendSuccess(res, 200, 'Label updated successfully', {
      label: {
        label_key: label.label_key,
        label_value: label.label_value,
        page: label.page
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/labels/history
 * @desc    Get label change history
 * @access  Protected (Admin only)
 */
const getLabelHistory = async (req, res, next) => {
  try {
    const { limit = 50, labelKey } = req.query;

    const whereClause = labelKey ? { label_key: labelKey } : {};

    const history = await LabelHistory.findAll({
      where: whereClause,
      include: [
        {
          association: 'changer',
          attributes: ['id', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    return sendSuccess(res, 200, 'History retrieved successfully', {
      history
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/labels/search
 * @desc    Search labels by key or value
 * @access  Protected (Admin only)
 */
const searchLabels = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return sendError(res, 400, 'Search query is required');
    }

    const labels = await Label.findAll({
      where: {
        [Op.or]: [
          { label_key: { [Op.iLike]: `%${query}%` } },
          { label_value: { [Op.iLike]: `%${query}%` } }
        ]
      },
      order: [['page', 'ASC'], ['position', 'ASC']]
    });

    return sendSuccess(res, 200, 'Search completed', {
      labels,
      count: labels.length
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLabels,
  updateLabel,
  getLabelHistory,
  searchLabels
};
