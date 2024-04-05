<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>ThunderSC Admin</title>

  <script src="
  https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js
  "></script>





  <!-- AG Grid CSS (Estilos) -->
  <link rel="stylesheet" href="/thunder/template/node_modules/ag-grid-community/styles/ag-grid.css" />
  <link rel="stylesheet" href="/thunder/template/node_modules/ag-grid-community/styles/ag-theme-alpine.css" />

  <script src="/thunder/template/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  <script src="/thunder/template/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
  <!-- plugins:css -->
  <link rel="stylesheet" href="/thunder/template/assets/vendors/mdi/css/materialdesignicons.min.css" />
  <link rel="stylesheet" href="/thunder/template/assets/vendors/css/vendor.bundle.base.css" />
  <!-- endinject -->
  <!-- Plugin css for this page -->
  <link rel="stylesheet" href="/thunder/template/assets/vendors/jvectormap/jquery-jvectormap.css" />
  <link rel="stylesheet" href="/thunder/template/assets/vendors/flag-icon-css/css/flag-icon.min.css" />
  <link rel="stylesheet" href="/thunder/template/assets/vendors/owl-carousel-2/owl.carousel.min.css" />
  <link rel="stylesheet" href="/thunder/template/assets/vendors/owl-carousel-2/owl.theme.default.min.css" />
  <!-- End plugin css for this page -->
  <!-- inject:css -->
  <!-- endinject -->
  <!-- Layout styles -->
  <link rel="stylesheet" href="/thunder/template/assets/css/style.css" />
  <link rel="stylesheet" href="/thunder/template/assets/css/styleArea.css" />
  <!-- End layout styles -->
  <link rel="shortcut icon" href="/thunder/template/assets/images/favicon.png" />
</head>

<body>
  <div class="container-scroller">
    <!-- partial:partials/_sidebar.html -->
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="box-form bordes_redondeados shadow select-area" id="select-area">

        <div class="container-c-g">
          <p class="label-c-g">cedis:</p>
          <select class="select col-md-2" name="materia" tabindex="-1" aria-hidden="true" id="comboCedis">
            <option data-select2-id="1"></option>
          </select>

          <p class="label-c-g">Grupo:</p>
          <select class="select col-md-2" name="materia" tabindex="-1" aria-hidden="true" id="comboGrupo">
            <option data-select2-id="1"></option>
          </select>

          <p class="label-c-g">Equipo:</p>
          <select class="select col-md-2" name="materia" tabindex="-1" aria-hidden="true" id="comboEquipo">
            <option data-select2-id="1"></option>
          </select>

          <p class="label-c-g">F.Inicial:</p>
          <input type="date" class="form_input bordes_redondeados input-area" name="f_inicial" id="f_inicial" />

          <p class="label-c-g">F.Final:</p>
          <input type="date" class="form_input bordes_redondeados input-area" name="f_final" id="f_final" />

        </div>

        <!--  <div class="container-c-g">
          <p class="label-c-g">Lote:</p>
          <input type="text" class="form_input bordes_redondeados input-area" name="lote" id="inputLote" />
        </div>
        <div class="container-c-g">
          <p class="label-c-g">Archivo:</p>
          <input type="file" class="btn-file" id="file" name="file" />
        </div> -->

        <div class="container-c-g container-button">
          <button class="bordes_redondeados shadow btn_consult btn" id="btn_consult">
            Agregar
          </button>
        </div>
      </div>
    </nav>
    <!-- partial -->
    <div class="container-fluid page-body-wrapper">
      <!-- partial:partials/_navbar.html -->
      <nav class="navbar p-0 fixed-top d-flex flex-row">
        <div class="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
          <a class="navbar-brand brand-logo-mini" href="index.html"><img src="/thunder/template/assets/images/logo-mini.svg" alt="logo" /></a>
        </div>
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

            <div class="col-md-12 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaOne" style="height: 400px">
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="row">

            <div class="col-md-6 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaTwo" style="height: 430px">
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaThree" style="height: 430px">
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
        <!-- partial:partials/_footer.html -->
        <!-- <footer class="footer">
            <div class="d-sm-flex justify-content-center justify-content-sm-between">
              <span class="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © Derechos reservador - PCZ 2024</span>
            </div>
          </footer> -->
        <!-- partial -->
      </div>
      <!-- main-panel ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
  <!-- container-scroller -->
  <!-- plugins:js -->
  <script src="/thunder/template/assets/vendors/js/vendor.bundle.base.js"></script>
  <!-- endinject -->
  <!-- Plugin js for this page -->
  <script src="/thunder/template/assets/vendors/chart.js/Chart.min.js"></script>
  <script src="/thunder/template/assets/vendors/progressbar.js/progressbar.min.js"></script>
  <script src="/thunder/template/assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
  <script src="/thunder/template/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
  <script src="/thunder/template/assets/vendors/owl-carousel-2/owl.carousel.min.js"></script>
  <!-- End plugin js for this page -->
  <!-- inject:js -->
  <script src="/thunder/template/assets/js/off-canvas.js"></script>
  <script src="/thunder/template/assets/js/hoverable-collapse.js"></script>
  <script src="/thunder/template/assets/js/misc.js"></script>
  <script src="/thunder/template/assets/js/settings.js"></script>
  <script src="/thunder/template/assets/js/todolist.js"></script>
  <!-- endinject -->
  <!-- Custom js for this page -->

  <script defer src="../../dataFetch/dataFetch.js"></script>
  <script defer src="/thunder/template/assets/js/dashboard.js"></script>
  <script defer src="/thunder/template/node_modules/ag-grid-community/dist/ag-grid-community.min.js"></script>
  <script defer src="/thunder/template/assets/js/setTable.js"></script>
  <script defer src="../sweetAlert2/sweetAlert.js"></script>
  <script defer src="./datatable.js"></script>
  <script defer src="./createChart.js" ></script>
  <Script defer src="../dashboards-ms/createChart.js"></Script>
  <script defer src="../../setCombos/setCombos.js"></script>
  <script defer src="/thunder/template/assets/js/menuIN-OUT.js"></script>

  <!-- End custom js for this page -->
</body>

</html>