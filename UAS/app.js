// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Perbaikan: Import modul 'path'
const { testDbConnection } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Test database connection when the application starts
testDbConnection();

// Middleware
app.use(cors());
console.log('Middleware: CORS loaded');

app.use(express.json());
console.log('Middleware: express.json loaded');

app.use(express.urlencoded({ extended: false }));
console.log('Middleware: express.urlencoded loaded');

// DEBUGGING: Log req.body and other request details
app.use((req, res, next) => {
    console.log('\n--- Incoming Request ---');
    console.log('  Method:', req.method);
    console.log('  URL:', req.url);
    console.log('  Content-Type Header:', req.headers['content-type']);
    console.log('  Body (after parsers):', req.body);
    next(); // Lanjutkan ke middleware/rute berikutnya
});

// ✅ PENTING: Middleware untuk melayani file statis
// Ini harus di atas rute API agar permintaan gambar ditangani terlebih dahulu.
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); // ✅ Menggunakan path.join untuk keamanan
console.log('Middleware: Static files /uploads loaded from public/uploads');

// API Routes
app.use('/api/auth', authRoutes);
console.log('Route: /api/auth loaded');

app.use('/api/products', productRoutes);
console.log('Route: /api/products loaded');

// ✅ Middleware untuk menangani rute yang tidak ditemukan (404)
// Ini harus diletakkan SETELAH semua rute dan static files
app.use((req, res, next) => {
    console.log('--- 404 Handler ---');
    console.log('  No route matched for URL:', req.url);
    res.status(404).json({ message: 'API Endpoint Not Found or Resource Not Found' });
});

// Global error handling (Ini akan menangkap error dari middleware atau rute di atas)
app.use((err, req, res, next) => {
    console.error('\n--- GLOBAL ERROR HANDLER ---');
    console.error('  Error Name:', err.name);
    console.error('  Error Message:', err.message);
    console.error('  Error Stack:', err.stack);
    
    res.setHeader('Content-Type', 'application/json'); 
    res.status(err.status || 500).json({ 
        message: err.message || 'Server Error: Something broke!',
        error: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
    console.log(`Access: http://localhost:${PORT}`);
});
