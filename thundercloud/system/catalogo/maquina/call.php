<?php
require_once('./ubicacion.php');
$key = $_POST['variablekey'];

if ($key == "addZona") {
    echo addZona();
} else if ($key == "addArea") {
    echo addArea();
} else if ($key == "addRelacion") {
    echo addRelacion();
} else if ($key == "showTable") {
    echo showTable();
}
