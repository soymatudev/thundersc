<?php
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 2024
===============================================================================
*/
require_once('catalogo_mp.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (isset($_POST["variablekey"])) {
    $key = $_POST["variablekey"];

    if ($key == "addRecord") {
      echo addRecord();
    } else if ($key == "showCatalogo") {
      echo showCatalogo();
    }
  } else {
    echo "Key Incorrect";
  }
}
