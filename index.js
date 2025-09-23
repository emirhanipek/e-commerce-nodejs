const express = require('express');
const cors = require('cors'); // <-- CORS için eklendi
const app = express();
const productRouter = require('./router/product');
const categoryRouter = require('./router/category');
const authRoutes = require('./router/auth');
const connection = require('./db/mysql'); // MySQL bağlantısı

const port = 3000;

// Middleware
app.use(cors()); // <-- Tüm frontend originlerine izin ver


app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Routes
const fs = require('fs');
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use('/products', productRouter);
app.use('/category', categoryRouter);
app.use('/login', authRoutes);
app.use('/uploads', express.static('uploads'));


// Server başlatma
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Test veya başka modüllerde kullanılacaksa
module.exports = app;
