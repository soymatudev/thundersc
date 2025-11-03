<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 03/11/2025
ruta: thundersc/thundercloud/API_bot/CallBackService.php
===============================================================================*/

require_once(__DIR__ . '/../System/Connection/Connection.php');
require_once(__DIR__ . '/../ReturnEvent/ReturnEvent.php');
require_once(__DIR__ . '/../System/Connection/Statement.php');
require_once(__DIR__ . '/../ThunderLog/ThunderLog.php');
require_once(__DIR__ . '/../vendor/autoload.php');

class CallBackService
{
    private $TELEGRAM_API = null;
    private $thunderlog = null;
    private $conn = null;

    function __construct()
    {
        $this->thunderlog = new Log(null, "API_BOT");
    }

    function callBackResponse ($chat_id, $callback_query) {
        try {
            $this->conn = (new Connection(null, 'PCZMEX'))->connect();
            if (!$this->conn) {
            $this->thunderlog->writeLog("Error de conexión" . $this->conn);
            return null;
            }

            if (strpos($callback_query, "setsensor_") !== false) {
                return $this->setUsuxSensor($chat_id, $callback_query);
            }

        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error al obtener chatIds: " . $e->getMessage());
            return [];
        }
    }

    function setUsuxSensor ($chat_id, $callback_query) {
        $this->thunderlog->writeLog("Callback recibido: " . $callback_query);

        $sensor_clave = explode("_", $callback_query)[1];
        $descri = explode("_", $callback_query)[2];

        $insertQuery = "INSERT INTO ma_sesus(cve_usu, cve_ses, cns_sn, alt_sn, baj_sn, cam_sn)
            VALUES ('{$chat_id}', '{$sensor_clave}', 'S', 'N', 'N', 'N')";
        $stmt = new Statement($this->conn, (null));
        $res = $stmt->prepareStatement($insertQuery);
        $insertResult = $stmt->executePreparedQuery($res);

        if ($insertResult) {
            return [
                'chat_id' => $chat_id,
                'text' => "✅ Has sido registrado correctamente para el sensor: {$descri}",
            ];;
        } else {
            $this->thunderlog->writeLog("Error al insertar chatId: " . implode(" | ", $insertResult->errorInfo()));
            return [
                'chat_id' => $chat_id,
                'text' => "❌ Error al registrarte para el sensor: {$descri}. Intenta de nuevo más tarde.",
            ];
        }
    }
}
