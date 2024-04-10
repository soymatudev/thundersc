<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 05/03/2024
ruta: thundersc/thundercloud/system/mantenimiento/usuarioyequipo/call.php
===============================================================================*/
require_once('./usuarioyequipo.php');
$key = $_POST['variablekey'];

if ($key == "setEquipoTrabajo") {
    echo addEquipoTrabajo();
} else if ($key == "setUsuario") {
    echo addUsuarioSoporte();
} else if ($key == "showTable") {
    echo showTable();
}
