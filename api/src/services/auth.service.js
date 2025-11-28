const Logger = require('../utils/Logger');
const bcrypt = require('bcrypt');
const { prisma } = require('../config/prismaClient');
require('dotenv').config();

exports.login = async (username, password) => {
    try {
        const user = await prisma.users.findFirst({
            where: {
                username: username,
                password: password
            }
        });
        if (!user) {
            Logger.info(`Authentication failed for user: ${username}`);
            return null;
        }
        const token = generateToken(user);
        user.token = token;
        Logger.info(`User authenticated: ${username}`);
        return user;
    } catch (error) {
        Logger.error(`Error during authentication for user ${username}: ${error.message}`);
        throw new Error('Authentication failed due to server error');
    }
}

const getPermisosByUserId = async (userId) => {
    const permisos = await prisma.usuario_permiso.findMany({
        where: { userId: userId }
    });
    return permisos;
}

exports.register = async (userData, usuarioPermisoData) => {
    try {
        userData.hash_password = await getPasswordHash(userData.password);
        const newUser = await setUser(userData);
        const newUsuarioPermiso = await setusuarioPermiso(usuarioPermisoData);
        Logger.info(`New user registered: ${userData.username}`);
        return newUser;
    } catch (error) {
        Logger.error(`Error during user registration for ${userData.username}: ${error.message}`);
        throw new Error('User registration failed due to server error');
    }
}

exports.updateUsuario = async (cve, updateData) => {
    try {
        const usuario = await prisma.users.findFirst({
            where: { username: cve }
        });
        if (!usuario) {
            Logger.info(`User not found for update: ${cve}`);
            return null;
        }
        const result = await prisma.users.update({
            where: { id: usuario.id },
            data: updateData
        });
        Logger.info(`User updated: ${cve}`);
        return result;
    } catch (error) {
        Logger.error(`Error updating user ${cve}: ${error.message}`);
        throw new Error('User update failed due to server error');
    }
}

exports.updateUsuarioPermiso = async (cve, updateData) => {
    try {
        const usuario = await prisma.users.findFirst({
            where: { username: cve }
        });
        if (!usuario) {
            Logger.info(`User not found for permission update: ${cve}`);
            return null;
        }
        const usuarioPermiso = await prisma.usuario_permiso.findFirst({
            where: { userId: usuario.id }
        });
        if (!usuarioPermiso) {
            Logger.info(`User permissions not found for update: ${cve}`);
            return null;
        }
        const result = await prisma.usuario_permiso.update({
            where: { id: usuarioPermiso.id },
            data: updateData
        });
        Logger.info(`User permissions updated: ${cve}`);
        return result;
    } catch (error) {
        Logger.error(`Error updating permissions for user ${cve}: ${error.message}`);
        throw new Error('User permission update failed due to server error');
    }
}

const getPasswordHash = async (plainPassword) => {
    const saltRounds = parseInt(process.env.HASH_ROUNDS);
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
}

const setUser = async (userData) => {
    const newUser = await prisma.users.create({
        data: userData
    });
    return newUser;
}

const setusuarioPermiso = async (usuarioPermisoData) => {
    const newUsuarioPermiso = await prisma.usuario_permiso.create({
        data: usuarioPermisoData
    });
    return newUsuarioPermiso;
}

const generateToken = (user) => {
    const token = jwt.sign(
        { userId: user.id, descri: user.descri, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
}