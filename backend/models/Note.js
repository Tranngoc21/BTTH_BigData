const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề không được để trống'],
    trim: true,
    minlength: [1, 'Tiêu đề phải có ít nhất 1 ký tự'],
    maxlength: [100, 'Tiêu đề không được vượt quá 100 ký tự']
  },
  content: {
    type: String,
    required: [true, 'Nội dung không được để trống'],
    trim: true,
    minlength: [1, 'Nội dung phải có ít nhất 1 ký tự']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Thêm index cho tìm kiếm
noteSchema.index({ title: 'text', content: 'text' });

// Middleware trước khi lưu
noteSchema.pre('save', function(next) {
  // Xử lý dữ liệu trước khi lưu nếu cần
  this.title = this.title.trim();
  this.content = this.content.trim();
  next();
});

// Static method để tìm kiếm
noteSchema.statics.searchNotes = async function(query) {
  return this.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ]
  }).sort({ updatedAt: -1 });
};

// Instance method để cập nhật
noteSchema.methods.updateNote = async function(updates) {
  Object.keys(updates).forEach(key => {
    if (key in this) {
      this[key] = updates[key];
    }
  });
  return this.save();
};

const Note = mongoose.model('Note', noteSchema);

module.exports = Note; 