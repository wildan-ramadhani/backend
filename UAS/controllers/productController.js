// controllers/productController.js
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../models/Product');
const path = require('path'); // Import path for file operations (e.g., deleting uploaded files)
const fs = require('fs'); // Import fs for file system operations (e.g., deleting uploaded files)

// @desc    Get all products
// @route   GET /api/products
// @access  Public (for now)
const getProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public (for now)
const getProduct = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (for testing CRUD, will be Private later)
const createNewProduct = async (req, res) => {
    // Debugging: Log req.body and req.file to see what Multer provides
    console.log('createNewProduct - req.body:', req.body);
    console.log('createNewProduct - req.file:', req.file);

    // Destructure properties from req.body (populated by Multer for text fields)
    const { name, description, price, gender } = req.body;
    // Get the image URL from req.file (populated by Multer for the file)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Helper function to clean up uploaded file in case of error
    const cleanupFile = () => {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
    };

    // Robust validation
    if (!name || !description || !gender || !imageUrl) {
        cleanupFile();
        return res.status(400).json({ message: 'Please include all required product fields (name, description, gender, imageUrl).' });
    }

    // Validate price specifically
    if (price === undefined || price === null || isNaN(Number(price))) {
        cleanupFile();
        return res.status(400).json({ message: 'Price must be a valid number.' });
    }

    try {
        const createdBy = 1; // Hardcoded for now, will be req.user.id after auth
        
        const productId = await createProduct(name, description, Number(price), gender, imageUrl, createdBy); // Convert price to Number
        const newProduct = await getProductById(productId);
        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error.message);
        cleanupFile(); // Clean up file on database error
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (for testing CRUD, will be Private later)
const updateExistingProduct = async (req, res) => {
    // Debugging: Log req.body and req.file to see what Multer provides
    console.log('updateExistingProduct - req.body:', req.body);
    console.log('updateExistingProduct - req.file:', req.file);

    const { name, description, price, gender } = req.body;
    const { id } = req.params;
    let imageUrl = req.body.imageUrl; // Existing image URL from the form (if no new file)

    const cleanupFile = () => {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
    };

    // If a new file is uploaded, use its path
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
        // Optional: Delete old image from server if new one is uploaded
        // const oldProduct = await getProductById(id);
        // if (oldProduct && oldProduct.image_url && oldProduct.image_url.startsWith('/uploads/')) {
        //     const oldImagePath = path.join(__dirname, '..', oldProduct.image_url);
        //     fs.unlink(oldImagePath, (err) => {
        //         if (err) console.error('Error deleting old image:', err);
        //     });
        // }
    }

    const productExists = await getProductById(id);
    if (!productExists) {
        cleanupFile();
        return res.status(404).json({ message: 'Product not found' });
    }

    // Robust validation
    if (!name || !description || !gender || !imageUrl) {
        cleanupFile();
        return res.status(400).json({ message: 'Please include all required product fields (name, description, gender, imageUrl).' });
    }
    if (price === undefined || price === null || isNaN(Number(price))) {
        cleanupFile();
        return res.status(400).json({ message: 'Price must be a valid number.' });
    }

    try {
        const isUpdated = await updateProduct(id, name, description, Number(price), gender, imageUrl); // Convert price to Number
        if (isUpdated) {
            const updatedProduct = await getProductById(id);
            res.json({
                message: 'Product updated successfully',
                product: updatedProduct
            });
        } else {
            res.status(400).json({ message: 'Product update failed (no changes or invalid data).' });
        }
    } catch (error) {
        console.error('Error updating product:', error.message);
        cleanupFile(); // Clean up file on database error
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (for testing CRUD, will be Private later)
const deleteExistingProduct = async (req, res) => {
    const { id } = req.params;

    const productExists = await getProductById(id);
    if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        // Optional: Delete product image file from server
        // if (productExists.image_url && productExists.image_url.startsWith('/uploads/')) {
        //     const imagePathToDelete = path.join(__dirname, '..', productExists.image_url);
        //     fs.unlink(imagePathToDelete, (err) => {
        //         if (err) console.error('Error deleting product image file:', err);
        //     });
        // }

        const isDeleted = await deleteProduct(id);
        if (isDeleted) {
            res.json({ message: 'Product removed successfully' });
        } else {
            res.status(400).json({ message: 'Product deletion failed.' });
        }
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct
};
