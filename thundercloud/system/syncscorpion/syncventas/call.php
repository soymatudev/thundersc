<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 07/10/2024
ruta: thundersc/thundercloud/system/syncscorpion/syncventas/call.php
===============================================================================*/
require_once('./syncventasService.php');
$key = $_POST['variablekey'];

if ($key == "sincronizarWeb") {
    echo activeServerVtaScoWeb();
}
