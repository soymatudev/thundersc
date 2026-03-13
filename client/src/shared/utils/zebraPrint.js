/**
 * Shared utility for communicating with Zebra Browser Print
 */

/**
 * Formats data into a ZPL string for a barcode label
 * @param {string} code - The barcode value
 * @returns {string} ZPL string
 */
export const formatZPL = (code) => {
    // Configuración para una etiqueta de aproximadamente 50x25mm (2x1")
    return `^XA
^CI28
^MD15
^FO250,30^BY2
^BCN,60,Y,N,N
^FD${code}^FS
^FO50,110^A0N,25,25
^FD${code}^FS
^XZ`;
};

/**
 * Shortens a code for the label (e.g. ACC-20260312-006 -> ACC260312006)
 * @param {string} code - The original code 
 * @returns {string} The shortened code
 */
export const shortenCode = (code) => {
    if (!code) return '';
    const parts = code.split('-');
    if (parts.length === 3) {
        const prefix = parts[0];
        const datePart = parts[1].slice(2, 8); // YYMMDD (removes 20 from 2026)
        const folioPart = parts[2]; // Consecutive
        return `${prefix}${datePart}${folioPart}`;
    }
    return code;
};

/**
 * Sends ZPL data to the local Zebra Browser Print service

 * @param {string} zpl - The ZPL string to print
 * @param {Function} onError - Callback for error handling
 * @returns {Promise<void>}
 */
export const sendToZebra = async (zpl, onError) => {
    try {
        const isHttps = window.location.protocol === 'https:';
        const protocol = isHttps ? 'https:' : 'http:';
        const port = isHttps ? '9100' : '9101';
        const baseUrl = `https://localhost:${port}/`;

        console.log(`Conectando a Zebra en: ${baseUrl}`);

        // 1. Obtener impresora por defecto
        const defaultPrinterResponse = await fetch(`${baseUrl}default`, { 
            method: 'GET',
            mode: 'cors' 
        }).catch(err => {
            throw new Error(`Conexión fallida. Si usas HTTPS, entra primero a https://localhost:${port} y acepta el certificado.`);
        });

        if (!defaultPrinterResponse.ok) throw new Error('Error al obtener impresora por defecto');
        
        const rawResponse = await defaultPrinterResponse.text();
        if (!rawResponse || rawResponse.includes("No printer found")) {
            throw new Error('No se encontró una impresora Zebra configurada');
        }

        // Parser para formato "Key: Value" multilínea
        let printerDevice = {
            name: '',
            deviceType: 'printer',
            connection: 'usb',
            uid: '',
            version: 0,
            provider: '',
            manufacturer: 'Zebra Technologies'
        };

        const lines = rawResponse.split('\n');
        lines.forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim().toLowerCase();
                const value = parts.slice(1).join(':').trim();
                
                if (key === 'name') printerDevice.name = value;
                if (key === 'id' || key === 'uid') printerDevice.uid = value;
                if (key === 'provider') printerDevice.provider = value;
                if (key === 'manufacturer') printerDevice.manufacturer = value;
                if (key === 'type') printerDevice.deviceType = value;
                if (key === 'connection') printerDevice.connection = value;
            }
        });

        // Fallback
        if (!printerDevice.name) {
            printerDevice.name = rawResponse.trim();
            printerDevice.uid = rawResponse.trim();
            printerDevice.provider = 'com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider';
        }

        // 2. Enviar ZPL a la impresora
        const printPayload = {
            device: printerDevice,
            data: zpl
        };

        const response = await fetch(`${baseUrl}write`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(printPayload),
            mode: 'cors'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Respuesta Zebra: ${errorText}`);
        }

        console.log(`Label enviado exitosamente a ${printerDevice.name}`);
    } catch (error) {
        console.error('Error en Zebra Print:', error);
        if (onError) onError(error.message);
        throw error;
    }
};
