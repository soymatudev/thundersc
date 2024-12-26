<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 21/11/2024
ruta: thundersc/thundercloud/Admin/Login/LoginService.php
===============================================================================*/

require_once('../../System/Connection/ConnectionADM.php');
require_once('../../Config/Config.php');
require_once('../../ReturnEvent/ReturnEvent.php');
require_once('../../System/Connection/Statement.php');
require_once('../../ThunderLog/ThunderLog.php');

class LoginService {
    private $connadm = null;
    private $thunderlog = null;
  
    public function __construct() {
      $this->connadm = (new ConnectionADM(__DIR__))->connect();
      $this->thunderlog = new Log(__DIR__);
    }

    public function getUsuarioxClave($uu, $cc, $username, $pass) {
        try {
            if (!$this->connadm) {
                $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
                return null;
            }

            $query = "SELECT a.clave, a.descri, a.username, a.pass FROM ma_usu a WHERE a.username = :username";
            $stmt = new Statement($this->connadm, (__DIR__));
            $res = $stmt->prepareStatement($query);
         
            if($res) {
                $res->bindParam(':username', $username, PDO::PARAM_STR);
                $result = $stmt->executePreparedQuery($res);
                if($result !== false && count($result) > 0) {
                    $result[0]['pass'] = base64_decode($result[0]['pass']);

                    if (password_verify($pass, $result[0]["pass"]) ) {
                        $this->getPermisos($result[0]['clave'], $result[0]['descri'], $result[0]['username'], $result[0]['pass']);
                    } else {
                        $this->thunderlog->writeLog("Login Incorrecto");
                        ReturnEvent::returnResponse(1, "Login Incorrecto", "Login Incorrecto");
                    }

                } else {
                    $this->thunderlog->writeLog("Execute => Incorrect");
                    ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
                }
            } else {
                $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
                ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
            }
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error en getUsuario => " . $e->getMessage());
            ReturnEvent::returnResponse(1, "Error en getUsuario", $e->getMessage());
        }
    }

    public function getPermisos($cve_usu, $descri, $username, $pass) {
        try {
            if (!$this->connadm) {
                $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
                return null;
            }
            $privateKey = openssl_pkey_get_private(file_get_contents('../ssl/thundersc_Key_privada.pem'));

            /* $query = "SELECT a.cve_usu, a.cve_permi, d.descri as permiso, a.cve_empre, b.descri, b.username
            from ma_usuper a, ma_usu b, ma_modu c, ma_permi d, empresa e 
            where 
            a.cve_usu = b.clave 
            and a.cve_permi = d.clave
            and d.cve_modu = c.clave
            and a.cve_empre = e.clave
            and b.username = :username 
            and a.cve_usu = :cve_usu"; */

            $query = "SELECT 
            --a.cve_usu, 
            c.clave AS cve_modu, 
            STRING_AGG(d.descri, '-' ORDER BY a.cve_permi) AS permisos, 
            a.cve_empre
            --b.descri, 
            --b.username
            FROM ma_usuper a, ma_usu b, ma_permi d, ma_modu c, empresa e
            WHERE a.cve_usu = b.clave
            and a.cve_permi = d.clave
            and c.clave = d.cve_modu
            and a.cve_empre = e.clave
            and b.username = :username 
            and a.cve_usu = :cve_usu
            GROUP BY a.cve_usu, c.clave, a.cve_empre, b.descri, b.username
            ORDER BY a.cve_usu, c.clave
            ";

            $stmt = new Statement($this->connadm, (__DIR__));
            $res = $stmt->prepareStatement($query);
            $res->bindParam(':username', $username, PDO::PARAM_STR);
            $res->bindParam(':cve_usu', $cve_usu, PDO::PARAM_INT);
            $resultPermisos = $stmt->executePreparedQuery($res);

            if($resultPermisos !== false && count($resultPermisos) > 0) {
                
                $result[0] = [
                    "cve_usu" => $cve_usu,
                    "descri" => $descri,
                    "username" => $username,
                    "pass" => $pass,
                ];

                $result[1] = $resultPermisos;
                $result[2] = $this->getMenu($cve_usu, $descri, $username, $pass, $resultPermisos);
                $this->thunderlog->writeLog("Execute => Correct => Login Correcto");
                $this->setSession($result);
            } else {
                $this->thunderlog->writeLog("Execute => Incorrect => Consulta de permisos invalida");
                ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
            }
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error en getUsuario => " . $e->getMessage());
            ReturnEvent::returnResponse(1, "Error en getUsuario", $e->getMessage());
        }
    }

    public function getMenu($cve_usu, $descri, $username, $pass, $permisos) {
        try {
            if (!$this->connadm) {
                $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
                return null;
            }

            $queryMenu = "SELECT e.clave as cve_empre, c.clave as cve_modu, c.descri, c.ruta, c.menu
            from ma_usuper a, ma_usu b, ma_modu c, ma_permi d, empresa e 
            where 
            a.cve_usu = b.clave 
            and a.cve_permi = d.clave
            and d.cve_modu = c.clave
            and a.cve_empre = e.clave
            and b.username = :username 
            and a.cve_usu = :cve_usu
            group by 2,1";

            $stmt = new Statement($this->connadm, (__DIR__));
            $resMenu = $stmt->prepareStatement($queryMenu);
            $resMenu->bindParam(':username', $username, PDO::PARAM_STR);
            $resMenu->bindParam(':cve_usu', $cve_usu, PDO::PARAM_INT);
            $resultMenu = $stmt->executePreparedQuery($resMenu);


            $arrPermisos = [];

            if($resultMenu !== false && count($resultMenu) > 0) {
                for($x = 0; $x < count($resultMenu); $x++) {
                    $permi = "";
                    foreach($permisos as $permiso) {
                        if(trim($permiso['cve_modu']) == trim($resultMenu[$x]['cve_modu']) && trim($permiso['cve_empre']) == trim($resultMenu[$x]['cve_empre'])) {
                            $permi = $permiso['permisos'];
                        }
                    }

                    $arrPermisos[trim($resultMenu[$x]['cve_empre'])][] = [
                        "cve_empre" => $resultMenu[$x]['cve_empre'],
                        "cve_modu" => $resultMenu[$x]['cve_modu'],
                        "descri" => $resultMenu[$x]['descri'],
                        "ruta" => $resultMenu[$x]['ruta'],
                        "menu" => $resultMenu[$x]['menu'],
                        "permi" => $permi,
                    ];
                }

                return $arrPermisos;
            } else {
                $this->thunderlog->writeLog("Execute => Incorrect => Consulta de permisos invalida");
                ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
            }
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error en getUsuario => " . $e->getMessage());
            ReturnEvent::returnResponse(1, "Error en getUsuario", $e->getMessage());
        }
    }

    public function setSession ($infoUsuario) {
        session_start();
        $_SESSION['username'] = $infoUsuario[0]['username'];
        $_SESSION['usrdescri'] = $infoUsuario[0]['descri'];
        $_SESSION['cve_usu'] = $infoUsuario[0]['cve_usu'];
        $_SESSION['permisos'] = $infoUsuario[1];
        $_SESSION['menu'] = $infoUsuario[2];
        $_SESSION['empresaActual'] = array_key_first($infoUsuario[2]);
        $_SESSION['tiempo_login'] = time();
        //$_SESSION['tiempoMax'] = $_SESSION['tiempo'] + 600;

        $this->thunderlog->writeLog("Session => " . print_r($_SESSION, true));
        ReturnEvent::returnResponse(0, "Login Correcto", $_SESSION);
    }
  
  }
  
  function main() {
      try {
          // Leer el cuerpo de la solicitud
          $contenido = file_get_contents("php://input");
          $data = json_decode($contenido, true);
          $modulosService = new LoginService();
          $func = $data['function'];
          $modulosService->$func($data['uu'],$data['cc'],...$data['args']);
      } catch (Exception $e) {
          $thunderlog = new Log(__DIR__);
          $thunderlog->writeLog("Error in main => " . $e->getMessage());
      }
  }
  
  main();
