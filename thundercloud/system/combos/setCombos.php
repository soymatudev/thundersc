<?php
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 2024
===============================================================================
*/
require_once('Combo.php');
/* 
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
 */

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (isset($_POST["variablekey"])) {
    $key = $_POST["variablekey"];

    if ($key == "showEquipo") {
      echo equipo();
    } else if ($key == "showSubEquipo") { 
      echo subEquipo();
    } else if ($key == "comboUnidad") {
      //echo unidad();
    }
  } else {
    echo "Error";
  }
}
