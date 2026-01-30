const User = require('./User');
const Label = require('./Label');
const LabelHistory = require('./LabelHistory');

// Define relationships
Label.belongsTo(User, { 
  foreignKey: 'updated_by', 
  as: 'updater' 
});

LabelHistory.belongsTo(User, { 
  foreignKey: 'changed_by', 
  as: 'changer' 
});

LabelHistory.belongsTo(Label, { 
  foreignKey: 'label_id', 
  as: 'label' 
});

Label.hasMany(LabelHistory, { 
  foreignKey: 'label_id', 
  as: 'history' 
});

module.exports = {
  User,
  Label,
  LabelHistory
};
