<?php
/*===============================================================================
Autor: Juan Maturana
Fecha de Creación: 11/14/2024
ruta: thundersc/thunder/admin/addmodu/addmodu.php
===============================================================================*/
$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>Thunder Admin</title>

  <!-- AG Grid CSS (Estilos) -->
  <link rel="stylesheet" href="../../template/node_modules/ag-grid-community/styles/ag-grid.css" />
  <link rel="stylesheet" href="../../template/node_modules/ag-grid-community/styles/ag-theme-alpine.css" />

  <script src="../../template/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  <script src="../../template/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
  <!-- plugins:css -->
  <link rel="stylesheet" href="../../template/assets/vendors/mdi/css/materialdesignicons.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/css/vendor.bundle.base.css" />
  <!-- endinject -->
  <!-- Plugin css for this page -->
  <link rel="stylesheet" href="../../template/assets/vendors/jvectormap/jquery-jvectormap.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/flag-icon-css/css/flag-icon.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/owl-carousel-2/owl.carousel.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/owl-carousel-2/owl.theme.default.min.css" />
  <link rel="stylesheet" href="../../template/assets//vendors/select2/select2.min.css">
  <link rel="stylesheet" href="../../template/node_modules/bootstrap-icons/font/bootstrap-icons.min.css">
  <!-- End plugin css for this page -->
  <!-- inject:css -->
  <!-- endinject -->
  <!-- Layout styles -->
  <link rel="stylesheet" href="../../template/assets/css/style.css" />
  <link rel="stylesheet" href="../../template/assets/css/styleArea.css" />
  <link rel="stylesheet" href="../../template/assets/css/styleUser.css">
  <link rel="stylesheet" href="./Modulos.css" />
  <!-- End layout styles -->
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
      <span class="title-modu">Generacion de Modulos</span>
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

          <div id="div-nobmre">
            <p class="label-c-g">Nombre:</p>
            <input type="text" maxlength="30" class="form_input bordes_redondeados input-area" name="nombre" id="nombre" />
          </div>

          <div id="div-ruta">
            <p class="label-c-g">Ruta:</p>
            <input type="text" maxlength="70" class="form_input bordes_redondeados input-area" name="ruta" id="ruta" />
          </div>

          <div id="div-menu">
            <p class="label-c-g">Menu:</p>
            <input type="text" maxlength="70" class="form_input bordes_redondeados input-area" name="menu" id="menu" />
          </div>

          <div id="div-permisos">
            <p class="label-c-g">permisos:</p>
            <input type="text" maxlength="15" class="form_input bordes_redondeados input-area" name="permiso" id="permiso1" />
            <input type="text" maxlength="15" class="form_input bordes_redondeados input-area mg-top-6" name="permiso" id="permiso2" />
            <input type="text" maxlength="15" class="form_input bordes_redondeados input-area mg-top-6" name="permiso" id="permiso3" />
            <input type="text" maxlength="15" class="form_input bordes_redondeados input-area mg-top-6" name="permiso" id="permiso4" />
            <button class="bt-add-component"><i class="bi bi-plus-circle"></i></button>
          </div>
          
        </div>

      </div>
    </nav>
    <!-- partial -->
    <div class="container-fluid page-body-wrapper">
      <!-- partial:partials/_navbar.html -->
      <!-- partial -->
      <div class="main-panel">
        <div class="content-wrapper">

        <div class="row">

            <div class="col-md-12 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaOne" style="height: 85vh">
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
        <!-- content-wrapper ends -->

      </div>
      <!-- main-panel ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
  <!-- container-scroller -->
  <!-- plugins:js -->
  <script src="../../template/assets/vendors/js/vendor.bundle.base.js"></script>
  <!-- endinject -->
  <!-- Plugin js for this page -->
  <script src="../../template/assets/vendors/chart.js/Chart.min.js"></script>
  <script src="../../template/assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
  <script src="../../template/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
  <script src="../../template/assets/vendors/owl-carousel-2/owl.carousel.min.js"></script>
  <script src="../../template/assets/vendors/select2/select2.min.js"></script>
  <!-- End plugin js for this page -->
  <!-- inject:js -->
  <script src="../../template/assets/js/off-canvas.js"></script>
  <script src="../../template/assets/js/hoverable-collapse.js"></script>
  <script src="../../template/assets/js/misc.js"></script>
  <script src="../../template/assets/js/settings.js"></script>
  <script src="../../template/assets/js/todolist.js"></script>
  <!-- endinject -->
  <!-- Custom js for this page -->
  <script defer src="../../Bridge/Bridge.js"></script>
  <script defer src="../../System/Componentes/Componentes.js" ></script>

  <script defer src="../../System/sweetAlert2/sweetAlert.js"></script>

  <script defer src="../../System/Funciones/Funciones.js"></script>
  <script defer src="../../System/dataFetch/dataFetch.js"></script>
  <script defer src="../../template/assets/js/dashboard.js"></script>
  <script defer src="../../template/node_modules/ag-grid-community/dist/ag-grid-community.min.js"></script>
  <script defer src="../../template/assets/js/setTable.js"></script>
  <script defer src="./Modulos.js"></script>
  
  <!-- End custom js for this page -->
</body>

</html>
HTML;

echo $home;
