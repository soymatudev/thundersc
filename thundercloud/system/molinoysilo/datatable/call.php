<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 15/02/2024
ruta: thundersc/thundercloud/system/molinoysilo/datatable/call.php
===============================================================================*/

require_once('./datatable.php');
require_once('./createChart.php');

$key = $_POST['variablekey'];
if ($key == "setDataTable") {
  echo table();
} else  if ($key == "getDataHistorial") {
  //echo "sssssss";
  echo historialData();
} else if ($key == "getHistorialTiempo") {
  //echo "sssssss";

  echo historialTiempo();
} else if ($key == "getHistorialExtra") {
  //echo "sssssss";

  echo historialExtra();
} else {
  echo "ddddsssssss";
}
