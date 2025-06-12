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
  <link rel="stylesheet" href="./TiendasNext.css">
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
        <span class="title-modu">Tiendas Next</span>
        </div> 

        <div class="info-permi">
        </div>
    </div>


  <div class="container-scroller">
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="box-form bordes_redondeados shadow select-area" id="select-area">

          <div id="div-buttom-sinc" style="margin-top: 1rem;">
            <button id="btn_sinc" class="form_catalog-button" style="height: 100%; font-size: .8rem;">
                Sincronizar
            </button>
          </div>

          <div class="" id="comboButtom"></div>

      </div>
    </nav>

    <div class="container-fluid page-body-wrapper">


      <div class="main-panel content-wrapper">

      <div class="tab-wrapper">
        <ul class="tab-menu">
            <li id="tab0">Servidores</li>
            <li id="tab1">Mapa</li>
        </ul>
      </div>

        <div class="card" id="server" style="border: none;">
          <div class="grid ag-theme-balham" id="grid" style="height: 85vh;"></div>
        </div>

        <div class="card"  id="map" style="border: none;">
          <div class="grid ag-theme-balham" id="canva-map" style="height: 85vh;"></div>
        </div>

      </div>

    </div>

  </div>

  <script>
    const uu = '$uu';
    const cc = '$cc';
  </script>
  <script src="./TiendasNext.js"></script>
</body>

</html>
HTML;
echo $home;