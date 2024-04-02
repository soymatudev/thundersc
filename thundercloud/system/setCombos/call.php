<?php
require_once('./setCombos.php');
$key = $_POST['variablekey'];

if ($key == "setComboCedis") {
    echo cedis();
} else if ($key == "setComboEquipo") {
    echo equipo();
} else if ($key == "setComboGrupo") {
    echo grupo();
}
