const Logger = require('../../shared/utils/Logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../shared/config/prismaClient');
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

        Logger.info(`User found: ${JSON.stringify(user)}`);
        const passwordMatch = await bcrypt.compare(password, user.hash_password);
        if (!passwordMatch) {
            Logger.info(`Authentication failed for user: ${username}`);
            return null;
        }

        user.hash_password = undefined;
        const token = generateToken(user);
        user.token = token;
        Logger.info(`User authenticated: ${username}`);
        return user;
    } catch (error) {
        Logger.error(`Error during authentication for user ${username}: ${error.message}`);
        throw new Error('Authentication failed due to server error');
    }
}

exports.profile = async (clave) => {
    try {
        const userProfile = await prisma.$queryRaw`SELECT 
        a.clave, a.descri, a.username, STRING_AGG(CAST(b.clave as TEXT), ',') as cve_permi, STRING_AGG(b.descri, ',') as permiso, 
        d.clave as cve_modulo, d.descri as modulo, d.ruta, d.menu, c.cve_empresa
        FROM usuario a, permiso b, usuario_permiso c, ma_modulo d
        WHERE a.clave = ${parseInt(clave)}
        and a.clave = c.cve_usuario
        and b.clave = c.cve_permiso
        and b.cve_modulo = d.clave
        group by a.clave, d.clave, c.cve_empresa
        order by d.descri`;

        if (!userProfile) {
            Logger.info(`Profile not found for user ID: ${clave}`);
            return null;
        }

        Logger.info(`Profile retrieved for user ID: ${clave}`);
        return userProfile;
    } catch (error) {
        Logger.error(`Error fetching profile for user ID ${clave}: ${error.message}`);
        throw new Error('Failed to fetch profile due to server error');
    }
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

exports.updateUsuario = async (cve, updateData, usuarioPermisosData) => {
    try {
        const updatedUser = await updateUsuarioData(cve, updateData);
        if (!updatedUser) {
            Logger.info(`User not found for update: ${cve}`);
            return null;
        }
        Logger.info(`User data updated: ${cve}`);

        if (usuarioPermisosData && usuarioPermisosData.length > 0) {
            usuarioPermisosData.forEach(up => up.cve_usuario = parseInt(cve));
            const updatedPermisos = await updateUsuarioPermiso(cve, usuarioPermisosData);
            if (!updatedPermisos) {
                Logger.info(`User permissions not found for update: ${cve}`);
                return null;
            }
            Logger.info(`User permissions updated: ${cve}`);
        }
        return updatedUser;
    } catch (error) {
        Logger.error(`Error updating user ${cve}: ${error.message}`);
        throw new Error('User update failed due to server error');
    }
}

exports.logout = async () => {
    try {
        // Future business logic for logout can go here (e.g., token invalidation).
        Logger.info(`User logout process initiated.`);
        return;
    } catch (error) {
        Logger.error(`Error during logout: ${error.message}`);
        throw new Error('Logout failed due to server error');
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
    try {
        const token = jwt.sign(
            { userId: user.id, userCve: user.clave, descri: user.descri, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return token;
    } catch (error) {
        Logger.error(`Error generating token for user ${user.username}: ${error.message}`);
        throw new Error('Token generation failed');
    }
}


const getPermisosByUserId = async (userId) => {
    const permisos = await prisma.usuario_permiso.findMany({
        where: { cve_usuario: userId }
    });
    return permisos;
}

const updateUsuarioData = async (cve, updateData) => {
    try {
        if(updateData.hash_password) {
            updateData.hash_password = await getPasswordHash(updateData.hash_password);
        }
        const result = await prisma.usuario.update({
            where: { clave: parseInt(cve) },
            data: updateData
        });
        return result;
    } catch (error) {
        if (error.code === 'P2025') {
            Logger.info(`User not found for update: ${cve}`);
            return null;
        }
        Logger.error(`Error updating user ${cve}: ${error.message}`);
        throw new Error('User update failed due to server error');
    }
}

const updateUsuarioPermiso = async (cve, usuarioPermisosData) => {
    try {
        await prisma.usuario_permiso.deleteMany({
            where: { cve_usuario: parseInt(cve) }
        });
        const newUsuarioPermisos = await prisma.usuario_permiso.createMany({
            data: usuarioPermisosData
        });
        return newUsuarioPermisos;
    } catch (error) {
        Logger.error(`Error updating permissions for user ${cve}: ${error.message}`);
        throw new Error('User permission update failed due to server error');
    }
}