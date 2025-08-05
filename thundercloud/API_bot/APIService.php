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

class API_BOT {
    private $thunderlog = null;

    function __construct()
    {
        $this->thunderlog = new Log(null, "API_BOT");
    }

    function API ($uu, $cc, $body = null) {
        try {
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../../');
            $dotenv->load();
        
            if ($_SERVER["REQUEST_METHOD"] !== "POST") {
                http_response_code(405);
                header('Content-Type: application/json');
                ReturnEvent::returnResponse(1, "Método no permitido", "Solo se permiten solicitudes POST");
                exit;
            }
        
            //$body = json_decode(file_get_contents('php://input'), true);
            $this->thunderlog->writeLog("Body " . $body);
            echo "Body: " . json_decode($body) . "\n";
        
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
        } catch (Exception $e) {
            // Manejo de errores
            http_response_code(500);
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