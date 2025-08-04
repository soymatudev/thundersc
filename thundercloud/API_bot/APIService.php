<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/API_bot/BotService.php
===============================================================================*/

require_once(__DIR__ . '/../System/Connection/Connection.php');
require_once(__DIR__ . '/../Config/Config.php');
require_once(__DIR__ . '/../ReturnEvent/ReturnEvent.php');
require_once(__DIR__ . '/../System/Connection/Statement.php');
require_once(__DIR__ . '/../ThunderLog/ThunderLog.php');
require_once(__DIR__ . '/../vendor/autoload.php');
require_once(__DIR__ . '/Bot.php');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../../');
$dotenv->load();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    header('Content-Type: application/json');
    ReturnEvent::returnResponse(1, "Método no permitido", "Solo se permiten solicitudes POST");
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

// Validar que venga algo válido de Telegram
$chatId = $body['message']['chat']['id'] ?? null;
$text = $body['message']['text'] ?? null;

if (!$chatId || !$text) {
    // Silenciosamente ignorar
    header('Content-Type: application/json');
    ReturnEvent::returnResponse(1, "Datos incompletos", "El mensaje no contiene chatId o texto");
    exit;
}

// Configuración del bot de Telegram 
// Logica para escoger el token del bot
$BOT_TOKEN = $_ENV['TELEGRAM_BOT_TOKEN'] ?? null;

// Crear instancia del bot
$bot = new Bot($BOT_TOKEN, $chatId, $text);
// Enviar respuesta
$bot->bot_response();
