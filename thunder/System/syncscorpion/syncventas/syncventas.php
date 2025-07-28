<?php

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

if (!verifyPermiss("syncventas-sync-scorpion")) {
  /* echo "<script>
  if (window.self === window.top) {
    header('Location: ../../index.php');
  } </script>"; */
  /* 
  echo "<script>window.location.href = '../../../../thundercloud/system/inventariosistemas/historial/panel.php'</script>";
   */
  exit();
}

$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>ThunderSC</title>

  <!-- AG Grid CSS (Estilos) -->
  <link rel="stylesheet" href="../../../template/node_modules/ag-grid-community/styles/ag-grid.css" />
  <link rel="stylesheet" href="../../../template/node_modules/ag-grid-community/styles/ag-theme-alpine.css" />

  <script src="../../../template/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  <script src="../../../template/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
  <!-- plugins:css -->
  <link rel="stylesheet" href="../../../template/assets/vendors/mdi/css/materialdesignicons.min.css" />
  <link rel="stylesheet" href="../../../template/assets/vendors/css/vendor.bundle.base.css" />
  <!-- endinject -->
  <!-- Plugin css for this page -->
  <link rel="stylesheet" href="../../../template/assets/vendors/jvectormap/jquery-jvectormap.css" />
  <link rel="stylesheet" href="../../../template/assets/vendors/flag-icon-css/css/flag-icon.min.css" />
  <link rel="stylesheet" href="../../../template/assets/vendors/owl-carousel-2/owl.carousel.min.css" />
  <link rel="stylesheet" href="../../../template/assets/vendors/owl-carousel-2/owl.theme.default.min.css" />
  <link rel="stylesheet" href="../../../template/assets//vendors/select2/select2.min.css">
  <!-- End plugin css for this page -->
  <!-- inject:css -->
  <!-- endinject -->
  <!-- Layout styles -->
  <link rel="stylesheet" href="../../../template/assets/css/style.css" />
  <link rel="stylesheet" href="../../../template/assets/css/styleArea.css" />
  <link rel="stylesheet" href="./syncventas.css" />
  <!-- End layout styles -->
  <link rel="shortcut icon" href="../../../template/assets/images/LogoThunderO.png" />
</head>

<body>
  <div class="container-scroller">
    <!-- partial:partials/_sidebar.html -->
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="box-form bordes_redondeados shadow select-area" id="select-area">

        <div class="container-c-g">

          <div id="divFormato">
            <p class="label-c-g">Almacen:</p>
            <select class="select col-md-2" name="materia" tabindex="-1" aria-hidden="true" id="comboFormato">
              <option value="0">Todos</option>
            </select>
          </div>

          <div id="divFechaR">
            <p class="label-c-g">Fecha de Consulta:</p>
            <input type="date" class="form_input bordes_redondeados input-area" name="f_registro" id="f_registro" />
          </div>
          
        </div>

        <div class="container-c-g container-button">
          <button class="bordes_redondeados shadow btn_consult btn" id="btn_Add">
            Sincronizar
          </button>
        </div>

      </div>
    </nav>
    <!-- partial -->
    <div class="container-fluid page-body-wrapper">
      <!-- partial:partials/_navbar.html -->
      <nav class="navbar p-0 fixed-top d-flex flex-row">
        <!-- <div class="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
          <a class="navbar-brand brand-logo-mini" href="index.html"><img src="../../../template/assets/images/logo-mini.svg" alt="logo" /></a>
        </div> -->
        <div class="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <svg id="menuOUT" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill arrow-icon" viewBox="0 0 16 16">
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
            <svg id="menuIN" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill arrow-icon" viewBox="0 0 16 16">
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </button>
        </div>
      </nav>
      <!-- partial -->
      <div class="main-panel">
        <div class="content-wrapper">

        <div class="row">

            <div class="col-md-12 grid-margin stretch-card" id="CardEquipo" >
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaSeven" style="height: 85vh">
                          
                        <div id="Content-loading">
                          <h2>Sincronizando Ventas...</h2>
                          <div class="wrapper">
                            <div class="space">
                              <div class="loading"></div>
                            </div>
                          </div>
                        </div>

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
  <script src="../../../template/assets/vendors/js/vendor.bundle.base.js"></script>
  <!-- endinject -->
  <!-- Plugin js for this page -->
  <script src="../../../template/assets/vendors/chart.js/Chart.min.js"></script>
  <script src="../../../template/assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
  <script src="../../../template/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
  <script src="../../../template/assets/vendors/owl-carousel-2/owl.carousel.min.js"></script>
  <script src="../../../template/assets/vendors/select2/select2.min.js"></script>
  <!-- End plugin js for this page -->
  <!-- inject:js -->
  <script src="../../../template/assets/js/off-canvas.js"></script>
  <script src="../../../template/assets/js/hoverable-collapse.js"></script>
  <script src="../../../template/assets/js/misc.js"></script>
  <script src="../../../template/assets/js/settings.js"></script>
  <script src="../../../template/assets/js/todolist.js"></script>
  <!-- endinject -->
  <!-- Custom js for this page -->

  <script defer src="../../dataFetch/dataFetch.js"></script>
  <script defer src="../../../template/assets/js/dashboard.js"></script>
  <script defer src="../../../template/node_modules/ag-grid-community/dist/ag-grid-community.min.js"></script>
  <script defer src="../../../template/assets/js/setTable.js"></script>
  <script defer src="../../../template/assets/js/menuIN-OUT.js"></script>
  <script defer src="../../sweetAlert2/sweetAlert.js"></script>
  <script defer src="./syncventas.js"></script>
  <script defer src="../../setCombos/setCombos.js"></script>
  
  <!-- End custom js for this page -->
</body>

</html>
HTML;
echo $home;