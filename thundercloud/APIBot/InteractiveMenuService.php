<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 03/11/2025
ruta: thundersc/thundercloud/API_bot/InteractiveMenuService.php
===============================================================================*/

require_once(__DIR__ . '/../System/Connection/Connection.php');
require_once(__DIR__ . '/../ReturnEvent/ReturnEvent.php');
require_once(__DIR__ . '/../System/Connection/Statement.php');
require_once(__DIR__ . '/../ThunderLog/ThunderLog.php');
require_once(__DIR__ . '/../vendor/autoload.php');

class InteractiveMenuService
{
    private $TELEGRAM_API = null;
    private $thunderlog = null;
    private $conn = null;

    function __construct()
    {
        $this->thunderlog = new Log(null, "API_BOT");
    }

    function getSensores() {
        try {
            $this->conn = (new Connection(null, 'PCZMEX'))->connect();
            if (!$this->conn) {
            $this->thunderlog->writeLog("Error de conexión" . $this->conn);
            return null;
            }

            $query = "SELECT a.clave, a.alias, b.descri 
            FROM ma_equipo a, ma_unidad b
            WHERE a.cve_unidad = b.clave";
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

    function getInteractiveMenu($chat_id, $text) {
        $this->thunderlog->writeLog("Comando recibido: " . $text);
        /* if(!strpos($text, "/")) {
            $data = [
                'chat_id' => $chat_id,
                'text' => "🤖 Thundersc: \"{$text}\""
            ];
            return $data;
        } */
        
        if ($text === "/start") {
            return $this->command_start($chat_id, $text);
        }

        if ($text === "/setsensor") {
            return $this->command_setsensor($chat_id, $text);
        }
    }

    function command_start($chat_id, $text) {
        $data = [
            'chat_id' => $chat_id,
            'text' => "¡Hola! Bienvenido al bot de Thundersc. Puedes usar los siguientes comandos:\n\n/setsensor - Registrar un sensor para recibir notificaciones.",
        ];

        return $data;
    }

    function command_setsensor($chat_id, $text) {
        $sensores = $this->getSensores();
        $inline_keyboard = [];

        foreach($sensores as $index => $sensor) {
            //$line = $index % 2 ? $inline_keyboard[count($inline_keyboard) - 1] : [];
            $inline_keyboard[] = [
                ['text' => "Sensor de ".$sensor['descri']." - ".$sensor['alias'], 
                'callback_data' => 'setsensor_' . $sensor['clave'] .'_'. $sensor['alias']]
            ];
        }

        $data = [
            'chat_id' => $chat_id,
            'text' => "Seleccione el sensor al que se desea registrar:",
            'reply_markup' => [
                'inline_keyboard' => $inline_keyboard,
            ],
        ];

        return json_encode($data);
    }
}
