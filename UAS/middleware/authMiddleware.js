// middleware/authMiddleware.js
const jwt = require('jsonwebtoken'); // Untuk memverifikasi JSON Web Token
const { findUserById } = require('../models/User'); // Mengimpor fungsi untuk mencari user berdasarkan ID

// Middleware untuk melindungi rute (memeriksa apakah user terautentikasi)
const protect = async (req, res, next) => {
    let token;

    // Cek jika ada header Authorization dan dimulai dengan 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari header Authorization (format: "Bearer TOKEN_ANDA")
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token menggunakan JWT_SECRET dari .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Cari user di database berdasarkan ID dari token yang didekode.
            // Password tidak disertakan untuk keamanan.
            req.user = await findUserById(decoded.id); // Asumsikan decoded token memiliki properti 'id' user

            // Jika user tidak ditemukan di database
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Lanjutkan ke middleware/controller berikutnya
        } catch (error) {
            // Tangani error jika token tidak valid atau kadaluarsa
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Jika tidak ada token di header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware untuk otorisasi (memeriksa peran user)
// Menerima daftar peran yang diizinkan sebagai argumen
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user harus sudah tersedia dari middleware 'protect' sebelumnya
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized to access this route' });
        }
        next(); // Lanjutkan jika user memiliki peran yang diizinkan
    };
};

module.exports = { protect, authorizeRoles };

