const Logger = require('../../shared/utils/Logger');
const { setTelegramUsuario, setTelegramUsuarioxSensor } = require('./telegram_usuarios.service');
const { getAllSensores, getSensorByCve, getUltimoValorById, removeSubSensor } = require('../sensores/sensores.service');

exports.routerTelegramComandos = (bot) => {
    this.comandoCallback(bot);
    this.comandoStart(bot);
    this.comandoSetSensor(bot);
    this.comandoRemoveSensor(bot);
    this.comandoGetUltimoValor(bot);
}

const parsedDataUsuario = (data) => {
    return {
        clave: data.chat.id,
        nombre: data.from.first_name,
        bot: 'N',
        tipo: 'SITE'
    };
}

const parsedDataUsuarioxSensor = (char_id, sensorCve) => {
    return {
        cve_usu: char_id.toString(),
        cve_ses: parseInt(sensorCve),
        cns_sn: 'S',
        alt_sn: 'N',
        baj_sn: 'N',
        cam_sn: 'N'
    };
}

exports.comandoStart = (bot) => {
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, `🤖 ¡Hola! Tu Chat ID es ${msg.chat.id}. Usaré este ID para registrar tus suscripciones a las alertas de sensores.`);
        setTelegramUsuario(parsedDataUsuario(msg)).then(() => {
            Logger.info(`Usuario de Telegram registrado: ${msg.chat.id} - ${msg.from.first_name}`);
            bot.sendMessage(msg.chat.id, `🤖 \n ✅ Registro correcto. Ahora puedes usar el comando /setsensor para suscribirte a las alertas de sensores.`);
        }).catch((error) => {
            bot.sendMessage(msg.chat.id, `❌ Ocurrió un error al registrarte. Por favor, intenta de nuevo más tarde.`);
            Logger.error(`Error al registrar usuario de Telegram: ${error.message}`);
        });
    });
}

exports.comandoSetSensor = (bot) => {
    bot.onText(/\/setsensor/, async (msg) => {
        let sensores = await getAllSensores();
        const inline_keyboard = sensores.map(sensor => ([{
            text: `${sensor.alias} (${sensor.unidad_desc})`,
            callback_data: `setsensor_${sensor.clave}`
        }]))
        const options = {
            reply_markup: {
                inline_keyboard: inline_keyboard
            }
        }
        bot.sendMessage(msg.chat.id, "Seleccione el sensor al que se desea registrar:", options);
    });
}

exports.comandoRemoveSensor = (bot) => {
    bot.onText(/\/removesensor/, async (msg) => {
        let sensores = await getAllSensores();
        const inline_keyboard = sensores.map(sensor => ([{
            text: `${sensor.alias} (${sensor.unidad_desc})`,
            callback_data: `removesensor_${sensor.clave}`
        }]))
        const options = {
            reply_markup: {
                inline_keyboard: inline_keyboard
            }
        }
        bot.sendMessage(msg.chat.id, "Seleccione el sensor del que desea darse de baja:", options);
    });
}

exports.comandoGetUltimoValor = (bot) => {
    bot.onText(/\/getultimovalor/, async (msg) => {
        let sensores = await getAllSensores();
        const inline_keyboard = sensores.map(sensor => ([{
            text: `${sensor.alias} (${sensor.unidad_desc})`,
            callback_data: `getultimovalor_${sensor.clave}`
        }]))
        const options = {
            reply_markup: {
                inline_keyboard: inline_keyboard
            }
        }
        bot.sendMessage(msg.chat.id, "Seleccione el sensor del que desea la ultima Informacion ", options);
    });
}

exports.comandoCallback = (bot) => {
    try {
        bot.on('callback_query', async (callbackQuery) => {
            Logger.info(`Callback query received: ${JSON.stringify(callbackQuery)}`);
            const msg = callbackQuery.message;
            const data = callbackQuery.data;
    
            if (data.startsWith('setsensor_')) {
                callBacksetsensor(bot, data, msg);
            } else if (data.startsWith('removesensor_')) {
                callBackremovesensor(bot, data, msg);
            } else if (data.startsWith('getultimovalor_')) {
                callBackGetUltimoValor(bot, data, msg);
            } else {
                Logger.warn(`Callback query con data desconocida: ${data}`);
            }
        });
    } catch (error) {
        Logger.error(`Error al procesar comandos de callback: ${error.message}`);
    }
}

const callBacksetsensor = async (bot, data, msg) => {
    try {
        const sensorCve = data.split('_')[1];
        const sensor = await getSensorByCve(sensorCve);

        if (sensor.length === 0) {
            bot.sendMessage(msg.chat.id, `❌ Sensor no encontrado.`);
            return;
        }
        const newUsuario = await setTelegramUsuarioxSensor(parsedDataUsuarioxSensor(msg.chat.id, sensorCve));
        bot.sendMessage(msg.chat.id, `✅ Te has suscrito correctamente a las alertas del sensor: ${sensor.alias}.`);
        Logger.info(`Usuario ${msg.chat.id} suscrito al sensor ${sensor.alias}`);
    } catch (error) {
        Logger.error(`Error al procesar callback de setsensor: ${error.message} - Data: ${sensor}`);
        bot.sendMessage(msg.chat.id, `❌ Ocurrió un error al suscribirte al sensor. Por favor, intenta de nuevo más tarde.`);
    }
}

const callBackremovesensor = async (bot, data, msg) => {
    try {
        const sensorCve = data.split('_')[1];
        const sensor = await getSensorByCve(sensorCve);

        if (sensor.length === 0) {
            bot.sendMessage(msg.chat.id, `❌ Sensor no encontrado.`);
            return;
        }
        await removeSubSensor(msg.chat.id, sensorCve);
        bot.sendMessage(msg.chat.id, `✅ Te has dado de baja correctamente de las alertas del sensor: ${sensor.alias}.`);
        Logger.info(`Usuario ${msg.chat.id} dado de baja del sensor ${sensor.alias}`);
    } catch (error) {
        bot.sendMessage(msg.chat.id, `❌ Ocurrió un error al darte de baja del sensor. Por favor, intenta de nuevo más tarde.`);
        Logger.error(`Error al procesar callback de removesensor: ${error.message} - Data: ${sensor}`);
    }
}

const callBackGetUltimoValor = async (bot, data, msg) => {
    try {
        const sensorCve = data.split('_')[1];
        const sensor = await getSensorByCve(sensorCve);

        if (sensor.length === 0) {
            bot.sendMessage(msg.chat.id, `❌ Sensor no encontrado.`);
            return;
        }
        const ultimoValor = await getUltimoValorById(sensorCve); 
        bot.sendMessage(msg.chat.id, `📊 Último valor registrado de ${sensor.alias} es: ${ultimoValor.dato_1} para el dia ${ultimoValor.fecha_hora}.`);
        Logger.info(`Usuario ${msg.chat.id} solicitó el último valor del sensor ${sensor.alias}`);
    } catch (error) {
        bot.sendMessage(msg.chat.id, `❌ Ocurrió un error al obtener el último valor del sensor. Por favor, intenta de nuevo más tarde.`);
        Logger.error(`Error al procesar callback de getultimovalor: ${error.message} - Data: ${sensor}`);
    }
}