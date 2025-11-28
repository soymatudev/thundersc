const Logger = require('../utils/Logger');
const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authService.login(username, password);
        if (!user) return res.status(401).json({ message: 'Invalid username or password' });
        res.cookie('access_token', user.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' })
        .status(200).json({message: 'Login successful', user: user});
    } catch (error) {
        Logger.error(`Error during login for user ${username}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.register = async (req, res) => {
    const {userData, usuarioPermisoData} = req.body;
    try {
        const newUser = await authService.register(userData, usuarioPermisoData);
        res.status(201).json(newUser);
    } catch (error) {
        Logger.error(`Error during registration for user ${userData.username}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.profile = async (req, res) => {
    const userId = req.id;
    try {
        const user = await authService.profile(userId);
        if (!user) return res.status(404).json({ message: 'User profile not found' });
        res.status(200).json(user);
    } catch (error) {
        Logger.error(`Error fetching profile for user ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}