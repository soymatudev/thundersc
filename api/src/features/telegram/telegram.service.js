const TelegramBot = require('node-telegram-bot-api');
const Logger = require('../../shared/utils/Logger');
require('dotenv').config();

const token = process.env.TELEGRAM_MatuExpress_TOKEN;
//const notificacionesService = require('./notificaciones.service');
const { getChatIdsPorSensor } = require('./telegram_usuarios.service');
const { routerTelegramComandos } = require('./telegram_comandos.service');

let bot;

const polling_error = (bot) => {
    bot.on('polling_error', (error) => {
        Logger.error(`Error de polling en Telegram: ${error.code} - ${error.message}`);
    });
}

const dummyFunction = () => {
    return {
        sendMessage: () => Promise.resolve(),
        onText: () => {},
    };
}

exports.initializeTelegramBot = () => {
    try {
        if (!token) {
            throw new Error('El token de Telegram no está definido en las variables de entorno (TELEGRAM_MatuExpress_TOKEN).');
        }
        bot = new TelegramBot(token, { polling: true, agentOptions: { family: 4, keepAlive: true } });
        Logger.info('Servicio de Telegram iniciado y escuchando...');
    
        routerTelegramComandos(bot);
        polling_error(bot);
    
    } catch (error) {
        Logger.error(`No se pudo iniciar el bot de Telegram. Error: ${error.message}`);
        bot = dummyFunction();
    }
}

/**
 * Envía un mensaje de alerta a todos los usuarios suscritos a un sensor.
 * @param {array} infoSensor - El nombre del sensor que genera la alerta.
 * @param {string} mensaje - El texto de la alerta a enviar.
 */
exports.enviarAlerta = async (infoSensor, mensaje) => {
    try {
        Logger.info(`Preparando para enviar alerta para el sensor: ${infoSensor.alias}`);
        const chatIds = await getChatIdsPorSensor(infoSensor);

        await nonSuscribedUserMessage(chatIds);
        Logger.info(`Enviando alerta para ${infoSensor.alias} a los siguientes chats: ${chatIds.join(', ')}`);

        const sendPromises = getPromises(chatIds, mensaje);
        await Promise.all(sendPromises);
    } catch (error) {
        Logger.error(`Error en el proceso de enviar alertas para ${infoSensor.alias}: ${error.message}`);
    }
};

const getPromises = (chatIds, mensaje) => {
    return chatIds.map(chatId => 
        bot.sendMessage(chatId, mensaje).catch(err => 
            Logger.error(`Error al enviar mensaje al chat_id ${chatId}: ${err.message}`)
        )
    );
}

const nonSuscribedUserMessage = async (chatIds) => {
    if (chatIds.length === 0) {
        Logger.warn(`No hay suscriptores para el sensor ${infoSensor.alias}. No se enviaron alertas.`);
        return;
    }
}