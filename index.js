const express = require('express');
const cors = require('cors'); // <-- CORS için eklendi
const app = express();
const productRouter = require('./router/product');
const categoryRouter = require('./router/category');
const connection = require('./services/mysql'); // MySQL bağlantısı

const port = 3000;

// Middleware
app.use(cors()); // <-- Tüm frontend originlerine izin ver
// Eğer sadece belirli bir frontend'e izin vermek istersen:
// app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Routes
app.use('/products', productRouter);
app.use('/category', categoryRouter);

// Server başlatma
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Test veya başka modüllerde kullanılacaksa
module.exports = app;
