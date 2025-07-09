<?php
require_once('../../import.php');

if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

function verifyPermiss ($permiso) {
  if (isset($_SESSION['permisos'])) {
    $permisos = explode(", ", $_SESSION['permisos']);
    return in_array($permiso, $permisos);
  }
  return false;
}

$uu = trim($_SESSION['cve_usu']) . '-' . trim($_SESSION['username']);
$usr = $_SESSION['usrdescri'];
$cc = $_SESSION['empresaActual'];

$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>Thunder</title>
  $globalImport
  <link rel="stylesheet" href="./SensoresTemp.css">
  <link rel="shortcut icon" href="../../../template/assets/images/LogoThunderO.png" />
</head>

<body>

    <div class="container-user" >
        <div class="info-user" id="title-user">
        <span class="d-flex title-user">$usr</span>
        </div>

        <div class="flex-grow d-flex align-items-stretch">
        <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize" id="menuIN">
            <i class="bi bi-list menu-list"></i>
        </button>
        <span class="title-modu">Sensores</span>
        </div> 

        <div class="info-permi">
        </div>
    </div>


  <div class="container-scroller">
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="box-form bordes_redondeados shadow select-area" id="select-area">

      <div class="container-c-g">
          <div id="div-zonas">
            <p class="label-c-g">Zonas:</p>
          </div>

          <div id="div-sensores">
            <p class="label-c-g">Sensores:</p>
          </div>
      </div>
        
          <div class="" id="comboButtom"></div>

      </div>
    </nav>

    <div class="container-fluid page-body-wrapper">


      <div class="main-panel content-wrapper">

        <div class="dashboard d-none"></div>
        <div id="chart-lines" class="ag-theme-balham" style="height: 100%;"></div>

      </div>

    </div>

  </div>

  <script>
    const uu = '$uu';
    const cc = '$cc';
  </script>

<script src="../../Componentes/Thermometer/Thermometer.js"></script>
  <script src="./SensoresTemp.js"></script>
  <link rel="stylesheet" href="../../Componentes/Thermometer/Thermometer.css">
</body>

</html>
HTML;
echo $home;