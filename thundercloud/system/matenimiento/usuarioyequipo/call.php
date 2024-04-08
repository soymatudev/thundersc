<?php
require_once('./usuarioyequipo.php');
$key = $_POST['variablekey'];

if ($key == "setEquipoTrabajo") {
    echo addEquipoTrabajo();
} else if ($key == "setUsuario") {
    echo  "sssssss";
    echo addUsuarioSoporte();
} else if ($key == "showTable") {
    echo showTable();
}
