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
    try {
        const userData = req.cookies['access_token'];
        const userDataDecoded = jwt.verify(userData, process.env.JWT_SECRET);
        const userProfile = await authService.profile(userDataDecoded.userCve);
        if (!userProfile) return res.status(404).json({ message: 'User profile not found' });
        res.status(200).json(userProfile);
    } catch (error) {
        Logger.error(`Error fetching profile for user: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.logout = async (req, res) => {
    try {
        await authService.logout(req, res);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        Logger.error(`Error during logout: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateUsuario = async (req, res) => {
    const { cve } = req.params;
    const {userData, usuarioPermisoData} = req.body;
    try {
        const updatedUser = await authService.updateUsuario(cve, userData, usuarioPermisoData);
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        Logger.error(`Error updating user ${cve}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}