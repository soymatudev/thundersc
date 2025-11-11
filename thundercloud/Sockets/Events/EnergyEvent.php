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

class EnergyEvent
{
    private $thunderlog = null;
    private $conn = null;
    private $sensor = null;
    private $event = null;
    private $model = null;
    private $version = null;
    private $infosensor = null;

    function __construct($uu, $cc, $data, $infosensor = null)
    {
        list($this->sensor, $keyEvent, $this->event, $this->model, $this->version) = explode(",", $data);
        $this->infosensor = $infosensor;
        $this->thunderlog = new Log(null, "Event_Menu");
    }

    function EnergyEvent() {
        $this->thunderlog->writeLog("Evento de energia recibido para el sensor: " . $this->sensor);
        return $this->BotNEG();
    }

    function BotNEG() {
        try {
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../../');
            $dotenv->load();
            $BOT_TOKEN = $_ENV['TELEGRAM_BOT_TOKEN'] ?: '';

            $temperatura = empty($temperatura) ? 0 : floatval($temperatura) - 1.5;
            $humedad = empty($humedad) ? 0 : floatval($humedad) - 1.5;
            $alias = $this->infosensor['alias'] ?: $this->sensor;

            $msg = "📟 Sensor: $alias fuera de servicio o sin energia ";
            $text = "\n $msg";

            $this->thunderlog->writeLog($msg);

            $text = "\n ⚡ Alerta de Energia! ⚡\n\n" . $msg;
            $bot = new Bot_Sensor($BOT_TOKEN);
            $response = $bot->bot_response("SITE", $text, $alias);
            $this->thunderlog->writeLog("Datos enviados al bot de Telegram correctamente");
            return 1;
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error al enviar datos al bot de Telegram: " . $e->getMessage());
            return 0;
        }
    }
}