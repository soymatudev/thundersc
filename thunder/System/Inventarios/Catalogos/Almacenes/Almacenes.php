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
$usr = $_SESSION['username'];
$cc = $_SESSION['empresaActual'];

$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>Thunder</title>
  $globalImport
  <link rel="stylesheet" href="./Almacenes.css">
  <link rel="shortcut icon" href="../../../template/assets/images/LogoThunderO.png" />
</head>

<body class="sidebar-icon-only">

    <div class="container-user" >
        <div class="info-user" id="title-user">
        <span class="d-flex title-user">$usr</span>
        </div>

        <div class="flex-grow d-flex align-items-stretch">
        <span class="title-modu">Catalogo de Almacenes</span>
        </div> 

        <div class="info-permi">
            <button id="crud_bt_add" class="icon-permi"><i class="bi bi-plus-square"></i></button>
            <button id="crud_bt_search" class="icon-permi"><i class="bi bi-search"></i></button>
            <button id="crud_bt_update" class="icon-permi"><i class="bi bi-pencil-square"></i></button>
            <button id="crud_bt_save" class="icon-permi"><i class="bi bi-floppy"></i></button>
            <button id="crud_bt_cancel" class="icon-permi"><i class="bi bi-x-square"></i></button>
        </div>
    </div>


  <div class="container-scroller">

    <div class="container-fluid page-body-wrapper">
      <div class="main-panel content-wrapper">
        <div class="card d-flex" style="flex-direction: row; border: none;">

          <div class="col-4">

            <div id="div-clave">
              <p class="label-c-g">Clave:</p>
              <input type="text" maxlength="3" class="form_input bordes_redondeados input-area" name="clave" id="clave" placeholder="Clave del Almacen"/>
            </div>

            <div id="div-descri">
              <p class="label-c-g">Descripción:</p>
              <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="descri" id="descri" placeholder="Descripción"/>
            </div>

            <div id="div-domici">
              <p class="label-c-g">Domicilio:</p>
              <input type="text" maxlength="70" class="form_input bordes_redondeados input-area" name="domici" id="domici" placeholder="Domicilio" />
            </div>

            <div id="div-coloni">
              <p class="label-c-g">Colonia:</p>
              <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="coloni" id="coloni" placeholder="Colonia"/>
            </div>

            <div id="div-ciudad">
              <p class="label-c-g">Ciudad:</p>
              <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="ciudad" id="ciudad" placeholder="Ciudad" />
            </div>
          </div>

          <div class="col-4">
            <div id="div-munici">
              <p class="label-c-g">Municipio:</p>
              <input type="text" maxlength="3" class="form_input bordes_redondeados input-area" name="munici" id="munici" placeholder="Municipio" />
            </div>

            <div id="div-estado">
              <p class="label-c-g">Estado:</p>
              <input type="text" maxlength="3" class="form_input bordes_redondeados input-area" name="estado" id="estado" placeholder="Estado" />
            </div>

            <div id="div-pais">
              <p class="label-c-g">País:</p>
              <input type="text" maxlength="3" class="form_input bordes_redondeados input-area" name="pais" id="pais" placeholder="País" />
            </div>

            <div id="div-codpos">
              <p class="label-c-g">Código Postal:</p>
              <input type="text" maxlength="5" class="form_input bordes_redondeados input-area" name="codpos" id="codpos" placeholder="Código Postal" />
            </div>

            <div id="div-telef1">
              <p class="label-c-g">Teléfono 1:</p>
              <input type="text" maxlength="15" class="form_input bordes_redondeados input-area" name="telef1" id="telef1" placeholder="Teléfono" />
            </div>
          </div>
          
        </div>
      </div>
    </div>

  </div>
  <script>
    const uu = '$uu';
    const cc = '$cc';
  </script>
  <script src="./Almacenes.js"></script>
</body>

</html>
HTML;
echo $home;