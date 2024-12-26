<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 20/11/2024
ruta: thundersc/thundercloud/Admin/Modulos/ModulosService.php
===============================================================================*/

require_once('../../System/Connection/ConnectionADM.php');
//require_once('../../System/Connection/Connection.php');
require_once('../../ReturnEvent/ReturnEvent.php');
require_once('../../System/Connection/Statement.php');
require_once('../../ThunderLog/ThunderLog.php');

class ModulosService {
  private $connadm = null;
  private $conn = null;
  private $thunderlog = null;

  public function __construct() {
    $this->connadm = (new ConnectionADM(__DIR__))->connect();
    //$this->conn = Connection::connect();
    $this->thunderlog = new Log(__DIR__);
  }

  public function saveModu($uu, $cc, $nombre, $ruta, $menu, $permisos) {
    try {
        if (!$this->connadm) {
            $this->thunderlog->writeLog("Error de conexión" . $this->connadm);
            return null;
        }

        $stmt = new Statement($this->connadm, (__DIR__));
        $this->connadm->beginTransaction();
        
        $this->thunderlog->writeLog("Insertanbdo Modulo");
        $stmt = $this->connadm->prepare("INSERT into ma_modu(descri, ruta, menu) values(:descri, :ruta, :menu)");
        $stmt->execute([
            ':descri' => $nombre,
            ':ruta' => $ruta,
            ':menu' => $menu
        ]);

        //$stmt = $this->connadm->prepare("SELECT max(clave) as cod FROM ma_modu");
        $this->thunderlog->writeLog("Obteniendo el ultimo cve");
        $lastcve = $this->connadm->lastInsertId('ma_modu_clave_seq');

        $this->thunderlog->writeLog("Insertando Permisos");
        foreach ($permisos as $permiso) {
            $stmt = $this->connadm->prepare("INSERT into ma_permi(cve_modu, descri) values(:cve_modu, :cve_perm)");
            $stmt->execute([
                ':cve_modu' => $lastcve,
                ':cve_perm' => $permiso
            ]);
        }

        $success = $this->connadm->commit();
        if($success) {
            $this->thunderlog->writeLog("Execute => Correct => Modulo Guardado");
            ReturnEvent::returnResponse(0, "Modulo Guardado con Exito");
        } else {
            $this->thunderlog->writeLog("Execute => Incorrect => Modulo No Guardado");
            ReturnEvent::returnResponse(1, "Modulo No Guardado");
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
        $modulosService = new ModulosService();
        $func = $data['function'];
        $modulosService->$func($data['uu'],$data['cc'],...$data['args']);
    } catch (Exception $e) {
        $thunderlog = new Log(__DIR__);
        $thunderlog->writeLog("Error in main => " . $e->getMessage());
    }
}

main();