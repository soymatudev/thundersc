<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 15/02/2024
ruta: thundersc/thundercloud/system/molinoysilo/molino/call.php
===============================================================================*/

require_once('./molino.php');
$key = $_POST['variableKey'];

if ($key == "getDataHistorial") {
    echo historial();
} else if ($key == "getHistorialTiempo") {
    echo historialTiempo();
} else if ($key == "getTiempoT") {
    echo tiempoT();
} else if ($key == "getMol") {
    echo mol();
} else if ($key == "getAmpere") {
    echo ampere();
}
