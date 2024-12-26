<?php

  if (session_status() == PHP_SESSION_NONE) {
    session_start();
  }

  if (!isset($_SESSION['username'])) {
   header('Location: ../admin/Login/Login.php');
  }

  function generateMenu($data, $empresaKey) {
    if (!isset($data[$empresaKey])) {
        return '<p>No hay datos para esta empresa.</p>';
    }

    $menuData = $data[$empresaKey];
    $menuTree = [];

    // Construir el árbol jerárquico basado en la clave 'menu'
    foreach ($menuData as $item) {
        $keys = explode('.', trim($item['menu'])); // Divide por jerarquía
        $current = &$menuTree;

        foreach ($keys as $key) {
            if (!isset($current[$key])) {
                $current[$key] = [];
            }
            $current = &$current[$key];
        }

        // Agregar el módulo al nivel actual
        $current['__modules'][] = [
            'descri' => trim($item['descri']),
            'ruta' => trim($item['ruta']),
            'permi' => trim($item['permi'])
        ];
    }

    // Generar HTML recursivamente
    return buildMenuHTML($menuTree, $empresaKey);
  }

function buildMenuHTML($menuTree, $empresaKey) {
    $html = '<ul class="nav" id="menuxusuario">';
    foreach ($menuTree as $key => $value) {
        if ($key === '__modules') {
            // Generar enlaces para los módulos
            foreach ($value as $module) {
                $html .= '<li class="nav-item">';
                $html .= '<a class="nav-link" data-empresa="'. htmlspecialchars($empresaKey) .'" data-url="../' . htmlspecialchars(trim($module['ruta'])) . '?tpmId='. htmlspecialchars(base64_encode(trim($module['permi']))).'" id="' . htmlspecialchars(trim($module['descri'])) . '" onclick="addTab(\'' . htmlspecialchars(trim($module['descri'])) . '\')">';
                $html .= htmlspecialchars($module['descri']);
                $html .= '</a></li>';
            }
        } else {
            // Submenú
            $menuId = str_replace(' ', '', $key);
            $html .= '<li class="nav-item menu-items">';
            $html .= '<a class="nav-link" data-toggle="collapse" href="#' . htmlspecialchars($menuId) . '" aria-expanded="false" aria-controls="auth">';
            $html .= '<span class="menu-title">' . htmlspecialchars($key) . '</span>';
            $html .= '<i class="menu-arrow"></i>';
            $html .= '</a>';
            $html .= '<div class="collapse" id="' . htmlspecialchars($menuId) . '">';
            $html .= '<ul class="nav flex-column sub-menu">';
            $html .= buildMenuHTML($value, $empresaKey);
            $html .= '</ul></div></li>';
        }
    }
    $html .= '</ul>';

    return $html;
} 

function generateMenuEmpresas($data) {
    $html = '<nav class="nav-empresas"><ul class="navigation">';
    foreach ($data as $key => $value) {
      $html .= '<li>';
      $html .= '<a href="#" onclick="menuXEmpresa(\'' . htmlspecialchars($key) . '\')">';
      $html .= htmlspecialchars($key);
      $html .= '</a>';
      $html .= '</li>';
    }
    $html .= '</ul></nav>';

    return $html;
}

if (!function_exists('array_key_first')) {
  function array_key_first(array $arr) {
      foreach($arr as $key => $unused) {
          return $key;
      }
      return NULL;
  }
}

$usr = $_SESSION['username'];
$cve = $_SESSION['cve_usu'];
$menu = json_encode($_SESSION['menu']);
$menuG = generateMenu($_SESSION['menu'], array_key_first($_SESSION['menu']));
$empresaInit = array_key_first($_SESSION['menu']);
$_SESSION['empresaActual'] = $empresaInit;
$menuEmpresas = generateMenuEmpresas($_SESSION['menu']);

$home = <<<HTML
<!DOCTYPE html>
<html lang="es">

<head>

  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>Thunder</title>

  <link rel="stylesheet" href="../template/assets/vendors/mdi/css/materialdesignicons.min.css" />
  <link rel="stylesheet" href="../template/assets/vendors/css/vendor.bundle.base.css" />

  <link rel="stylesheet" href="../template/assets/vendors/jvectormap/jquery-jvectormap.css" />
  <link rel="stylesheet" href="../template/assets/vendors/flag-icon-css/css/flag-icon.min.css" />
  <link rel="stylesheet" href="../template/assets/vendors/owl-carousel-2/owl.carousel.min.css" />
  <link rel="stylesheet" href="../template/assets/vendors/owl-carousel-2/owl.theme.default.min.css" />
  <link rel="stylesheet" href="../template/node_modules/bootstrap-icons/font/bootstrap-icons.min.css">

  <link rel="stylesheet" href="../template/assets/css/styleMenu.css" />

  <link rel="shortcut icon" href="../template/assets/images/LogoThunderO.png" />
</head>

<body class="sidebar-icon-only">
  <div class="container-scroller">

    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <div class="sidebar-brand-wrapper d-flex align-items-center justify-content-center fixed-top">
        <a class="sidebar-brand brand-logo" href="#">$cve - $usr</a>
      </div>
      $menuG
    </nav>

  <input type="checkbox" id="btn-nav">
  $menuEmpresas

    <div class="container-fluid page-body-wrapper">

      <nav class="navbar navbar-w p-0 fixed-top d-flex flex-row">
        <div class="navbar-menu-wrapper flex-grow d-flex">
          <div>
            <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize" id="bt-menubar">
              <img src="../template/assets/images/LogoThunderCube.png" alt="Logo Thunder Cube" class="logo-menu">
              <i class="bi bi-x-lg logo-menu-close"></i>
            </button>
          </div>

          <div class="info-menu">
            <span class="info-empre" id="info-empre">$empresaInit</span>
            <button class="align-self-center" type="button" id="btn-killSession">
              <i class="bi bi-door-open-fill btn-killSession"></i>
            </button>
            
            <label for="btn-nav" class="btn-nav"><i class="bi bi-gear" for="btn-nav"></i></label>
          </div>
        </div>
      </nav>

      <div class="main-panel">
        <div class="content-wrapper">

          <div class="row" id="tab-bar">
                  
            <div class="col-1 body-tab" style="margin-left: 20px;">
              <button class="brn-tab-delete">
                <i class="bi bi-x-circle-fill tab-delete"></i>
              </button>
              <a class="link-tab" href="#tab-content-1">w2</a>
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

    </div>

  </div>

  <script>
    let menu = $menu;
  </script>

  <script src="../template/assets/vendors/js/vendor.bundle.base.js"></script>

  <script src="../template/assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
  <script src="../template/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
  <script src="../template/assets/vendors/owl-carousel-2/owl.carousel.min.js"></script>

  <script src="../template/assets/js/off-canvas.js"></script>
  <script src="../template/assets/js/hoverable-collapse.js"></script>
  <script src="../template/assets/js/misc.js"></script>
  <script src="../template/assets/js/settings.js"></script>
  <script src="../template/assets/js/todolist.js"></script>

  <script src="../template/assets/js/dashboard.js"></script>


  <script src="../Bridge/Bridge.js"></script>
  <script src="index.js"></script>
  <script defer src="./dataFetch/dataFetch.js"></script>
  <script defer src="killSession.js"></script>

  <script>
    $(document).keydown(function (e) {
      e.preventDefault();
      if(e.ctrlKey && e.altKey && e.key == "x") {
        $("#bt-menubar").click();
      }
    });
  </script>

</body>

</html>
HTML;

echo $home;