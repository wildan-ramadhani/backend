// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // Mengimpor fungsi controller

const router = express.Router(); // Membuat instance router Express

// Definisi rute untuk autentikasi
router.post('/register', registerUser); // Endpoint POST untuk pendaftaran user
router.post('/login', loginUser);     // Endpoint POST untuk login user

module.exports = router;

