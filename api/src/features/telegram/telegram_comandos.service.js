const Logger = require('../../shared/utils/Logger');
const { setTelegramUsuario, setTelegramUsuarioxSensor } = require('./telegram_usuarios.service');
const { getAllSensores, getSensorByCve } = require('../sensores/sensores.service');

exports.routerTelegramComandos = (bot) => {
    this.comandoCallback(bot);
    this.comandoStart(bot);
    this.comandoSetSensor(bot);
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
        cve_usu: char_id,
        cve_ses: sensorCve,
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
            text: `${sensor.alias} (${sensor.unidad})`,
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

exports.comandoCallback = (bot) => {
    try {
        bot.on('callback_query', async (callbackQuery) => {
            Logger.info(`Callback query received: ${JSON.stringify(callbackQuery)}`);
            const msg = callbackQuery.message;
            const data = callbackQuery.data;
    
            if (data.startsWith('setsensor_')) {
                callBacksetsensor(bot, data, msg);
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
        bot.sendMessage(msg.chat.id, `✅ Te has suscrito correctamente a las alertas del sensor: ${sensor[0].alias}.`);
        Logger.info(`Usuario ${msg.chat.id} suscrito al sensor ${sensor[0].alias}`);
    } catch (error) {
        bot.sendMessage(msg.chat.id, `❌ Ocurrió un error al suscribirte al sensor. Por favor, intenta de nuevo más tarde.`);
        Logger.error(`Error al procesar callback de setsensor: ${error.message}`);
    }
}