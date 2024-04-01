<?php
require_once('./dashboards.php');
$key = $_POST['variablePHP'];

if ($key == "getTiempoTS") {
    echo tiempoTS();
} else if ($key == "getActivos") {
    echo ampere();
} else if ($key == "getVolumen") {
    echo volumen();
}
