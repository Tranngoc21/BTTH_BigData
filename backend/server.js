const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = "mongodb+srv://tranngoc27112004:27112004@cluster0.juzm8v5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// Tạo ứng dụng Express
const app = express();
const port = 3000; // Cổng mặc định, có thể tự động chuyển nếu đã được sử dụng
// Middleware
app.use(cors());
app.use(bodyParser.json());
// Định nghĩa Schema cho Note
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: { // Đã đổi 'description' thành 'content'
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});
// Tạo model Note
const Note = mongoose.model('Note', noteSchema);
// Middleware để log các yêu cầu HTTP (tùy chọn)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
// Khởi động server
const startServer = (port) => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
    console.log(`Có thể truy cập từ các thiết bị khác qua IP của máy tính`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} đang được sử dụng, thử port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Lỗi khởi động server:', err);
    }
  });
};
startServer(port);
