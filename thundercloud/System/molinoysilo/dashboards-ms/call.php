<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 15/02/2024
ruta: thundersc/thundercloud/system/molinoysilo/datatable/call.php
===============================================================================*/

require_once('./dashboards.php');
$key = $_POST['variablePHP'];

if ($key == "getTiempoTS") {
    echo tiempoTS();
} else if ($key == "getActivos") {
    echo ampere();
} else if ($key == "getVolumen") {
    echo volumen();
}
