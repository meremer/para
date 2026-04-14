const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const initDatabase = require('./config/initDb');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const kulupRoutes = require('./routes/kulup');
const ogrenciRoutes = require('./routes/ogrenci');
const kantinciRoutes = require('./routes/kantinci');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kulup', kulupRoutes);
app.use('/api/ogrenci', ogrenciRoutes);
app.use('/api/kantinci', kantinciRoutes);

// Serve static files from React build
const frontendBuildPath = path.join(__dirname, '../../frontend/build');
app.use(express.static(frontendBuildPath));

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Veritabanını başlat ve sunucuyu çalıştır
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor`);
    });
  } catch (error) {
    console.error('Sunucu başlatma hatası:', error);
    process.exit(1);
  }
};

startServer();
