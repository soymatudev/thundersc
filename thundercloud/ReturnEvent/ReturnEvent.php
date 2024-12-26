<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 20/11/2024
ruta: thundersc/thundercloud/ReturnEvent/ReturnEvent.php
===============================================================================*/

class ReturnEvent {

    public static function returnResponse($event = 2, $message = "", $result = null, $headers = null) {
        if($headers) {
            header($headers);
        }
        echo json_encode(["event" => $event, "msg" => $message, "result" => $result]);
    }

}
