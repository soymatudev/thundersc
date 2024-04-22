<?php
/*===============================================================================
Autor: Juan Maturana
Fecha de Creación: 10/04/2023
ruta: thundersc/thundercloud/log/user/adduser.php
===============================================================================*/
$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>ThunderSC Admin</title>

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
  <!-- End plugin css for this page -->
  <!-- inject:css -->
  <!-- endinject -->
  <!-- Layout styles -->
  <link rel="stylesheet" href="../../template/assets/css/style.css" />
  <link rel="stylesheet" href="../../template/assets/css/styleArea.css" />
  <link rel="stylesheet" href="./adduser.css" />
  <!-- End layout styles -->
  <link rel="shortcut icon" href="../../template/assets/images/LogoThunderO.png" />
</head>

<body>
  <div class="container-scroller">
    <!-- partial:partials/_sidebar.html -->
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="box-form bordes_redondeados shadow select-area" id="select-area">

        <div class="container-c-g">

        <div id="divFormato">
            <p class="label-c-g">Operacion:</p>
            <select class="select col-md-2" name="materia" tabindex="-1" aria-hidden="true" id="comboOperacion">
              <option value="0">Crear</option>
              <option value="1">Actualizar</option>
            </select>
          </div>

          <div id="divNombre">
            <p class="label-c-g">Nombre de Usuario:</p>
            <input type="text" maxlength="15" class="form_input bordes_redondeados input-area" name="nombre" id="nombre" />
          </div>

          <div id="divPassword">
            <p class="label-c-g">Constrasena:</p>
            <input type="text" maxlength="15" class="form_input bordes_redondeados input-area" name="password" id="password" />
          </div>

          <p class="label-c-g">Permisos:</p>
          <div class="container-permisos" >
            <ul>

              <li class="block-permiso" >
                Molino y Silo
                <!-- <input class="padre-ms box-permiso" type="checkbox" id="dashboard-ms" name="dashboard-ms" value="dashboard-ms" /> -->
                <ul>
                  <li>
                    Dashboards MS
                    <input class="ms box-permiso" type="checkbox" id="dashboard-ms" name="dashboard-ms" value="dashboard-ms" />
                  </li>
                  <li>
                    Molino
                    <input class="ms box-permiso" type="checkbox" id="molino-ms" name="molino-ms" value="molino-ms" />
                  </li>
                  <li>
                    Silo
                    <input class="ms box-permiso" type="checkbox" id="silo-ms" name="silo-ms" value="silo-ms" />
                  </li>
                  <li>
                    Panel Tecnico
                    <input class="ms box-permiso" type="checkbox" id="panel-tecnico-ms" name="panel-tecnico-ms" value="panel-tecnico-ms" />
                  </li>
                </ul>
              </li>

              <li class="block-permiso" >
                Mantenimiento
                <!-- <input class="padre-man box-permiso" type="checkbox" id="usuariosygrupos-man" name="usuariosygrupos-man" value="A" /> -->
                <ul>
                  <li>
                    Usuarios y Grupos
                    <input class="man box-permiso" type="checkbox" id="usuariosygrupos-man" name="usuariosygrupos-man" value="usuariosygrupos-man" />
                  </li>
                  <li>
                    Nuevas OT
                    <input class="man box-permiso" type="checkbox" id="nuevasot-man" name="nuevasot-man" value="nuevasot-man" />
                  </li>
                  <li>
                    Calendario
                    <input class="man box-permiso" type="checkbox" id="permisoAA" name="calendario-man" value="calendario-man" />
                  </li>
                </ul>
              </li>

              <li class="block-permiso" >
                Catalogos
                <!-- <input class="padre-cat box-permiso" type="checkbox" id="permisoA" name="permisoA" value="A" /> -->
                <ul>
                  <li>
                    Maquinas
                    <input class="cat box-permiso" type="checkbox" id="maquinas-ca" name="maquinas-ca" value="maquinas-ca" />
                  </li>
                  <li>
                    Ubicaciones
                    <input class="cat box-permiso" type="checkbox" id="ubicaciones-ca" name="ubicaciones-ca" value="ubicaciones-ca" />
                  </li>
                </ul>
              </li>
              
            </ul>
          </div>
          
        </div>

        <div class="container-c-g container-button">
          <button class="bordes_redondeados shadow btn_consult btn" id="btn_Add">
            Agregar
          </button>
          <button class="bordes_redondeados shadow btn_consult btn" id="btn_Update">
            Actualizar
          </button>
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

  <script defer src="../../system/dataFetch/dataFetch.js"></script>
  <script defer src="../../template/assets/js/dashboard.js"></script>
  <script defer src="../../template/node_modules/ag-grid-community/dist/ag-grid-community.min.js"></script>
  <script defer src="../../template/assets/js/setTable.js"></script>
  <script defer src="../../sweetAlert2/sweetAlert.js"></script>
  <script defer src="./adduser.js"></script>
  
  <!-- End custom js for this page -->
</body>

</html>
HTML;

echo $home;
