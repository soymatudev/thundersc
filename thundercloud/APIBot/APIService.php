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
require_once(__DIR__ . '/../ThunderLog/ThunderLog.php');
require_once(__DIR__ . '/../vendor/autoload.php');
require_once(__DIR__ . '/BotSensoresService.php');

class API_BOT {

    private $thunderlog = null;

    public function __construct()
    {
        $this->thunderlog = new Log(null, "API_BOT");
    }

    public function API ($uu, $cc, $body = null) {
        try {
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../');
            $dotenv->load();
            $BOT_TOKEN = $_ENV['TELEGRAM_BOT_TOKEN'] ?: ''; // Logica para escoger el token del bot
        
            if ($_SERVER["REQUEST_METHOD"] !== "POST") {
                http_response_code(405);
                header('Content-Type: application/json');
                ReturnEvent::returnResponse(1, "Método no permitido", "Solo se permiten solicitudes POST");
                exit;
            }

            $data = []; $type = '';
            if(isset($body['callback_query'])) {
                $data = $this->getDataCallback($body);
                $type = 'callback';
            }
            else if (isset($body['message'])) {
                $data = $this->getDataMessage($body);
                $type = 'message';
            }
        
            if (!$data['chatId'] || (isset($data['text']) && isset($data['texdatat']) )) {
                // Silenciosamente ignorar
                header('Content-Type: application/json');
                $this->thunderlog->writeLog("Datos incompletos: chatId o text no proporcionados");
                ReturnEvent::returnResponse(1, "Datos incompletos", "El mensaje no contiene chatId o texto");
                exit;
            }

            $this->thunderlog->writeLog("Recibido mensaje de Telegram: chatId={$data['chatId']}, text=".($data['text'] ?? $data['data']));

            // Crear instancia del bot
            $bot = new Bot_Sensor($BOT_TOKEN);
            $response = $bot->bot_message($data, $type, 'SITE');
            ReturnEvent::returnResponse(0, "Mensaje enviado correctamente", ["Todo bien" => "Simon"]);
        } catch (Exception $e) {
            http_response_code(500);
            $this->thunderlog->writeLog("Error al procesar la solicitud: " . $e->getMessage());
            header('Content-Type: application/json');
            ReturnEvent::returnResponse(1, "Error del servidor", $e->getMessage());
        }
    }

    function getDataMessage($body) {
        return [
            'chatId' => $body['message']['chat']['id'] ?? null,
            'text' => $body['message']['text'] ?? null,
            'usuario' => $body['message']['from']['first_name'] ?? 'Desconocido'
        ];
    }

    function getDataCallback($body) {
        return [
            'chatId' => $body['callback_query']['message']['chat']['id'] ?? $body['callback_query']['from']['id'] ?? null,
            'data' => $body['callback_query']['data'] ?? null,
            'usuario' => $body['callback_query']['from']['first_name'] ?? 'Desconocido',
            'callbackData' => $body['callback_query']['data'] ?? null,
            'callbackQueryId' => $body['callback_query']['id'] ?? null,
            'messageId' => $body['callback_query']['message']['message_id'] ?? null
        ];
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