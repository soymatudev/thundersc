const Logger = require('../../shared/utils/Logger');
const jwt = require('jsonwebtoken');
const authService = require('./auth.service');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        Logger.error(`Error retrieving all users: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllUsersWithPermissions = async (req, res) => {
    try {
        const users = await authService.getAllUsersWithPermissions();
        res.status(200).json(users);
    } catch (error) {
        Logger.error(`Error retrieving users with permissions: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getUserById = async (req, res) => {
    const { cve } = req.params;
    try {
        const user = await authService.getUserById(cve);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        Logger.error(`Error retrieving user with ID ${cve}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authService.login(username, password);
        if (!user) return res.status(401).json({ message: 'Invalid username or password' });
        req.user = user;
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

exports.profile = async (req, res, next) => {
    try {
        // The user's basic info (including 'clave') is attached by the authMiddleware.
        // We use this clave to get the full, aggregated profile from the service.
        const userProfile = await authService.profile(req.user.clave);
        
        if (!userProfile || userProfile.length === 0) {
            return res.status(404).json({ message: 'User profile data not found' });
        }
        
        res.status(200).json(userProfile);
    } catch (error) {
        // Pass any errors to the global error handler
        next(error);
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
        await authService.logout();
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

exports.getUsuariosPaginados = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 12, descri } = req.query;
        const pageInt = parseInt(page, 10);
        const pageSizeInt = parseInt(pageSize, 10);

        const result = await authService.getPaginated(pageInt, pageSizeInt, descri);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
