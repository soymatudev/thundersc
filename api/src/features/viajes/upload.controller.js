const asyncHandler = require('../../shared/utils/asyncHandler');

exports.uploadEvidencia = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ ok: false, msg: 'No se subió ningún archivo' });
    }

    // Construimos la URL pública (ajusta según tu dominio/puerto)
    // Ejemplo: http://192.168.1.50:3000/uploads/viaticos/evidencia-123.jpg
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/viaticos/${req.file.filename}`;

    res.status(201).json({
        ok: true,
        msg: 'Archivo subido correctamente',
        url: fileUrl,
        tipo: req.file.mimetype
    });
});