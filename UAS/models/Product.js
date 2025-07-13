// models/Product.js
const { pool } = require('../config/db'); // Mengimpor pool koneksi database

// Fungsi untuk mendapatkan semua produk dari database
const getAllProducts = async () => {
    const [rows] = await pool.execute('SELECT * FROM products');
    return rows; // Mengembalikan array objek produk
};

// Fungsi untuk mendapatkan produk tunggal berdasarkan ID
const getProductById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0]; // Mengembalikan objek produk jika ditemukan
};

// Fungsi untuk membuat produk baru di database
const createProduct = async (name, description, price, gender, imageUrl, createdBy) => {
    const [result] = await pool.execute(
        'INSERT INTO products (name, description, price, gender, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, price, gender, imageUrl, createdBy]
    );
    return result.insertId; // Mengembalikan ID produk yang baru dibuat
};

// Fungsi untuk mengupdate produk yang sudah ada di database
const updateProduct = async (id, name, description, price, gender, imageUrl) => {
    const [result] = await pool.execute(
        'UPDATE products SET name = ?, description = ?, price = ?, gender = ?, image_url = ? WHERE id = ?',
        [name, description, price, gender, imageUrl, id]
    );
    return result.affectedRows > 0; // Mengembalikan true jika ada baris yang berhasil diupdate
};

// Fungsi untuk menghapus produk dari database
const deleteProduct = async (id) => {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0; // Mengembalikan true jika ada baris yang berhasil dihapus
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

