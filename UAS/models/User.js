// models/User.js
const { pool } = require('../config/db'); // Mengimpor pool koneksi database

// Fungsi untuk mencari user berdasarkan email
// Digunakan saat login dan pendaftaran untuk mengecek keberadaan user
const findUserByEmail = async (email) => {
    // Menggunakan pool.execute untuk query yang aman dari SQL Injection
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0]; // Mengembalikan baris pertama (objek user) jika ditemukan, undefined jika tidak
};

// Fungsi untuk membuat user baru di database
const createUser = async (email, passwordHash, name, role) => {
    const [result] = await pool.execute(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [email, passwordHash, name, role]
    );
    return result.insertId; // Mengembalikan ID dari user yang baru saja dimasukkan
};

// Fungsi untuk mencari user berdasarkan ID
// Digunakan oleh middleware autentikasi untuk memverifikasi user dari token
const findUserById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0]; // Mengembalikan objek user jika ditemukan
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById
};

