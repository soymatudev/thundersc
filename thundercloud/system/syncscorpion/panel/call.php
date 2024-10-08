<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 07/10/2024
ruta: thundersc/thundercloud/system/panel/panel/call.php
===============================================================================*/
require_once('./panelService.php');
$key = $_POST['variablekey'];

if ($key == "showTable") {
    echo showTable();
} else if ($key == "getPDF") {
    echo showDataPDF();
}
