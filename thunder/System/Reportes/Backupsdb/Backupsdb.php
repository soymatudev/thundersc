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
  <link rel="stylesheet" href="./Backupsdb.css">
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
        <span class="title-modu">Backups</span>
        </div> 

        <div class="info-permi">
            <button id="download-grid" class="icon-permi"><i class="bi bi-file-earmark-arrow-down"></i></button>
        </div>
    </div>


  <div class="container-scroller">
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="box-form bordes_redondeados shadow select-area" id="select-area">

        <div id="div-fini">
          <p class="label-c-g">Fecha de Inicio:</p>
          <input type="date" class="form_input bordes_redondeados input-area" name="fini" id="f_ini" />
        </div>

        <div id="div-ffin">
          <p class="label-c-g">Fecha de Fin:</p>
          <input type="date" class="form_input bordes_redondeados input-area" name="ffin" id="f_fin" />
        </div>

        <div class="" id="comboButtom"></div>

      </div>
    </nav>

    <div class="container-fluid page-body-wrapper">
      <div class="main-panel content-wrapper">
        <div class="card">
          <div class="grid ag-theme-balham" id="grid" style="height: 85vh;"></div>
        </div>
      </div>
    </div>

  </div>

  <script>
    const uu = '$uu';
    const cc = '$cc';
  </script>
  <script src="./Backupsdb.js"></script>
</body>

</html>
HTML;
echo $home;