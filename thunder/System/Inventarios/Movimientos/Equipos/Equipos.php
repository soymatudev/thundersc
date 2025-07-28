
<?php
require_once('../../../import.php');

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
  <link rel="stylesheet" href="./Equipos.css">
  <link rel="shortcut icon" href="../../../template/assets/images/LogoThunderO.png" />
</head>

<body class="sidebar-icon-only">

    <div class="container-user" >
        <div class="info-user" id="title-user">
        <span class="d-flex title-user">$usr</span>
        </div>

        <div class="flex-grow d-flex align-items-stretch">
        <span class="title-modu">Movimiento de Equipos</span>
        </div> 

        <div class="info-permi">
            <button id="crud_bt_responsiva" class="icon-permi"><i class="bi bi-file-pdf"></i></button>
            <button id="crud_bt_add" class="icon-permi"><i class="bi bi-plus-square"></i></button>
            <button id="crud_bt_search" class="icon-permi"><i class="bi bi-search"></i></button>
            <button id="crud_bt_update" class="icon-permi"><i class="bi bi-pencil-square"></i></button>
            <button id="crud_bt_save" class="icon-permi"><i class="bi bi-floppy"></i></button>
            <button id="crud_bt_cancel" class="icon-permi"><i class="bi bi-x-square"></i></button>
        </div>
    </div>


  <div class="container-scroller content">

    <div class="container-fluid page-body-wrapper">
      <div class="main-panel content-wrapper">
        <div class="card d-flex" style="flex-direction: row; border: none;">

          <div class="col-3">

            <div id="div-codgen">
              <p class="label-c-g">Codigo Inventario:</p>
              <input type="text" maxlength="60" class="form_input bordes_redondeados input-area" name="codinv" id="codinv" placeholder=""/>
            </div>

            <div id="div-serie">
              <p class="label-c-g">Numero de serie:</p>
              <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="serie" id="serie" placeholder=""/>
            </div>

            <div id="div-marcas">
              <p class="label-c-g">Marcas:</p>
            </div>

            <div id="div-almacen">
              <p class="label-c-g">Almacen:</p>
            </div>

            <div id="div-empleado">
              <p class="label-c-g">Empleado:</p>
            </div>
          </div>

          <div class="col-3">
            <div id="div-clasificaciones">
              <p class="label-c-g">Clasificaciones:</p>
            </div>

            <div id="div-fini">
              <p class="label-c-g">Fecha de Inicio:</p>
              <input type="date" class="form_input bordes_redondeados input-area" name="fini" id="f_ini" />
            </div>

            <div id="div-departamento">
              <p class="label-c-g">Departameto:</p>
            </div>

            <div id="div-fmov">
              <p class="label-c-g">Fecha de Movimiento:</p>
              <input type="date" class="form_input bordes_redondeados input-area" name="fmov" id="f_mov" />
            </div>

            <div id="div-buttoms" style="margin-top: 1.8rem;">
                <button id="btn_add" class="form_catalog-button" style="height: 100%;">
                    <i class="bi bi-plus-square"></i>
                </button>
                <button id="btn_remove" class="form_catalog-button" style="height: 100%;">
                    <i class="bi bi-dash-square"></i>
                </button>
            </div>
          </div>

          <div class="col-7">
            <div class="grid ag-theme-balham" id="grid" style="height: 85vh;"></div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- <div class="container-fluid page-body-wrapper">
      <div class="main-panel content-wrapper">
        <div class="card">
          
        </div>
      </div>
    </div> -->

  </div>
  <script>
    const uu = '$uu';
    const cc = '$cc';
  </script>
  <script src="./Equipos.js"></script>
</body>

</html>
HTML;
echo $home;