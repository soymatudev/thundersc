const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const pathStorage = path.join(__dirname, '../../../public/uploads/viajes');
        // Creamos la carpeta si no existe
        if (!fs.existsSync(pathStorage)) {
            fs.mkdirSync(pathStorage, { recursive: true });
        }
        cb(null, pathStorage);
    },
    filename: (req, file, cb) => {
        // Ejemplo: ticket-1707050000-832.jpg
        const ext = file.originalname.split('.').pop();
        const fileName = `evidencia-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
        cb(null, fileName);
    }
});

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;