
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Note_App";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});



// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');

// // Tạo ứng dụng Express
// const app = express();
// const port = 3000;

// // Middleware 
// app.use(cors()); // Cho phép CORS
// app.use(bodyParser.json()); // Xử lý JSON

// // Kết nối MongoDB
// const username = "tranngoc27112004";
// const password = "27112004";
// const cluster = "cluster0.juzm8v5.mongodb.net";
// const encoded_password = encodeURIComponent(password);

// const uri = `mongodb+srv://${username}:${encoded_password}@${cluster}/?retryWrites=true&w=majority`;

// // Kết nối MongoDB với Mongoose
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   ssl: true
// })
// .then(() => {
//   console.log('Kết nối MongoDB thành công!');
// })
// .catch((error) => {
//   console.error('Lỗi kết nối MongoDB:', error);
// });

// // Định nghĩa Schema cho Note
// const noteSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true
//   }
// }, {
//   timestamps: true // Tự động thêm createdAt và updatedAt
// });

// // Tạo model Note
// const Note = mongoose.model('Note', noteSchema);

// // Middleware để log các yêu cầu HTTP
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// // Định nghĩa các routes

// // 1. Lấy danh sách ghi chú
// app.get('/notes', async (req, res) => {
//   try {
//     const notes = await Note.find().sort({ createdAt: -1 });
//     res.json({
//       success: true,
//       data: notes
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi lấy danh sách ghi chú',
//       error: error.message
//     });
//   }
// });

// // 2. Thêm ghi chú mới
// app.post('/notes', async (req, res) => {
//   const { title, description } = req.body;
//   try {
//     const note = new Note({ title, description });
//     const savedNote = await note.save();
//     res.status(201).json({
//       success: true,
//       message: 'Ghi chú đã được thêm',
//       data: savedNote
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi thêm ghi chú',
//       error: error.message
//     });
//   }
// });

// // 3. Sửa ghi chú
// app.put('/notes/:id', async (req, res) => {
//   const { id } = req.params;
//   const { title, description } = req.body;
//   try {
//     const note = await Note.findByIdAndUpdate(
//       id,
//       { title, description },
//       { new: true, runValidators: true }
//     );
    
//     if (!note) {
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy ghi chú'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Ghi chú đã được cập nhật',
//       data: note
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi cập nhật ghi chú',
//       error: error.message
//     });
//   }
// });

// // 4. Xóa ghi chú
// app.delete('/notes/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const note = await Note.findByIdAndDelete(id);
    
//     if (!note) {
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy ghi chú'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Ghi chú đã được xóa'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi xóa ghi chú',
//       error: error.message
//     });
//   }
// });

// // 5. Tìm kiếm ghi chú
// app.get('/notes/search', async (req, res) => {
//   const { q } = req.query;
//   try {
//     const notes = await Note.find({
//       $or: [
//         { title: { $regex: q, $options: 'i' } },
//         { description: { $regex: q, $options: 'i' } }
//       ]
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: notes
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi tìm kiếm ghi chú',
//       error: error.message
//     });
//   }
// });

// // Khởi động server
// const startServer = (port) => {
//   app.listen(port, '0.0.0.0', () => {
//     console.log(`Server đang chạy tại http://localhost:${port}`);
//     console.log(`Có thể truy cập từ các thiết bị khác qua IP của máy tính`);
//   }).on('error', (err) => {
//     if (err.code === 'EADDRINUSE') {
//       console.log(`Port ${port} đang được sử dụng, thử port ${port + 1}...`);
//       startServer(port + 1);
//     } else {
//       console.error('Lỗi khởi động server:', err);
//     }
//   });
// };

// startServer(port);
