<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>ThunderSC Admin</title>
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
      <div class="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <a class="sidebar-brand brand-logo" href="index.html">ThunderSC Cloud</a>
      </div>
      <ul class="nav">

        <li class="nav-item menu-items">
          <a class="nav-link" data-toggle="collapse" href="#MenuMolinoSilo" aria-expanded="false" aria-controls="auth">
            <span class="menu-title">Creacion</span>
            <i class="menu-arrow"></i>
          </a>
          <div class="collapse" id="MenuMolinoSilo">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <a class="nav-link" data-url="./adduser/adduser.php" id="Crear Usuarios" onclick="addTab('Crear Usuarios')">Crear Usuarios</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-url="" id="Generar Modulos" onclick="addTab('Generar Modulos')">Generar Modulos</a>
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
        <div class="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
          <a class="navbar-brand brand-logo-mini" href="index.html"><img src="../template/assets/images/logo-mini.svg" alt="logo" /></a>
        </div>
        <div class="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <span class="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
      <!-- partial -->
      <div class="main-panel">
        <div class="content-wrapper">

          <div class="row" id="tab-bar">

            <div class="col-1 body-tab" style="margin-left: 20px;">
              <button class="brn-tab-delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill tab-delete" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"></path>
                </svg>
              </button>
              <a class="link-tab" href="#tab-content-1">w2</a>
            </div>

          </div>

          <div class="tabs">
            <div class="tab-container" id="tab-container">

              <div id="tab-content-1" class="tab">
                <div class="tab-content">
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

  <script src="admin.js"></script>
</body>

</html>