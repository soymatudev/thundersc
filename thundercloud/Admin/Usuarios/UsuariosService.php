<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 20/11/2024
ruta: thundersc/thundercloud/Admin/Modulos/ModulosService.php
===============================================================================*/

require_once('../../System/Connection/ConnectionADM.php');
require_once('../../Config/Config.php');
//require_once('../../System/Connection/Connection.php');
require_once('../../ReturnEvent/ReturnEvent.php');
require_once('../../System/Connection/Statement.php');
require_once('../../ThunderLog/ThunderLog.php');

class UsuariosService {
  private $connadm = null;
  private $conn = null;
  private $thunderlog = null;

  public function __construct() {
    $this->connadm = (new ConnectionADM(__DIR__))->connect();
    $this->thunderlog = new Log(__DIR__);
  }

  public function getModulos($uu, $cc, $args) {
    try {
        if (!$this->connadm) {
            $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
            return null;
        }
        
        $query = "SELECT clave as clave, descri as nombre, ruta as ruta FROM ma_modu";
        $stmt = new Statement($this->connadm, (__DIR__));
        $res = $stmt->prepareStatement($query);

        if($res) {
            $result = $stmt->executePreparedQuery($res);
            if($result !== false) {
                $this->thunderlog->writeLog("Execute => Correct => Obentenemos las Modulos");
                
                for($x = 0; $x < count($result); $x++) {
                    $result[$x]['clave'] = thunderToUtf8($result[$x]['clave']);
                    $result[$x]['nombre'] = thunderToUtf8($result[$x]['nombre']);
                    $result[$x]['ruta'] = thunderToUtf8($result[$x]['ruta']);
                }
                //"sortable" => true, "filter" => true
                //"type" => "numero", "cellStyle" => ["textAlign"=> "right"],
                $headerGrid = [
                    ["headerName" => "Clave", "field" => "clave", "width" => 80],
                    ["headerName" => "Nombre", "field" => "nombre", "width" => 150],
                    ["headerName" => "Ruta", "field" => "ruta", "width" => 300]
                ];

                array_push($result, $headerGrid);
                ReturnEvent::returnResponse(0, "Modulo Guardado con Exito", $result);
            } else {
                $this->thunderlog->writeLog("Execute => Incorrect");
                ReturnEvent::returnResponse(1, "Error en la consulta");
            }
        } else {
            $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
            ReturnEvent::returnResponse(1, "Error en la consulta");
        }
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error en getModulos => " . $e->getMessage());
        ReturnEvent::returnResponse(1, "Error en getModulos", $e->getMessage());
    }
  }

  public function getPermisosxModulo($uu, $cc, $cve_modu) {
    try {
        if (!$this->connadm) {
            $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
            return null;
        }
        
        $query = "SELECT a.descri as descri, b.clave as cve_permi, b.cve_modu, b.descri as permiso 
                    FROM ma_modu a, ma_permi b WHERE a.clave = b.cve_modu and a.clave = :cve";

        $stmt = new Statement($this->connadm, (__DIR__));
        $res = $stmt->prepareStatement($query);

        if($res) {
            $res->bindParam(':cve', $cve_modu, PDO::PARAM_STR);
            $result = $stmt->executePreparedQuery($res);
            if($result !== false) {
                for($x = 0; $x < count($result); $x++) {
                    $result[$x]['descri'] = thunderToUtf8(trim($result[$x]['descri']));
                    $result[$x]['cve_permi'] = thunderToUtf8(trim($result[$x]['cve_permi']));
                    $result[$x]['cve_modu'] = thunderToUtf8(trim($result[$x]['cve_modu']));
                    $result[$x]['permiso'] = thunderToUtf8(trim($result[$x]['permiso']));
                }
                //$this->thunderlog->writeLog("Datos obtenido => " . print_r($result, true));
                $this->thunderlog->writeLog("Datos obtenido => " . count($result));
                //array_push($result, $headerGrid);
                ReturnEvent::returnResponse(0, "Permisos obtenidos con Exito", $result);
            } else {
                $this->thunderlog->writeLog("Execute => Incorrect");
                ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
            }
        } else {
            $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
            ReturnEvent::returnResponse(1, "Error en la consulta");
        }
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error en getPermisosxModulo => " . $e->getMessage());
        ReturnEvent::returnResponse(1, "Error en getPermisosxModulo", $e->getMessage());
    }
  }

  public function saveUsuario($uu, $cc, $usuario, $descri, $password, $permisos) {
    try {
        if (!$this->connadm) {
            $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
            return null;
        }
        // Encriptar permisos
        $publicKey = openssl_pkey_get_public(file_get_contents('../ssl/thundersc_Key_publica.pem'));
        //$permisos = openssl_public_encrypt($permisos, $encrypted, $publicKey);
        $passHash = password_hash($password, PASSWORD_DEFAULT, ['cost' => 10]);

        $stmt = new Statement($this->connadm, (__DIR__));
        $this->connadm->beginTransaction();
        
        $this->thunderlog->writeLog("Insertando Usuario");
        $stmt = $this->connadm->prepare("INSERT into ma_usu(descri, username, pass) values(:descri, :username, :pass)");
        $stmt->execute([
            ':descri' => $descri,
            ':username' => $usuario,
            ':pass' => base64_encode($passHash)
        ]);

        //$stmt = $this->connadm->prepare("SELECT max(clave) as cod FROM ma_modu");
        $this->thunderlog->writeLog("Obteniendo el ultimo cve");
        $lastcve = $this->connadm->lastInsertId('ma_usu_clave_seq');

        $this->thunderlog->writeLog("Insertando Permisos");
        foreach ($permisos as $permiso) {
            // [0] => Modulo [1] => Permiso [2] => Empresa
            $arrPermiso = explode("-", $permiso);
            $cve_perm = openssl_public_encrypt($arrPermiso[1], $permi_encrypted, $publicKey);
            $cve_empre = openssl_public_encrypt($arrPermiso[2], $empre_encrypted, $publicKey);
            $stmt = $this->connadm->prepare("INSERT into ma_usuper(cve_usu, cve_permi, cve_empre) values(:cve_modu, :cve_permi, :cve_empre)");
            //$stmt = $this->connadm->prepare("INSERT into ma_usuper(cve_usu, cve_permi, cve_empre) values(:cve_modu, '$permi_encrypted', '$empre_encrypted')");
            $stmt->execute([
                ':cve_modu' => $lastcve,
                ':cve_permi' => $arrPermiso[1],
                ':cve_empre' => $arrPermiso[2]
                //':cve_permi' => base64_encode($permi_encrypted),
                //':cve_empre' => base64_encode($empre_encrypted)
            ]);
        }

        $success = $this->connadm->commit();
        $result = ["cve" => $lastcve];
        if($success) {
            $this->thunderlog->writeLog("Execute => Correct => Usuario Guardado");
            ReturnEvent::returnResponse(0, "Usuario Guardado con Exito", $result);
        } else {
            $this->thunderlog->writeLog("Execute => Incorrect => Usuario No Guardado");
            ReturnEvent::returnResponse(1, "Usuario No Guardado", "Usuario No Guardado");
        }
    } catch (Exception $e) {
        $this->connadm->rollBack();
        $this->thunderlog->writeLog("Error in Transaction => " . $e->getMessage());
        ReturnEvent::returnResponse(1, "Error en la Transacción", $e->getMessage());
    }
  }

  public function updateUsuario($uu, $cc, $cve_usu, $usuario, $descri, $password, $permisos) {
    try {
        if (!$this->connadm) {
            $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
            return null;
        }
        $passHash = password_hash($password, PASSWORD_DEFAULT, ['cost' => 10]);

        $stmt = new Statement($this->connadm, (__DIR__));
        $this->connadm->beginTransaction();
        
        $this->thunderlog->writeLog("Actualizando Usuario");
        $qrPass = strlen(trim($password)) > 0 ? ", pass = :pass" : "";
        $stmt = $this->connadm->prepare("update ma_usu set descri = :descri, username = :username $qrPass where clave = :cve_usu");
        
        $arrExec = strlen(trim($password)) > 0 ? [':descri' => $descri, ':username' => $usuario, ':pass' => base64_encode($passHash), ':cve_usu' => $cve_usu] : [':descri' => $descri, ':username' => $usuario, ':cve_usu' => $cve_usu];
        $stmt->execute($arrExec);

        $queryElminarPermisos = "DELETE from ma_usuper where cve_usu = :cve_usu";
        $stmt = $this->connadm->prepare($queryElminarPermisos);
        $stmt->execute([':cve_usu' => $cve_usu]);

        $this->thunderlog->writeLog("Insertando Permisos");
        foreach ($permisos as $permiso) {
            $arrPermiso = explode("-", $permiso);
            $stmt = $this->connadm->prepare("INSERT into ma_usuper(cve_usu, cve_permi, cve_empre) values(:cve_usua, :cve_permi, :cve_empre)");
            $stmt->execute([
                ':cve_usua' => $cve_usu,
                ':cve_permi' => $arrPermiso[1],
                ':cve_empre' => $arrPermiso[2]
            ]);
        }

        $success = $this->connadm->commit();
        if($success) {
            $this->thunderlog->writeLog("Execute => Correct => Usuario Guardado");
            ReturnEvent::returnResponse(0, "Usuario Guardado con Exito", "Usuario Guardado con Exito");
        } else {
            $this->thunderlog->writeLog("Execute => Incorrect => Usuario No Guardado");
            ReturnEvent::returnResponse(1, "Usuario No Guardado", "Usuario No Guardado");
        }
    } catch (Exception $e) {
        $this->connadm->rollBack();
        $this->thunderlog->writeLog("Error in Transaction => " . $e->getMessage());
        ReturnEvent::returnResponse(1, "Error en la Transacción", $e->getMessage());
    }
  }

  public function getUsuarioxClave($uu, $cc, $cve_usu) {
    try {
        if (!$this->connadm) {
            $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
            return null;
        }
        $privateKey = openssl_pkey_get_private(file_get_contents('../ssl/thundersc_Key_privada.pem'));

        $queryGetModulos = "SELECT a.cve_empre, b.cve_modu 
        from ma_usuper a, ma_permi b where a.cve_permi = b.clave and a.cve_usu = :cve_usu
        group by 1,2";
        $this->thunderlog->writeLog("Query => " . $queryGetModulos);
        $stmt = new Statement($this->connadm, (__DIR__));
        $res = $stmt->prepareStatement($queryGetModulos);
        $res->bindParam(':cve_usu', $cve_usu, PDO::PARAM_STR);
        $result = $stmt->executePreparedQuery($res);
        //$this->thunderlog->writeLog("Modulos => " . print_r($result, true));

        $queryPermisosxUsuario = "SELECT b.cve_modu, b.clave, a.cve_empre, b.descri
        from ma_usuper a, ma_permi b where a.cve_permi = b.clave and a.cve_usu = :cve_usu";
        $this->thunderlog->writeLog("Query => " . $queryPermisosxUsuario);
        $stmt = new Statement($this->connadm, (__DIR__));
        $resUsuper = $stmt->prepareStatement($queryPermisosxUsuario);
        $resUsuper->bindParam(':cve_usu', $cve_usu, PDO::PARAM_STR);
        $resultUsuper = $stmt->executePreparedQuery($resUsuper);
        //$this->thunderlog->writeLog("Permisos => " . print_r($resultUsuper, true));


        foreach($resultUsuper as $key => $value) {
            $resultUsuper[$key]['cve_modu'] = thunderToUtf8(trim($value['cve_modu']));
            $resultUsuper[$key]['clave'] = thunderToUtf8(trim($value['clave']));
            $resultUsuper[$key]['cve_empre'] = thunderToUtf8(trim($value['cve_empre']));
            $resultUsuper[$key]['descri'] = thunderToUtf8(trim($value['descri']));
            $resultUsuper[$key]['permi_com'] = thunderToUtf8(trim($value['cve_modu'])) . '-' . thunderToUtf8(trim($value['clave'])) . '-' . thunderToUtf8(trim($value['cve_empre'])) . '-' . thunderToUtf8(trim($value['descri']));
        }

        $permisosxModu = [];

        if($result !== false && $resultUsuper !== false) {
           $this->thunderlog->writeLog("Execute => Correct => Obentenemos las Modulos");
            foreach ($result as $key => $value) {
                $empresa = $value['cve_empre'];
                $queryGetPermisosxModu = "SELECT a.cve_modu, b.descri as modu, a.clave as cve_permi, a.descri as permi
                from ma_permi a, ma_modu b where a.cve_modu = b.clave and cve_modu = :cve_modu";
                $stmt = new Statement($this->connadm, (__DIR__));
                $res = $stmt->prepareStatement($queryGetPermisosxModu);
                $res->bindParam(':cve_modu', $value['cve_modu'], PDO::PARAM_STR);
                $resultPermisos = $stmt->executePreparedQuery($res);

                if($resultPermisos !== false) {
                    for($x = 0; $x < count($resultPermisos); $x++) {
                        $resultPermisos[$x]['permi'] = thunderToUtf8(trim($resultPermisos[$x]['permi']));
                        $resultPermisos[$x]['modu'] = thunderToUtf8(trim($resultPermisos[$x]['modu']));
                        $resultPermisos[$x]['cve_permi'] = thunderToUtf8(trim($resultPermisos[$x]['cve_permi']));
                        $resultPermisos[$x]['cve_modu'] = thunderToUtf8(trim($resultPermisos[$x]['cve_modu']));
                        $resultPermisos[$x]['cve_empre'] = thunderToUtf8(trim($empresa));
                        $resultPermisos[$x]['permi_com'] = thunderToUtf8(trim($resultPermisos[$x]['cve_modu'])) . '-' . thunderToUtf8(trim($resultPermisos[$x]['cve_permi'])) . '-' . thunderToUtf8(trim($empresa)) . '-' . thunderToUtf8(trim($resultPermisos[$x]['permi']));
                        $resultPermisos[$x]['checked'] = 0;
                        foreach($resultUsuper as $key => $value) {
                            if($resultPermisos[$x]['permi_com'] == $value['permi_com'] && $value['cve_empre'] == $resultPermisos[$x]['cve_empre']) {
                                $resultPermisos[$x]['checked'] = 1;
                            } else if ($resultPermisos[$x]['permi_com'] == $value['permi_com'] && $value['cve_empre'] == $resultPermisos[$x]['cve_empre'] && $resultPermisos[$x]['checked'] != 1){
                                $resultPermisos[$x]['checked'] = 0;
                            }
                        }
                    }
                    $permisosxModu[trim($resultPermisos[0]['modu'])."-".trim($empresa)] = $resultPermisos;
                } else {
                    $this->thunderlog->writeLog("Execute => Incorrect");
                    ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
                }
            }

            $arrayResult = [];
            $arrayResult[] = $this->getInfoUsuario($uu, $cc, $cve_usu);
            $arrayResult[] = $permisosxModu;
            //$this->thunderlog->writeLog("Datos obtenido => " . print_r($arrayResult, true));
            ReturnEvent::returnResponse(0, "Permisos obtenidos con Exito", $arrayResult);
        } else {
            $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
            ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error en getUsuario => " . $e->getMessage());
        ReturnEvent::returnResponse(1, "Error en getUsuario", $e->getMessage());
    }
  }

  public function getInfoUsuario($uu, $cc, $cve_usu) {
    try {
        if (!$this->connadm) {
            $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
            return null;
        }
        
        $query = "SELECT descri, username from ma_usu where clave = :cve_usu";
        $stmt = new Statement($this->connadm, (__DIR__));
        $res = $stmt->prepareStatement($query);
        
        if($res){
            $res->bindParam(':cve_usu', $cve_usu, PDO::PARAM_STR);
            $result = $stmt->executePreparedQuery($res);
            $this->thunderlog->writeLog("Query => " . $res->queryString);

            if($result !== false) {
                for($x = 0; $x < count($result); $x++) {
                    $result[$x]['descri'] = thunderToUtf8(trim($result[$x]['descri']));
                    $result[$x]['username'] = thunderToUtf8(trim($result[$x]['username']));
                }
                $this->thunderlog->writeLog("Execute => Correct => Obentenemos las Modulos");
                //$this->thunderlog->writeLog("Datos obtenido => " . print_r($result, true));
                return $result[0];
            } else {
                $this->thunderlog->writeLog("Execute => Incorrect => Usuario No encontrado");
                return null;
            }
        } else {
            $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
            return null;
        }
    } catch (Exception $e) {
        $this->connadm->rollBack();
        $this->thunderlog->writeLog("Error in Transaction => " . $e->getMessage());
        ReturnEvent::returnResponse(1, "Error en la Transacción", $e->getMessage());
    }
  }

}

function main() {
    try {
        // Leer el cuerpo de la solicitud
        $contenido = file_get_contents("php://input");
        $data = json_decode($contenido, true);
        $modulosService = new UsuariosService();
        $func = $data['function'];
        $modulosService->$func($data['uu'],$data['cc'],...$data['args']);
    } catch (Exception $e) {
        $thunderlog = new Log(__DIR__);
        $thunderlog->writeLog("Error in main => " . $e->getMessage());
    }
}

main();