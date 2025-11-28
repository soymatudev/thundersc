const Logger = require('../utils/Logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/prismaClient');
require('dotenv').config();

exports.login = async (username, password) => {
    try {
        const user = await prisma.usuario.findFirst({
            where: {
                username: username
            }
        });
        if (!user) {
            Logger.info(`Authentication failed for user: ${username}`);
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.hash_password);
        if (!passwordMatch) {
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

exports.profile = async (userId) => {
    try {
        const user = await prisma.usuario.findMany({
            where: { clave: userId }
        });
        if (!user) {
            Logger.info(`Profile not found for user ID: ${user.username}`);
            return null;
        }

        const permisos = await getPermisosByUserId(user.clave);
        user.permisos = permisos;
        Logger.info(`Profile retrieved for user ID: ${user.username}`);
        return user;
    } catch (error) {
        Logger.error(`Error fetching profile for user ID ${user.username}: ${error.message}`);
        throw new Error('Failed to fetch profile due to server error');
    }
}

const getPermisosByUserId = async (userId) => {
    const permisos = await prisma.usuario_permiso.findMany({
        where: { cve_usuario: userId }
    });
    return permisos;
}

exports.register = async (userData, usuarioPermisoData) => {
    try {
        userData.hash_password = await getPasswordHash(userData.hash_password);
        const newUser = await setUser(userData);
        Logger.info(`New user registered: ${JSON.stringify(newUser)}`); 

        usuarioPermisoData.forEach(up => up.cve_usuario = newUser.clave);
        await setusuarioPermiso(usuarioPermisoData);

        return newUser;
    } catch (error) {
        Logger.error(`Error during user registration for ${userData.username}: ${error.message}`);
        throw new Error('User registration failed due to server error');
    }
}

const getPasswordHash = async (plainPassword) => {
    const saltRounds = parseInt(process.env.HASH_ROUNDS);
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
}

const setUser = async (userData) => {
    const newUser = await prisma.usuario.create({
        data: userData
    });
    return newUser;
}

const setusuarioPermiso = async (usuarioPermisoData) => {
    const newUsuarioPermiso = await prisma.usuario_permiso.createMany({
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

exports.updateUsuario = async (cve, updateData) => {
    try {
        const usuario = await prisma.usuario.findFirst({
            where: { username: cve }
        });
        if (!usuario) {
            Logger.info(`User not found for update: ${cve}`);
            return null;
        }
        const result = await prisma.usuario.update({
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
        const usuario = await prisma.usuario.findFirst({
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