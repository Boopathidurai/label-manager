/**
 * Chatbot service to parse natural language commands
 */

class ChatbotService {
  /**
   * Parse chatbot command
   * @param {String} command - User command
   * @returns {Object} Parsed command object
   */
  parseCommand(command) {
    const lowercaseCommand = command.toLowerCase().trim();

    // Pattern: "change X to Y", "rename X to Y", "update X to Y"
    const changePatterns = [
      /(?:change|rename|update)\s+(?:the\s+)?(?:label\s+)?["']?(\w+)["']?\s+(?:label\s+)?(?:to|as)\s+["']?([^"']+)["']?/i,
      /(?:change|rename|update)\s+["']?([^"']+)["']?\s+(?:to|as)\s+["']?([^"']+)["']?/i
    ];

    for (const pattern of changePatterns) {
      const match = lowercaseCommand.match(pattern);
      if (match) {
        return {
          action: 'change',
          labelKey: match[1].trim().toLowerCase(),
          newValue: this.capitalizeWords(match[2].trim()),
          original: command
        };
      }
    }

    // Pattern: "show all labels", "list labels", "get labels"
    if (/(show|list|get|display)\s+(all\s+)?labels?/i.test(lowercaseCommand)) {
      return {
        action: 'list',
        original: command
      };
    }

    // Pattern: "help", "what can you do"
    if (/(help|what can you do|commands)/i.test(lowercaseCommand)) {
      return {
        action: 'help',
        original: command
      };
    }

    // Unknown command
    return {
      action: 'unknown',
      original: command
    };
  }

  /**
   * Capitalize first letter of each word
   * @param {String} str - Input string
   * @returns {String} Capitalized string
   */
  capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Generate help message
   * @returns {String} Help message
   */
  getHelpMessage() {
    return `I can help you manage labels! Here are some commands you can use:

📝 Change a label:
   • "Change About to Contact Us"
   • "Rename Home to Welcome"
   • "Update Career to Jobs"

📋 List all labels:
   • "Show all labels"
   • "List labels"

❓ Get help:
   • "Help"
   • "What can you do"

Example: "Change About to Contact Us"`;
  }

  /**
   * Validate if label key exists
   * @param {String} labelKey - Label key to validate
   * @param {Array} availableLabels - List of available labels
   * @returns {Boolean} True if valid
   */
  isValidLabelKey(labelKey, availableLabels) {
    return availableLabels.some(
      label => label.label_key.toLowerCase() === labelKey.toLowerCase()
    );
  }

  /**
   * Find label by fuzzy matching
   * @param {String} labelKey - Label key to search
   * @param {Array} availableLabels - List of available labels
   * @returns {Object|null} Matched label or null
   */
  findLabelByFuzzyMatch(labelKey, availableLabels) {
    // Exact match
    const exactMatch = availableLabels.find(
      label => label.label_key.toLowerCase() === labelKey.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    // Partial match
    const partialMatch = availableLabels.find(
      label => label.label_key.toLowerCase().includes(labelKey.toLowerCase()) ||
               label.label_value.toLowerCase().includes(labelKey.toLowerCase())
    );
    return partialMatch || null;
  }
}

module.exports = new ChatbotService();
