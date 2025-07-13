// config/db.js
const mysql = require('mysql2/promise'); // Menggunakan mysql2/promise untuk async/await

// Konfigurasi koneksi database dari environment variables
// Pastikan Anda telah mengisi file .env dengan kredensial MySQL Anda yang sebenarnya
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_mysql_password', // Ganti dengan password MySQL Anda
    database: process.env.DB_NAME || 'e_commerce_db',
    waitForConnections: true, // Menunggu koneksi tersedia jika pool penuh
    connectionLimit: 10,     // Batas jumlah koneksi dalam pool
    queueLimit: 0            // Tidak ada batas antrian untuk koneksi
});

// Fungsi untuk menguji koneksi database saat aplikasi dimulai
const testDbConnection = async () => {
    try {
        const connection = await pool.getConnection(); // Ambil koneksi dari pool
        console.log('Connected to MySQL database successfully!');
        connection.release(); // Lepaskan koneksi kembali ke pool
    } catch (error) {
        console.error('Failed to connect to MySQL database:', error.message);
        // Keluar dari aplikasi jika koneksi database gagal, karena aplikasi tidak akan berfungsi tanpa DB
        process.exit(1); 
    }
};

module.exports = { pool, testDbConnection };

