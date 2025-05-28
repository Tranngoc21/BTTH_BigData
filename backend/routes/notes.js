const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Lấy tất cả ghi chú
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json({
      success: true,
      data: notes,
      count: notes.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách ghi chú',
      error: err.message
    });
  }
});

// Lấy một ghi chú theo ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ghi chú'
      });
    }
    res.json({
      success: true,
      data: note
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy ghi chú',
      error: err.message
    });
  }
});

// Tạo ghi chú mới
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề và nội dung không được để trống'
      });
    }

    const note = new Note({ title, content });
    const savedNote = await note.save();

    res.status(201).json({
      success: true,
      message: 'Tạo ghi chú thành công',
      data: savedNote
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Không thể tạo ghi chú',
      error: err.message
    });
  }
});

// Cập nhật ghi chú
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: 'Cần ít nhất một trường để cập nhật'
      });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ghi chú'
      });
    }

    const updatedNote = await note.updateNote({ title, content });
    res.json({
      success: true,
      message: 'Cập nhật ghi chú thành công',
      data: updatedNote
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Không thể cập nhật ghi chú',
      error: err.message
    });
  }
});

// Xóa ghi chú
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ghi chú'
      });
    }

    await note.deleteOne();
    res.json({
      success: true,
      message: 'Xóa ghi chú thành công'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa ghi chú',
      error: err.message
    });
  }
});

// Tìm kiếm ghi chú
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Từ khóa tìm kiếm không được để trống'
      });
    }

    const notes = await Note.searchNotes(query);
    res.json({
      success: true,
      data: notes,
      count: notes.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Không thể tìm kiếm ghi chú',
      error: err.message
    });
  }
});

module.exports = router; 