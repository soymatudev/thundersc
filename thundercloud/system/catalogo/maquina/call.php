<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 06/03/2024
ruta: thundersc/thundercloud/system/catalogo/maquina/call.php
===============================================================================*/

require_once('./maquina.php');
$key = $_POST['variablekey'];

if ($key == "setEquipo") {
    echo addEquipo();
} else if ($key == "setComponente") {
    echo addComponente();
}  else if ($key == "setClasif") {
    echo addClasificacion();
} else if ($key == "addRelacion") {
    echo addRelacion();
} else if ($key == "showTable") {
    echo showTable();
}
