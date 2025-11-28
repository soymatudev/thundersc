const { testConnection } = require('../config/database');

exports.healthCheck = async (req, res) => {
    try {
        const connection = testConnection();
        if (connection) {
            res.status(200).json({ status: 'OK', message: 'Database connection successful' });
        } else {
            res.status(500).json({ status: 'Error', message: 'Database connection failed' });
        }
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
};

