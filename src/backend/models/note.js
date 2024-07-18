const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  color: String,
  reminder: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Note', NoteSchema);
