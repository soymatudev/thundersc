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

require_once(__DIR__ . '/EnergyEvent.php');
require_once(__DIR__ . '/TemperatureEvent.php');
require_once(__DIR__ . '/DistanceEvent.php');

class MenuEvent
{
    private $thunderlog = null;
    private $conn = null;

    function __construct()
    {
        $this->thunderlog = new Log(null, "Event_Menu");
    }

    function getMenuEvent($uu, $cc, $data, $infosensor = null) {
        $this->thunderlog->writeLog("Comando recibido: " . $data);
        // data -> Temp03,event,NEG,TMP001,V2 uu -> A cc -> PCZMEX
        // or data -> Temp01,22.80,43.70,TMP001,V1 uu -> A cc -> PCZMEX

        $keyEvent = strpos($data, "event");
        $event = explode(",", $data)[2];
        $resultReturn = null;

        $this->thunderlog->writeLog("Evento identificado: " . $event);
        if (!$keyEvent) {
            $tempEvent = new TemperatureEvent($uu, $cc, $data, $infosensor);
            $resultReturn = $tempEvent->TempEvent();
        }

        if ($event === "NEG") {
            $energyEvent = new EnergyEvent($uu, $cc, $data, $infosensor);
            $resultReturn = $energyEvent->EnergyEvent();
        }

        if ($event === "OPG") {
            $energyEvent = new DistanceEvent($uu, $cc, $data, $infosensor);
            $resultReturn = $energyEvent->DisEvent();
        }

        return $resultReturn;
    }
}
