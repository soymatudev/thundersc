<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/API_bot/BotService.php
===============================================================================*/

require_once(__DIR__ . '/../System/Connection/Connection.php');
require_once(__DIR__ . '/../ReturnEvent/ReturnEvent.php');
require_once(__DIR__ . '/../System/Connection/Statement.php');
require_once(__DIR__ . '/../ThunderLog/ThunderLog.php');
require_once(__DIR__ . '/../vendor/autoload.php');

class Bot_Sensor
{
    private $token = null;
    private $TELEGRAM_API = null;
    //private $chatId = null;
    //private $text = null;
    private $thunderlog = null;
    private $conn = null;
    //private $type_chat = null;

    function __construct($token)
    {
        $this->token = $token;
        $this->TELEGRAM_API = "https://api.telegram.org/bot".$token."/sendMessage";
        $this->thunderlog = new Log(null, "API_BOT");
        $this->conn = null;
    }

    function bot_response($type_chat, $text)
    {
        $chatIds = $this->getChatids($type_chat);
        foreach($chatIds as $chat) {
            $data = [
                'chat_id' => $chat,
                'text' => "🤖 Thundersc: \"{$text}\""
            ];
    
            $options = [
                'http' => [
                    'header'  => "Content-Type: application/json\r\n",
                    'method'  => 'POST',
                    'content' => json_encode($data),
                ],
            ];
            
            $this->thunderlog->writeLog("Enviando mensaje a Telegram: " . json_encode($data));
            $context  = stream_context_create($options);
            $response = file_get_contents($this->TELEGRAM_API, false, $context);
        }
        
        // Responder al cliente
        //header('Content-Type: application/json');
        //ReturnEvent::returnResponse(0, "Mensaje enviado correctamente", json_decode($response, true));
        ReturnEvent::returnResponse(0, "Mensaje enviado correctamente", ["Todo bien" => "Simon"]);
    }

    function bot_message($chat_id, $text, $usuario, $type_chat = 'GEN') {
            $chat_exists = $this->setChatId($chat_id, $usuario, $type_chat);
            if (!$chat_exists) {
                $text = "No se pudo registrar el chatId en la base de datos";
                //ReturnEvent::returnResponse(1, "Error al registrar chatId", "No se pudo registrar el chatId en la base de datos");
            }

            $data = [
                'chat_id' => $chat_id,
                'text' => "🤖 Thundersc: \"{$text}\""
            ];
    
            $options = [
                'http' => [
                    'header'  => "Content-Type: application/json\r\n",
                    'method'  => 'POST',
                    'content' => json_encode($data),
                ],
            ];
            
            $this->thunderlog->writeLog("Enviando mensaje a Telegram: " . json_encode($data));
            $context  = stream_context_create($options);
            $response = file_get_contents($this->TELEGRAM_API, false, $context);
    
        ReturnEvent::returnResponse(0, "Mensaje enviado correctamente", ["Todo bien" => "Simon"]);
    }

    function setChatId($chatid, $usuario = 'Usuario', $type_chat = 'GEN') {
        try {
            $this->conn = (new Connection(null, ['PCZMEX']))->connect();
            if (!$this->conn) {
            $this->thunderlog->writeLog("Error de conexión" . $this->conn);
            return null;
            }

            $query = "SELECT clave, nombre FROM ma_chatids WHERE clave = :chatId and bot = 'N'";
            $stmt = new Statement($this->conn, (null));
            $res = $stmt->prepareStatement($query);
            $res->bindParam(':chatId', $chatid, PDO::PARAM_STR);
            $result = $stmt->executePreparedQuery($res);
            $this->thunderlog->writeLog("Query => " . $query);

            if (count($result) > 0) {
                return true;
            } else {
                $insertQuery = "INSERT INTO ma_chatids (clave, nombre, tipo, bot) VALUES (:chatId, :usuario, :type_chat, 'N')";
                $stmt = new Statement($this->conn, (null));
                $res = $stmt->prepareStatement($insertQuery);
                $res->bindParam(':chatId', $chatid, PDO::PARAM_STR);
                $res->bindParam(':usuario', $usuario, PDO::PARAM_STR);
                $res->bindParam(':type_chat', $type_chat, PDO::PARAM_STR);
                $insertResult = $stmt->executePreparedQuery($res);

                if ($insertResult) {
                    return true;
                } else {
                    $this->thunderlog->writeLog("Error al insertar chatId: " . implode(" | ", $insertResult->errorInfo()));
                    return false;
                }
            }
        } catch(Exception $e) {
            $this->thunderlog->writeLog("Error al establecer chatId: " . $e->getMessage());
            return false;
        }
    }

    function getChatids($type_chat) {
        try {
            $this->conn = (new Connection(null, ['PCZMEX']))->connect();
            if (!$this->conn) {
            $this->thunderlog->writeLog("Error de conexión" . $this->conn);
            return null;
            }

            $query = "SELECT clave, nombre FROM ma_chatids WHERE bot = 'N' and tipo = '{$type_chat}'";
            $stmt = new Statement($this->conn, (null));
            $res = $stmt->prepareStatement($query);
            $result = $stmt->executePreparedQuery($res);
            $this->thunderlog->writeLog("Query => " . $query);

            return $result;
        } catch(Exception $e) {
            $this->thunderlog->writeLog("Error al obtener chatIds: " . $e->getMessage());
            return [];
        }
    }
}
