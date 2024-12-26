<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/system/Inventarios/Catalogos/Empleados/EmpleadosService.php
===============================================================================*/

require_once('../../../Connection/ConnectionADM.php');
require_once('../../../Connection/Connection.php');
require_once('../../../../Config/Config.php');
require_once('../../../../ReturnEvent/ReturnEvent.php');
require_once('../../../Connection/Statement.php');
require_once('../../../../ThunderLog/ThunderLog.php');

class EmpleadosService
{
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->thunderlog = new Log(__DIR__, $uu);
  }

  public function crudSave($uu, $cc, $arrItems)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $this->conn->beginTransaction();
      $this->thunderlog->writeLog("Execute => " . print_r($arrItems, true));

      foreach($arrItems as $item) {
        $stmt = $this->conn->prepare("INSERT into ma_emple(clave, descri, cve_zon) VALUES('', :descri, '')");
        $stmt->bindParam(':descri', $item['descri'], PDO::PARAM_STR);
        $result = $stmt->execute();
        $this->thunderlog->writeLog("Execute => " . print_r($result, true));
      }

      if (true) {
        $res = $this->conn->commit();
        if ($res !== false) {
            $this->thunderlog->writeLog("Execute => Correct => Empleado(s) generado con exito");
            ReturnEvent::returnResponse(0, "Empleado(s) generado con exito", "Empleado(s) generado con exito");
        } else {
          $this->thunderlog->writeLog("Execute => Incorrect");
          ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
      } else {
        $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
        $this->conn->rollBack();
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
      }
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
      $this->conn->rollBack();
    }
  }

  public function crudUpdate($uu, $cc, $cve_emple, $nombre_nuevo) {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $this->conn->beginTransaction();

      $stmt = $this->conn->prepare("UPDATE ma_emple SET descri = :descri WHERE id = :clave");
      $stmt->bindParam(':descri', $nombre_nuevo, PDO::PARAM_STR);
      $stmt->bindParam(':clave', $cve_emple, PDO::PARAM_STR);
      $result = $stmt->execute();
      $this->thunderlog->writeLog("Execute => " . $stmt->queryString);

      if (true) {
        $res = $this->conn->commit();
        if ($res !== false) {
            $this->thunderlog->writeLog("Execute => Correct => Empleado actualizado con exito");
            ReturnEvent::returnResponse(0, "Empleado actualizado con exito", "Empleado actualizado con exito");
        } else {
          $this->thunderlog->writeLog("Execute => Incorrect");
          ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
      } else {
        $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
        $this->conn->rollBack();
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
      }
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
      $this->conn->rollBack();
    }
  }

  public function crudDelete($uu, $cc, $cve_emple) {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $this->conn->beginTransaction();

      $stmt = $this->conn->prepare("DELETE FROM ma_emple WHERE id = :clave");
      $stmt->bindParam(':clave', $cve_emple, PDO::PARAM_STR);
      $result = $stmt->execute();
      $this->thunderlog->writeLog("Execute => " . $stmt->queryString);

      if (true) {
        $res = $this->conn->commit();
        if ($res !== false) {
            $this->thunderlog->writeLog("Execute => Correct => Empleado eliminado con exito");
            ReturnEvent::returnResponse(0, "Empleado eliminado con exito", "Empleado eliminado con exito");
        } else {
          $this->thunderlog->writeLog("Execute => Incorrect");
          ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
      } else {
        $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
        $this->conn->rollBack();
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
      }
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
      $this->conn->rollBack();
    }
  }

}

function main()
{
  // Leer el cuerpo de la solicitud
  $contenido = file_get_contents("php://input");
  $data = json_decode($contenido, true);
  $componenteService = new EmpleadosService($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
