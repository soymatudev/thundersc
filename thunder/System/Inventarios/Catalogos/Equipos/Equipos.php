
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
        <span class="title-modu">Catalogo de Equipos</span>
        </div> 

        <div class="info-permi">
            <button id="upload-file" class="icon-permi"><i class="bi bi-file-earmark-arrow-up"></i></button>
            <button id="download-grid" class="icon-permi"><i class="bi bi-file-earmark-arrow-down"></i></button>
            <button id="crud_bt_add" class="icon-permi"><i class="bi bi-plus-square"></i></button>
            <button id="crud_bt_search" class="icon-permi"><i class="bi bi-search"></i></button>
            <button id="crud_bt_update" class="icon-permi"><i class="bi bi-pencil-square"></i></button>
            <button id="crud_bt_save" class="icon-permi"><i class="bi bi-floppy"></i></button>
            <button id="crud_bt_delete" class="icon-permi"><i class="bi bi-trash"></i></button>
            <button id="crud_bt_cancel" class="icon-permi"><i class="bi bi-x-square"></i></button>
        </div>
    </div>


  <div class="container-scroller content">

    <div class="container-fluid page-body-wrapper">
      <div class="main-panel content-wrapper">
        <div class="card d-flex" style="flex-direction: row; border: none;">

          <div class="col-3">
            <div id="div-codexist">
              <p class="label-c-g">Codigo Largo:</p>
              <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="codexis" id="codexis" placeholder="" />
            </div>

            <div id="div-codi">
              <p class="label-c-g">Codigo de Inventario:</p>
              <input type="text" maxlength="5" class="form_input bordes_redondeados input-area" name="codigo" id="codigo" placeholder="XXXXX" />
            </div>

            <div id="div-serie">
              <p class="label-c-g">Numero de serie:</p>
              <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="serie" id="serie" placeholder="Serie"/>
            </div>

            <div id="div-marcas">
              <p class="label-c-g">Marcas:</p>
            </div>

            <div id="div-modelo">
              <p class="label-c-g">Modelo:</p>
              <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="modelo" id="modelo" placeholder="modelo" />
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
            
            <div id="div-status">
              <p class="label-c-g">Estatus del equipo:</p>
              <select class="select col-md-2" tabindex="-1" aria-hidden="true" id="select-status">
                <option value="A">Activo</option>
                <option value="N">Inactivo</option>
              </select>
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