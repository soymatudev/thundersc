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

if (!verifyPermiss("historial-inv-sis")) {
  //header("Location: ../../index.php");
  exit();
}

$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>ThunderSC Admin</title>

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
            <p class="label-c-g">Agregar:</p>
            <select class="select col-md-2" name="materia" tabindex="-1" aria-hidden="true" id="comboFormato">
              <option value="0">Hardware</option>
              <option value="1">Asignatario</option>
              <option value="2">Equipo</option>
              <option value="3">Marca</option>
              <option value="4">Area</option>
              <option value="5">Almacen</option>
              <option value="6">Zona</option>
            </select>
          </div>

          <div id="divNumserie">
            <p class="label-c-g">Numero de Serie:</p>
            <input type="text" class="form_input bordes_redondeados input-area" name="numserie" id="numserie" />
          </div>

          <div id="divModelo">
            <p class="label-c-g">Modelo:</p>
            <input type="text" class="form_input bordes_redondeados input-area" name="modelo" id="modelo" />
          </div>

          <div id="divComboClasificacion">
            <p class="label-c-g">Equipo:</p>
            <select class="select col-md-2" tabindex="-1" aria-hidden="true" id="comboClasif">
            </select>
          </div>

          <div id="divComboMarca">
            <p class="label-c-g">Marca:</p>
            <select class="select col-md-2" tabindex="-1" aria-hidden="true" id="comboMarca">
            </select>
          </div>

          <div id="divComboArea">
            <p class="label-c-g">Area:</p>
            <select class="select col-md-2" tabindex="-1" aria-hidden="true" id="comboArea">
            </select>
          </div>

          <div id="divComboAlmacen">
            <p class="label-c-g">Almacen:</p>
            <select class="select col-md-2" tabindex="-1" aria-hidden="true" id="comboAlmacen">
            </select>
          </div>

          <div id="divComboAsignatario">
            <p class="label-c-g">Asignatario:</p>
            <select class="select col-md-2" tabindex="-1" aria-hidden="true" id="comboAsignatario">
            </select>
          </div>

          <div id="divFechaInicio">
            <p class="label-c-g">Fecha de Inicio:</p>
            <input type="date" class="form_input bordes_redondeados input-area" name="f_Ini" id="f_Ini" />
          </div>

          <div id="divFechaFin">
            <p class="label-c-g">Fecha de Fin:</p>
            <input type="date" class="form_input bordes_redondeados input-area" name="f_Fin" id="f_Fin" />
          </div>

          <div id="divNombre">
            <p class="label-c-g">Nombre:</p>
            <input type="text" class="form_input bordes_redondeados input-area" name="nombre" id="nombre" />
          </div>

          <div id="divApellidos">
            <p class="label-c-g">Apellidos:</p>
            <input type="text" class="form_input bordes_redondeados input-area" name="apellidos" id="apellidos" />
          </div>

          <div id="divCVE">
            <p class="label-c-g">Cve:</p>
            <input type="text" class="form_input bordes_redondeados input-area" name="nombre" id="cve" />
          </div>

          <div id="divComboZona">
            <p class="label-c-g">Zona:</p>
            <select class="select col-md-2" tabindex="-1" aria-hidden="true" id="comboZona">
            </select>
          </div>

          <!-- <div class="container-input" id="divFile">
            <input type="file" name="file-2" id="file-2" class="inputfile inputfile-2" data-multiple-caption="{count} archivos seleccionados" multiple />
            <label for="file-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="iborrainputfile" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
            <span class="iborrainputfile">Subir Fotografia</span>
            </label>
          </div> -->
          
        </div>

        <div class="container-c-g container-button">
          <button class="bordes_redondeados shadow btn_consult btn" id="btn_Buscar">
            Buscar
          </button>
          <button class="bordes_redondeados shadow btn_consult btn" id="btn_Descargar">
            <!-- Descargar -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-down-fill" viewBox="0 0 16 16">
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0"/>
            </svg>
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
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4 grid-margin stretch-card" id="CardAsignatario" >
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaOne" style="height: 45vh">
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4 grid-margin stretch-card" id="CardClasificacion" >
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaTwo" style="height: 45vh">
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4 grid-margin stretch-card" id="CardMarca" >
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaThree" style="height: 45vh">
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4 grid-margin stretch-card" id="CardArea" >
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaFour" style="height: 45vh">
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4 grid-margin stretch-card" id="CardZona" >
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaFive" style="height: 45vh">
                          <!-- Aqui se genera un grid -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4 grid-margin stretch-card" id="CardCedis" >
              <div class="card">
                <div class="card-body">
                  <div class="container-zone">
                    <div class="work-zone d-flex">
                      <div class="container-grid">
                        <div class="grid ag-theme-quartz-dark" id="container-tablaSix" style="height: 45vh">
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
  <script defer src="../../inputFile/inputFile.js"></script>
  <script defer src="../../../template/assets/js/dashboard.js"></script>
  <script defer src="../../../template/node_modules/ag-grid-community/dist/ag-grid-community.min.js"></script>
  <script defer src="../../../template/assets/js/setTable.js"></script>
  <script defer src="../../../template/assets/js/menuIN-OUT.js"></script>
  <script defer src="../../sweetAlert2/sweetAlert.js"></script>
  <script defer src="./historial.js"></script>
  <script defer src="../../setCombos/setCombos.js"></script>
  
  <!-- End custom js for this page -->
</body>

</html>
HTML;
echo $home;