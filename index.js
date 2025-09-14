const express = require('express');
const app = express();
const productRouter = require('./router/product');

const port = 3000;

// Middleware
app.use(express.json());

// MySQL bağlantısı
const connection = require('./services/mysql');

// Test endpoint
app.get('/', (req, res) => {
  res.send('backend is running');
});

// Routes
app.use('/products', productRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Eğer testte kullanacaksan bırak
module.exports = app;
