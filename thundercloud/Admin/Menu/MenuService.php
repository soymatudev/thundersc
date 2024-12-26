<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 21/11/2024
ruta: thundersc/thundercloud/Admin/Login/LoginService.php
===============================================================================*/
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once('../../System/Connection/ConnectionADM.php');
require_once('../../Config/Config.php');
require_once('../../ReturnEvent/ReturnEvent.php');
require_once('../../System/Connection/Statement.php');
require_once('../../ThunderLog/ThunderLog.php');

class MenuService {
    private $connadm = null;
    private $thunderlog = null;
  
    public function __construct() {
      $this->connadm = (new ConnectionADM(__DIR__))->connect();
      $this->thunderlog = new Log(__DIR__);
    }

    public function getUsuarioxClave($uu, $cc, $username, $pass) {
        try {
            
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error en getUsuario => " . $e->getMessage());
            ReturnEvent::returnResponse(1, "Error en getUsuario", $e->getMessage());
        }
    }

    function getMenuxEmpresa($uu, $cc, $empresaKey) {
        $data = $_SESSION['menu'];
        $_SESSION['empresaActual'] = $empresaKey;
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
        //return ;
        ReturnEvent::returnResponse(0, "Menu generado", $this->buildMenuHTML($menuTree,$empresaKey));
      }
    
    function buildMenuHTML($menuTree, $empresaKey) {
        $html = '<ul class="nav" id="menuxusuario">';
        foreach ($menuTree as $key => $value) {
            if ($key === '__modules') {
                // Generar enlaces para los módulos
                foreach ($value as $module) {
                    $html .= '<li class="nav-item">';
                    $html .= '<a class="nav-link" data-empresa="'. htmlspecialchars($empresaKey) .'" data-url="../' . htmlspecialchars(trim($module['ruta'])) . '?tpmId='. htmlspecialchars(base64_encode(trim($module['permi']))) . '" id="' . htmlspecialchars(trim($module['descri'])) . '" onclick="addTab(\'' . htmlspecialchars(trim($module['descri'])) . '\')">';
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
                $html .= $this->buildMenuHTML($value,$empresaKey);
                $html .= '</ul></div></li>';
            }
        }
        $html .= '</ul>';

        return $html;
    } 
    
    function generateMenuEmpresas($data) {
        $html = '<nav class="nav-empresas"><ul class="navigation">';
        foreach ($data as $key => $value) {
            $html .= '<li><a href="#">' . htmlspecialchars($key) . '</a></li>';
        }
        $html .= '</ul></nav>';

        return $html;
    }

  }
  
  function main() {
      try {
          // Leer el cuerpo de la solicitud
          $contenido = file_get_contents("php://input");
          $data = json_decode($contenido, true);
          $modulosService = new MenuService();
          $func = $data['function'];
          $modulosService->$func($data['uu'],$data['cc'],...$data['args']);
      } catch (Exception $e) {
          $thunderlog = new Log(__DIR__);
          $thunderlog->writeLog("Error in main => " . $e->getMessage());
      }
  }
  
  main();
