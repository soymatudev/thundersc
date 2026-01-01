const Logger = require('../utils/Logger');
const { Pool } = require('pg');
require('dotenv').config();

const authPool = new Pool({
    host: process.env.DB_HOST_PSQL_DEV ?? process.env.DB_HOST_PSQL_PROD,
    user: process.env.DB_USER_PSQL_DEV ?? process.env.DB_USER_PSQL_PROD,
    password: process.env.DB_PASS_PSQL_DEV ?? process.env.DB_PASS_PSQL_PROD,
    database: process.env.DB_NAME_THUNDER ?? process.env.DB_NAME_THUNDER,
    port: process.env.DB_PORT_PSQL_DEV ?? process.env.DB_PORT_PSQL_PROD,
    connectionLimit: 5
});

const mainPool = new Pool({
    host: process.env.DB_HOST_PSQL_DEV ?? process.env.DB_HOST_PSQL_PROD,
    user: process.env.DB_USER_PSQL_DEV ?? process.env.DB_USER_PSQL_PROD,
    password: process.env.DB_PASS_PSQL_DEV ?? process.env.DB_PASS_PSQL_PROD,
    database: process.env.DB_NAME_PCZMEX ?? process.env.DB_NAME_PCZMEX,
    port: process.env.DB_PORT_PSQL_DEV ?? process.env.DB_PORT_PSQL_PROD,
    connectionLimit: 5
});

const otherPool = new Pool({
    host: process.env.DB_HOST_MYSQL_PROD ?? process.env.DB_HOST_MYSQL_PROD,
    user: process.env.DB_USER_MYSQL_PROD ?? process.env.DB_USER_MYSQL_PROD,
    password: process.env.DB_PASS_MYSQL_PROD ?? process.env.DB_PASS_MYSQL_PROD,
    database: process.env.DB_NAME_MYSQL_PCZMEX ?? process.env.DB_NAME_MYSQL_PCZMEX,
    port: process.env.DB_PORT_MYSQL_PROD ?? process.env.DB_PORT_MYSQL_PROD,
    connectionLimit: 5
});

/**
* @param {string} poolName - 'auth' or 'main'
* @returns {Promise<object>} - Object Pool 
*/

function getConnection (poolName) {
    try {
        const pool = selectPool(poolName)
        const dbName = poolName === 'main' 
            ? process.env.DB_NAME_PCZMEX ?? process.env.DB_NAME_PCZMEX
            : process.env.DB_NAME_PCZMEX  ?? process.env.DB_NAME_PCZMEX ;

        Logger.info(`Try connection to database: ${dbName}`);
        return pool;
    } catch (error) {
        Logger.error(`Database connection error: ${error.message}`);
        throw new Error(`Database connection failed ${poolName}`);
    }
}

function selectPool(poolName) {
    let pool;
    if (poolName === 'auth') {
        pool = authPool;
    } else if (poolName === 'main') {
        pool = mainPool;
    } else if (poolName === 'other') {
        pool = otherPool;
    } else {
        throw new Error(`Unknown pool name: ${poolName}`);
    }
    return pool;
}

function closePools() {
    authPool.end()
    .then(() => Logger.info('Auth DB pool has ended'))
    .catch(err => Logger.error(`Error ending Auth DB pool: ${err.message}`));

    mainPool.end()
    .then(() => Logger.info('Main DB pool has ended'))
    .catch(err => Logger.error(`Error ending Main DB pool: ${err.message}`));

    otherPool.end()
    .then(() => Logger.info('Other DB pool has ended'))
    .catch(err => Logger.error(`Error ending Other DB pool: ${err.message}`));
}

function testConnection() {
    authPool.query('SELECT 1 + 1 AS result')
    .then(() => Logger.info('AuthPool DB connection test successful'))
    .catch(err => Logger.error(`authPool DB connection test failed: ${err.message}`));

    mainPool.query('SELECT 1 + 1 AS result')
    .then(() => Logger.info('Main DB connection test successful'))
    .catch(err => Logger.error(`Main DB connection test failed: ${err.message}`));

    return authPool && mainPool;
}

module.exports = { getConnection, closePools, testConnection };