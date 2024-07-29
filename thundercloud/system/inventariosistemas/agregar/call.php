<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 22/04/2024
ruta: thundersc/thundercloud/system/inventariosistemas/agregar/call.php
===============================================================================*/
require_once('./agregar.php');
$key = $_POST['variablekey'];

if ($key == "setAsignatario") {
    echo addAsignatario();
} else if ($key == "setClasificacion") {
    echo addClasificacion();
} else if ($key == "setMarca") {
    echo addMarca();
} else if ($key == "setArea") {
    echo addArea();
} else if ($key == "setAlmacen") {
    echo addAlmacen();
} else if ($key == "setZona") {
    echo addZona();
} else if ($key == "setEquipo") {
    echo addEquipo();
} else if ($key == "showTable") {
    echo showTable();
} else if ($key == "deleteElemento") {
    echo dropElemento();
}
