<?php
/*===============================================================================
Autor: Juan Maturana
Fecha de Creación: 10/04/2023
ruta: /thundersc/thunder/admin/logP.php
===============================================================================*/

$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>ThunderSC</title>

  <link rel="stylesheet" href="../../template/assets/vendors/mdi/css/materialdesignicons.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/css/vendor.bundle.base.css" />
  <script src="../../template/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>

  <link rel="stylesheet" href="../../template/assets/vendors/jvectormap/jquery-jvectormap.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/flag-icon-css/css/flag-icon.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/owl-carousel-2/owl.carousel.min.css" />
  <link rel="stylesheet" href="../../template/assets/vendors/owl-carousel-2/owl.theme.default.min.css" />

  <link rel="stylesheet" href="../../template/assets/css/styleMenu.css" />

  <link rel="shortcut icon" href="../../template/assets/images/LogoThunderO.png" />
</head>

<body>
  <div class="container-scroller">
    <div class="container-fluid page-body-wrapper full-page-wrapper">
      <div class="row w-100 m-0">
        <div class="content-wrapper full-page-wrapper d-flex align-items-center auth login-bg">
          <div class="card col-lg-4 mx-auto card-login">
            <div class="card-body px-5 py-5">
              <h3 class="card-title text-left mb-3">Login</h3>

              <form>
                <div class="form-group">
                  <label>Nombre de Usuario *</label>
                  <input type="text" class="form-control p_input" id="input-username" onkeydown="if(event.keyCode==13) document.getElementById('input-password').focus()">
                </div>
                <div class="form-group">
                  <label>Constrasena *</label>
                  <input type="password" class="form-control p_input" id="input-password" onkeydown="if(event.keyCode==13) document.getElementById('btn-login').focus()">
                </div>

                <div class="text-center">
                  <button id="btn-login" type="button" class="btn btn-primary btn-block enter-btn">Login</button>
                </div>
                <!-- <button id="btn-login" type="button">login</button> -->
                <!-- <p class="sign-up">Si aun no tienes cuenta, puedes mandar una solicitud a<a href="#"> Sistemas</a></p> -->
              </form>

            </div>
          </div>
        </div>

      </div>

    </div>

  </div>

  <script defer src="../../template/assets/vendors/js/vendor.bundle.base.js"></script>
  <script defer src="../../Bridge/Bridge.js"></script>
  
  <script defer src="../../template/assets/js/off-canvas.js"></script>
  <script defer src="../../template/assets/js/hoverable-collapse.js"></script>
  <script defer src="../../template/assets/js/misc.js"></script>
  <script defer src="../../template/assets/js/settings.js"></script>
  <script defer src="../../template/assets/js/todolist.js"></script>
  <script defer src="./Login.js"></script>
  
  <!-- endinject -->

</body>

</html>
HTML;

echo $home;