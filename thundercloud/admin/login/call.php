<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 30/04/2024
ruta: thundersc/thundercloud/admin/login/call.php
===============================================================================*/
require_once('./login.php');
$key = $_POST['variablekey'];

if ($key == "login") {
    echo login();
} 
