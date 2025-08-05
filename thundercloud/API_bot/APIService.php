<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/API_bot/BotService.php
===============================================================================*/

date_default_timezone_set('America/Mexico_City');
require_once(__DIR__ . '/../System/Connection/Connection.php');
require_once(__DIR__ . '/../ReturnEvent/ReturnEvent.php');
require_once(__DIR__ . '/../System/Connection/Statement.php');
require_once(__DIR__ . '/../ThunderLog/Log/thunderlog.log');
require_once(__DIR__ . '/../vendor/autoload.php');
require_once(__DIR__ . '/BotService.php');

class API_BOT {
    private $thunderlog = null;

    function __construct()
    {
        $this->thunderlog = new Log(null, "API_BOT");
    }

    function API ($uu, $cc, $body = null) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../');
        $dotenv->load();
        $BOT_TOKEN = $_ENV['TELEGRAM_BOT_TOKEN'] ?: ''; // Logica para escoger el token del bot
        
        try {
            
        
            if ($_SERVER["REQUEST_METHOD"] !== "POST") {
                http_response_code(405);
                header('Content-Type: application/json');
                ReturnEvent::returnResponse(1, "Método no permitido", "Solo se permiten solicitudes POST");
                exit;
            }
        
            $chatId = $body['message']['chat']['id'] ?? null;
            $text = $body['message']['text'] ?? null;
        
            if (!$chatId || !$text) {
                // Silenciosamente ignorar
                header('Content-Type: application/json');
                $this->thunderlog->writeLog("Datos incompletos: chatId o text no proporcionados");
                ReturnEvent::returnResponse(1, "Datos incompletos", "El mensaje no contiene chatId o texto");
                exit;
            }

            $this->thunderlog->writeLog("Recibido mensaje de Telegram: chatId={$chatId}, text={$text}");

            // Crear instancia del bot
            $bot = new Bot($BOT_TOKEN, $chatId, $text);

            $response = $bot->bot_response();
            ReturnEvent::returnResponse(0, "Mensaje enviado correctamente", ["Todo bien" => "Simon"]);
        } catch (Exception $e) {
            http_response_code(500);
            $this->thunderlog->writeLog("Error al procesar la solicitud: " . $e->getMessage());
            header('Content-Type: application/json');
            ReturnEvent::returnResponse(1, "Error del servidor", $e->getMessage());
        }
    }
}

function main()
{
    // Leer el cuerpo de la solicitud HTTP
    $contenido = file_get_contents("php://input");
    $data = json_decode($contenido, true);
    $componenteService = new API_BOT();
    $func = $data['function'];
    $componenteService->$func($data['uu'], $data['cc'], $data['args']);
}

main();