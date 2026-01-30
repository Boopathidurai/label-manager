const { Label } = require('../models');
const chatbotService = require('../services/chatbotService');
const labelController = require('./labelController');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @route   POST /api/chatbot/process
 * @desc    Process chatbot command
 * @access  Protected (Admin only)
 */
const processCommand = async (req, res, next) => {
  try {
    const { command } = req.body;

    if (!command || !command.trim()) {
      return sendError(res, 400, 'Command is required');
    }

    // Parse the command
    const parsed = chatbotService.parseCommand(command);

    // Handle different actions
    switch (parsed.action) {
      case 'change':
        return await handleChangeLabel(req, res, next, parsed);

      case 'list':
        return await handleListLabels(req, res, next);

      case 'help':
        return sendSuccess(res, 200, 'Help information', {
          response: chatbotService.getHelpMessage(),
          type: 'help'
        });

      case 'unknown':
        return sendSuccess(res, 200, 'Command not recognized', {
          response: `I didn't understand that command. ${chatbotService.getHelpMessage()}`,
          type: 'error'
        });

      default:
        return sendError(res, 400, 'Invalid command action');
    }

  } catch (error) {
    next(error);
  }
};

/**
 * Handle label change command
 */
const handleChangeLabel = async (req, res, next, parsed) => {
  try {
    // Get all available labels
    const labels = await Label.findAll();

    // Find the label
    const label = chatbotService.findLabelByFuzzyMatch(parsed.labelKey, labels);

    if (!label) {
      return sendSuccess(res, 200, 'Label not found', {
        response: `I couldn't find a label matching "${parsed.labelKey}". Please check the label name and try again.`,
        type: 'error',
        suggestions: labels.map(l => `${l.label_key} (${l.label_value})`)
      });
    }

    // Update the label (reuse existing controller logic)
    req.params.key = label.label_key;
    req.body.value = parsed.newValue;
    req.body.changeType = 'chatbot';
    req.body.chatbotCommand = parsed.original;

    // Update label
    await label.update({
      label_value: parsed.newValue,
      updated_by: req.user.id
    });

    // Create history record
    const { LabelHistory } = require('../models');
    await LabelHistory.create({
      label_id: label.id,
      label_key: label.label_key,
      old_value: label.label_value,
      new_value: parsed.newValue,
      changed_by: req.user.id,
      change_type: 'chatbot',
      chatbot_command: parsed.original
    });

    return sendSuccess(res, 200, 'Label updated successfully', {
      response: `✅ Successfully changed "${label.label_key}" from "${label.label_value}" to "${parsed.newValue}"`,
      type: 'success',
      label: {
        label_key: label.label_key,
        old_value: label.label_value,
        new_value: parsed.newValue,
        page: label.page
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Handle list labels command
 */
const handleListLabels = async (req, res, next) => {
  try {
    const labels = await Label.findAll({
      order: [['page', 'ASC'], ['position', 'ASC']],
      attributes: ['label_key', 'label_value', 'page']
    });

    const labelList = labels.map(l => `• ${l.label_key}: "${l.label_value}" (${l.page})`).join('\n');

    return sendSuccess(res, 200, 'Labels listed', {
      response: `Here are all available labels:\n\n${labelList}`,
      type: 'list',
      labels
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  processCommand
};
