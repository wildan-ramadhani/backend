// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const {
    getProducts,
    getProduct,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct
} = require('../controllers/productController');

const router = express.Router();

// ====================================================================
// Konfigurasi Multer untuk Unggahan Gambar
// ====================================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
    }
});


// ====================================================================
// Product Routes (Saat ini Publik untuk pengujian CRUD)
// ====================================================================

// GET /api/products
router.get('/', (req, res, next) => { console.log('Product Route: GET /api/products'); next(); }, getProducts);

// GET /api/products/:id
// Ini adalah rute yang mungkin menangkap permintaan gambar secara tidak sengaja
router.get('/:id', (req, res, next) => { 
    console.log('Product Route: GET /api/products/:id - ID:', req.params.id); 
    // Jika ID terlihat seperti nama file gambar, ini bisa jadi masalah
    if (req.params.id.includes('.')) {
        console.warn('Product Route: GET /api/products/:id received what looks like a file request:', req.params.id);
        // Mungkin ada konflik dengan express.static
    }
    next(); 
}, getProduct);

// POST /api/products
router.post(
    '/', 
    upload.single('image'), 
    (req, res, next) => { console.log('Product Route: POST /api/products (after Multer)'); next(); },
    createNewProduct
); 

// PUT /api/products/:id
router.put(
    '/:id', 
    upload.single('image'),
    (req, res, next) => { console.log('Product Route: PUT /api/products/:id (after Multer)'); next(); },
    updateExistingProduct
);

// DELETE /api/products/:id
router.delete('/:id', (req, res, next) => { console.log('Product Route: DELETE /api/products/:id'); next(); }, deleteExistingProduct);

module.exports = router;
