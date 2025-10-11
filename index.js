const express = require('express');
const cors = require('cors'); // <-- CORS için eklendi
const app = express();
const productRouter = require('./router/product');
const categoryRouter = require('./router/category');
const connection = require('./services/mysql'); // MySQL bağlantısı
const aboutRouter = require('./router/about');
const contactRouter = require('./router/contact');
const brandsRouter = require('./router/brands');
const signboardRouter = require('./router/signboards');
const sliderRouter = require('./router/slider');
const port = 3000;

// Middleware
app.use(cors()); // <-- Tüm frontend originlerine izin ver
// Eğer sadece belirli bir frontend'e izin vermek istersen:
// app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Routes
const fs = require('fs');
const uploadDir = './uploads';
const productUploadDir = './uploads/product';
const sliderUploadDir = './uploads/slider';
const aboutUploadDir = './uploads/about';
const contactUploadDir = './uploads/contact';

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(productUploadDir)){
    fs.mkdirSync(productUploadDir, { recursive: true });
}
if (!fs.existsSync(sliderUploadDir)){
    fs.mkdirSync(sliderUploadDir, { recursive: true });
}
if (!fs.existsSync(aboutUploadDir)){
    fs.mkdirSync(aboutUploadDir, { recursive: true });
}
if (!fs.existsSync(contactUploadDir)){
    fs.mkdirSync(contactUploadDir, { recursive: true });
}

app.use('/products', productRouter);
app.use('/category', categoryRouter);
app.use('/uploads', express.static('uploads'));
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/brands', brandsRouter);
app.use('/signboards', signboardRouter);
app.use('/slider', sliderRouter);



// Server başlatma
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Test veya başka modüllerde kullanılacaksa
module.exports = app;
