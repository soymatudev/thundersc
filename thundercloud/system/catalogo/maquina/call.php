<?php
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
