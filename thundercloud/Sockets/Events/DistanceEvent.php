<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 03/11/2025
ruta: thundersc/thundercloud/API_bot/InteractiveMenuService.php
===============================================================================*/

require_once(__DIR__ . '/../../System/Connection/Connection.php');
require_once(__DIR__ . '/../../ReturnEvent/ReturnEvent.php');
require_once(__DIR__ . '/../../System/Connection/Statement.php');
require_once(__DIR__ . '/../../ThunderLog/ThunderLog.php');
require_once(__DIR__ . '/../../vendor/autoload.php');

class DistanceEvent
{
    private $thunderlog = null;
    private $conn = null;
    private $sensor = null;
    private $infosensor = null;
    private $dato1 = null;
    private $dato2 = null;
    private $model = null;
    private $version = null;
    private $cc = null;
    private $uu = null;

    function __construct($uu, $cc, $data, $infosensor = null)
    {
        list($this->sensor, $this->dato1, $this->dato2, $this->model, $this->version) = explode(",", $data);
        $this->thunderlog = new Log(null, "Event_Menu");
        $this->infosensor = $infosensor;
        $this->cc = $cc;
        $this->uu = $uu;
    }

    function DisEvent() {
        $this->thunderlog->writeLog("Evento de energia recibido para el sensor: " . $this->sensor);
        return $this->QueryEvent();
    }

    function BotDist() {
        try {
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../../');
            $dotenv->load();
            $BOT_TOKEN = $_ENV['TELEGRAM_BOT_TOKEN'] ?: ''; // Logica para escoger el token del bot
            $this->thunderlog->writeLog("Enviando datos al bot de Telegram");

            $dato1 = empty($this->dato1) ? 0 : floatval($this->dato1) - 1.5;
            $dato2 = empty($this->dato2) ? 0 : floatval($this->dato2) - 1.5;
            $alias = $this->infosensor['alias'] ?: $this->sensor;

            $msg = $dato1 != null ? "📟 Sensor: $alias \n" . "Dato 1: $dato1 \n" . "Dato 2: $dato2" : "Error: Sin Datos";
            $text = "\n $msg";


            $this->thunderlog->writeLog($msg);
            if ($dato1 > $this->infosensor['adc_1']) {
                $text = "\n ⚠️ Alerta de Capacidad Alta! ⚠️\n\n" . $msg;
                $bot = new Bot_Sensor($BOT_TOKEN);
                $response = $bot->bot_response("SITE", $text, $alias);
                $this->thunderlog->writeLog("Datos enviados al bot de Telegram correctamente");
            } else if($dato1 < $this->infosensor['adc_3']) {
                $text = "\n ⚠️ Alerta de Capacidad Baja! ⚠️\n\n" . $msg;
                $bot = new Bot_Sensor($BOT_TOKEN);
                $response = $bot->bot_response("SITE", $text, $alias);
                $this->thunderlog->writeLog("Datos enviados al bot de Telegram correctamente");
            }
            $this->thunderlog->writeLog("");
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error al enviar datos al bot de Telegram: " . $e->getMessage());
            ReturnEvent::returnResponse(1, "Error al enviar datos al bot de Telegram", $e->getMessage());
        }
    }

    function QueryEvent()
    {
        try {
            $this->conn = (new Connection(null, $this->cc))->connect();
            if (!$this->conn) {
                $this->thunderlog->writeLog("Error de conexión" . $this->conn);
                return null;
            }

            $equipos = "nombre in ('{$this->sensor}')";

            $query = "SELECT * FROM ma_equipo where $equipos";
            $this->thunderlog->writeLog("Query => " . $query);
            $stmt = new Statement($this->conn, (null));
            $res = $stmt->prepareStatement($query);
            $result = $stmt->executePreparedQuery($res);

            if (count($result) > 0) {

                $query = "insert into ma_regzoro(cve_equipo, fecha_hora, dato_1, dato_2) values(:cve_equipo, now(), :dato_1, :dato_2)";
                $this->thunderlog->writeLog("Query => " . $query);
                $stmt = new Statement($this->conn, (null));
                $res = $stmt->prepareStatement($query);

                $nombre = $result[0]['alias'] ?: $result[0]['nombre'];

                $res->bindParam(':cve_equipo', $result[0]['clave'], PDO::PARAM_STR);
                $res->bindParam(':dato_1', $this->dato1, PDO::PARAM_STR);
                $res->bindParam(':dato_2', $this->dato2, PDO::PARAM_STR);

                $this->thunderlog->writeLog("Por ejecutar la consulta");
                $result = $stmt->executePreparedQuery($res);
                $this->thunderlog->writeLog("Consulta ejecutada correctamente");

                $this->thunderlog->writeLog("Llamando a Boty");
                $this->sensor = $nombre;
                $this->BotDist();

                return $result ? 1 : 0;
            } else {
                $this->thunderlog->writeLog("Equipos no encontrados");
                return 0;
            }
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error => " . $e->getMessage());
            return 0;
        }
    }
}