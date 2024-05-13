<?php

  if (session_status() == PHP_SESSION_NONE) {
    session_start();
  }

  if (!isset($_SESSION['username'])) {
   header('Location: ../admin/login/login.php');
  }

  /* if (time() - $_SESSION['tiempo_login'] >= 1800) {
    session_unset();
    session_destroy();
    header('Location: ../admin/login/login.php');
  } */

$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>ThunderSC</title>
  <!-- plugins:css -->
  <link rel="stylesheet" href="../template/assets/vendors/mdi/css/materialdesignicons.min.css" />
  <link rel="stylesheet" href="../template/assets/vendors/css/vendor.bundle.base.css" />
  <!-- endinject -->
  <!-- Plugin css for this page -->
  <link rel="stylesheet" href="../template/assets/vendors/jvectormap/jquery-jvectormap.css" />
  <link rel="stylesheet" href="../template/assets/vendors/flag-icon-css/css/flag-icon.min.css" />
  <link rel="stylesheet" href="../template/assets/vendors/owl-carousel-2/owl.carousel.min.css" />
  <link rel="stylesheet" href="../template/assets/vendors/owl-carousel-2/owl.theme.default.min.css" />
  <!-- End plugin css for this page -->
  <!-- inject:css -->
  <!-- endinject -->
  <!-- Layout styles -->
  <link rel="stylesheet" href="../template/assets/css/styleMenu.css" />
  <!-- End layout styles -->
  <link rel="shortcut icon" href="../template/assets/images/LogoThunderO.png" />
</head>

<body class="sidebar-icon-only">
  <div class="container-scroller">
    <!-- partial:partials/_sidebar.html -->
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="sidebar-brand-wrapper d-flex align-items-center justify-content-center fixed-top">
        <a class="sidebar-brand brand-logo" href="#">ThunderSC Cloud</a>
      </div>
      <ul class="nav">
        
        <li class="nav-item menu-items">
          <a class="nav-link" data-toggle="collapse" href="#MenuMolinoSilo" aria-expanded="false" aria-controls="auth">
            <span class="menu-title">Molino y Silo</span>
            <i class="menu-arrow"></i>
          </a>
          <div class="collapse" id="MenuMolinoSilo">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <a class="nav-link" data-url="./molinoysilo/dashboards-ms/dashboards.php" id="Dashboards"
                  onclick="addTab('Dashboards')">Dashboards MS</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="./molinoysilo/molino/molino.php" id="Molino"
                onclick="addTab('Molino')" >Molino</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="./molinoysilo/silo/silo.php" id="Silo"
                onclick="addTab('Silo')" >Silo</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="./molinoysilo/datatable/datatable.php" id="Panel-Tecnico"
                onclick="addTab('Panel-Tecnico')" >Panel Tecnico</a>
              </li>
            </ul>
          </div>
        </li>

        <li class="nav-item menu-items">
          <a class="nav-link" data-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="auth">
            <span class="menu-title">Mantenimiento</span>
            <i class="menu-arrow"></i>
          </a>
          <div class="collapse" id="ui-basic">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item menu-items">
                <a class="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
                  <span class="menu-title">User Pages</span>
                  <i class="menu-arrow"></i>
                </a>
                <div class="collapse" id="auth">
                  <ul class="nav flex-column sub-menu">
                    <li class="nav-item">
                      <a data-url="./mantenimiento/usuarioyequipo/usuarioyequipo.php" id="in" onclick="addTab('in')"
                        class="nav-link">
                        Usuarios y Grupos
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="./mantenimiento/usuarioyequipo/usuarioyequipo.php" id="Usuarios y Grupos"
                  onclick="addTab('Usuarios y Grupos')">Usuarios y Grupos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="./catalogo_mp/catalogo_mp.html" id="ca"
                onclick="addTab('ca')" >Catálogo</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="./nueva_ot/nueva_ot.html" id="M-OT"
                  onclick="addTab('M-OT')">
                  Calendario y OT</a>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item menu-items">
          <a class="nav-link" data-toggle="collapse" href="#Calidad" aria-expanded="false" aria-controls="auth">
            <span class="menu-title">Catalogos</span>
            <i class="menu-arrow"></i>
          </a>
          <div class="collapse" id="Calidad">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <a class="nav-link" data-url="./catalogo/maquina/maquina.php" id="Catalogo Maquinas"
                onclick="addTab('Catalogo Maquinas')">
                  Maquinas
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="./catalogo/ubicacion/ubicacion.php" id="Catalogo Ubicaciones"
                onclick="addTab('Catalogo Ubicaciones')">
                  Ubicaciones
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item menu-items">
          <a class="nav-link" data-toggle="collapse" href="#InventarioS" aria-expanded="false" aria-controls="auth">
            <span class="menu-title">Inventario Sistemas</span>
            <i class="menu-arrow"></i>
          </a>
          <div class="collapse" id="InventarioS">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <a class="nav-link" data-url="./inventariosistemas/agregar/agregar.php" id="Inventario Sistemas"
                onclick="addTab('Inventario Sistemas')">
                  Agregar
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="./inventariosistemas/historial/historial.php" id="Historial Sistemas"
                onclick="addTab('Historial Sistemas')">
                  Historial
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    <!-- partial -->
    <div class="container-fluid page-body-wrapper">
      <!-- partial:partials/_navbar.html -->
      <nav class="navbar navbar-w p-0 fixed-top d-flex flex-row">
        <!-- <div class="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
          <a class="navbar-brand brand-logo-mini" href="index.html"><img
              src="../template/assets/images/logo-mini.svg" alt="logo" /></a>
        </div> -->
        <div class="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <span class="mdi mdi-menu"></span>
          </button>

          <button class="align-self-center" type="button" id="btn-killSession">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left btn-killSession" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
              <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
            </svg>
          </button>
        </div>
      </nav>
      <!-- partial -->
      <div class="main-panel">
        <div class="content-wrapper">

          <div class="">
            <div class="" id="">
              <div  class="">
                
                <div class="row" id="tab-bar">
                  
                  <div class="col-1 body-tab" style="margin-left: 20px;">
                    <button class="brn-tab-delete" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill tab-delete" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"></path>
                      </svg>
                    </button>
                    <a class="link-tab" href="#tab-content-1">w2</a>
                  </div>

                </div>

              </div>
            </div>
          </div>

          <div class="tabs">
            <div class="tab-container" id="tab-container">

              <div id="tab-content-1" class="tab">
                <div  class="tab-content">
                  <iframe src="./w2.php" class="iframe"></iframe>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
      <!-- main-panel ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
  <!-- container-scroller -->

  <!-- plugins:js -->
  <script src="../template/assets/vendors/js/vendor.bundle.base.js"></script>
  <!-- endinject -->
  <!-- Plugin js for this page -->
  <script src="../template/assets/vendors/chart.js/Chart.min.js"></script>
  <script src="../template/assets/vendors/progressbar.js/progressbar.min.js"></script>
  <script src="../template/assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
  <script src="../template/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
  <script src="../template/assets/vendors/owl-carousel-2/owl.carousel.min.js"></script>
  <!-- End plugin js for this page -->
  <!-- inject:js -->
  <script src="../template/assets/js/off-canvas.js"></script>
  <script src="../template/assets/js/hoverable-collapse.js"></script>
  <script src="../template/assets/js/misc.js"></script>
  <script src="../template/assets/js/settings.js"></script>
  <script src="../template/assets/js/todolist.js"></script>
  <!-- endinject -->
  <!-- Custom js for this page -->
  <script src="../template/assets/js/dashboard.js"></script>
  <!-- End custom js for this page -->

  <script src="index.js"></script>
  <script defer src="./dataFetch/dataFetch.js"></script>
  <script defer src="killSession.js"></script>
</body>

</html>
HTML;

echo $home;