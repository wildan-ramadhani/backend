// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/User');

// Fungsi pembantu untuk menghasilkan token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token berlaku 1 jam
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields (name, email, password)' });
    }

    const userExists = await findUserByEmail(email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = (role === 'admin') ? 'admin' : 'user';

    try {
        const userId = await createUser(email, hashedPassword, name, userRole);
        const newUser = await findUserByEmail(email); 

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser.id),
            },
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Server error during registration: ' + error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    console.log('loginUser - Received credentials:', req.body); // Debugging log

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await findUserByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                message: 'Logged in successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id),
                },
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login process:', error.message);
        res.status(500).json({ message: 'Server error during login: ' + error.message });
    }
};

module.exports = { registerUser, loginUser };
