<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 10/04/2023
ruta: thundersc/thundercloud/log/user/call.php
===============================================================================*/
require_once('./adduser.php');
$key = $_POST['variablekey'];

if ($key == "setUsuario") {
    echo addUsuario();
} else if ($key == "setUsuario") {
    echo addUsuarioSoporte();
} else if ($key == "showTable") {
    echo showTable();
}
