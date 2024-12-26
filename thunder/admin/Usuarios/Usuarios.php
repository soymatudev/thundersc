<?php
/*===============================================================================
Autor: Juan Maturana
Fecha de Creación: 11/14/2024
ruta: thundersc/thunder/Admin/Usuarios/Usuarios.php
===============================================================================*/
$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>Thunder</title>

 
  <link rel="stylesheet" href="../../template/node_modules/ag-grid-community/styles/ag-grid.css" />
  <link rel="stylesheet" href="../../template/node_modules/ag-grid-community/styles/ag-theme-balham.css" />

  <script src="../../template/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  <script src="../../template/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>

  <link rel="stylesheet" href="../../template/assets/vendors/mdi/css/materialdesignicons.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/css/vendor.bundle.base.css" />

  <link rel="stylesheet" href="../../template/assets/vendors/jvectormap/jquery-jvectormap.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/flag-icon-css/css/flag-icon.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/owl-carousel-2/owl.carousel.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/owl-carousel-2/owl.theme.default.min.css" />
  <link rel="stylesheet" href="../../template/assets//vendors/select2/select2.min.css">
  <link rel="stylesheet" href="../../template/node_modules/bootstrap-icons/font/bootstrap-icons.min.css">
 
  <link rel="stylesheet" href="../../template/assets/css/style.css" />
  <link rel="stylesheet" href="../../template/assets/css/styleArea.css" />
  <link rel="stylesheet" href="../../template/assets/css/styleUser.css">
  <link rel="stylesheet" href="./Usuarios.css" />

  <link rel="shortcut icon" href="../../template/assets/images/LogoThunderO.png" />
</head>

<body>
  <div class="container-user" >
    <div class="info-user" id="title-user">
      <span class="d-flex title-user">admi</span>
    </div>

    <div class="flex-grow d-flex align-items-stretch">
      <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize" id="menuIN">
        <i class="bi bi-list menu-list"></i>
      </button>
      <span class="title-modu">Generacion de Usuarios</span>
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
    <!-- partial:partials/_sidebar.html -->
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="box-form bordes_redondeados shadow select-area" id="select-area">

        <div class="container-c-g">

          <div id="div-clave">
            <p class="label-c-g">Clave:</p>
            <input type="text" maxlength="15" class="form_input bordes_redondeados input-area" name="clave" id="clave" />
          </div>

          <div id="div-nobmre">
            <p class="label-c-g">Usuario:</p>
            <input type="text" maxlength="15" class="form_input bordes_redondeados input-area" name="usuario" id="usuario" />
          </div>

          <div id="div-ruta">
            <p class="label-c-g">Descripcion:</p>
            <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="descri" id="descri" />
          </div>

          <div id="div-ruta">
            <p class="label-c-g">Password:</p>
            <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="password" id="password" />
          </div>

          <div id="div-empresa">
            <p class="label-c-g">Empresa:</p>
          </div>

          <div id="div-ruta">
            <p class="label-c-g">Clave Modulo:</p>
            <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="cve_modulo" id="cve_modulo" />
          </div>

          <div class="container-permisos" >
            <p class="label-c-g">permisos:</p>
              <ul class="list-permisos" id="list-permisos">
                
              </ul>
          </div>
          
        </div>

      </div>
    </nav>

    <div class="container-fluid page-body-wrapper">
      <div class="main-panel content-wrapper">

        <div class="card" style="border: none;">
          <div class="grid ag-theme-balham" id="gridModulos" style="height: 85vh;"></div>
        </div>

      </div>
    </div>

  </div>

  <script src="../../template/assets/vendors/js/vendor.bundle.base.js"></script>

  <script src="../../template/assets/vendors/chart.js/Chart.min.js"></script>
  <script src="../../template/assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
  <script src="../../template/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
  <script src="../../template/assets/vendors/owl-carousel-2/owl.carousel.min.js"></script>
  <script src="../../template/assets/vendors/select2/select2.min.js"></script>

  <script src="../../template/assets/js/off-canvas.js"></script>
  <script src="../../template/assets/js/hoverable-collapse.js"></script>
  <script src="../../template/assets/js/misc.js"></script>
  <script src="../../template/assets/js/settings.js"></script>
  <script src="../../template/assets/js/todolist.js"></script>

  <script defer src="../../Bridge/Bridge.js"></script>
  <script defer src="../../System/Componentes/Componentes.js" ></script>

  <script defer src="../../System/sweetAlert2/sweetAlert.js"></script>
  <script defer src="../../System/Funciones/Funciones.js"></script>
  <script defer src="../../template/assets/js/dashboard.js"></script>
  <script defer src="../../template/node_modules/ag-grid-community/dist/ag-grid-community.min.js"></script>
  <script defer src="../../template/assets/js/setTable.js"></script>
  <script defer src="./Usuarios.js"></script>
  
  <!-- End custom js for this page -->
</body>

</html>
HTML;

echo $home;
