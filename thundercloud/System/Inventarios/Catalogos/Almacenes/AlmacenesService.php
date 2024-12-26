<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/system/Inventarios/Catalogos/Almacenes/AlmacenesService.php
===============================================================================*/

require_once('../../../Connection/ConnectionADM.php');
require_once('../../../Connection/Connection.php');
require_once('../../../../Config/Config.php');
require_once('../../../../ReturnEvent/ReturnEvent.php');
require_once('../../../Connection/Statement.php');
require_once('../../../../ThunderLog/ThunderLog.php');

class AlmacenesService
{
  private $conn = null;
  private $thunderlog = null;

  public function __construct()
  {
    $this->thunderlog = new Log(__DIR__);
  }

  public function crudSave($uu, $cc, $clave, $descri, $coloni, $domici, $ciudad, $munici, $estado, $pais, $codpos, $telef1)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();

      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $this->thunderlog->writeLog("Datos => " . $clave . " " . $descri . " " . $coloni . " " . $domici . " " . $ciudad . " " . $munici . " " . $estado . " " . $pais . " " . $codpos . " " . $telef1);
      $query = "INSERT into ma_almac (clave, descri, coloni, domici, ciudad, munici, estado, pais, codpos, telef1) 
      values (:clave, :descri, :coloni, :domici, :ciudad, :munici, :estado, :pais, :codpos, :telef1)";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);
      $this->thunderlog->writeLog("Query => " . $query);

      if ($res) {
        $res->bindParam(':clave', $clave, PDO::PARAM_STR);
        $res->bindParam(':descri', $descri, PDO::PARAM_STR);
        $res->bindParam(':coloni', $coloni, PDO::PARAM_STR);
        $res->bindParam(':domici', $domici, PDO::PARAM_STR);
        $res->bindParam(':ciudad', $ciudad, PDO::PARAM_STR);
        $res->bindParam(':munici', $munici, PDO::PARAM_STR);
        $res->bindParam(':estado', $estado, PDO::PARAM_STR);
        $res->bindParam(':pais', $pais, PDO::PARAM_STR);
        $res->bindParam(':codpos', $codpos, PDO::PARAM_STR);
        $res->bindParam(':telef1', $telef1, PDO::PARAM_STR);

        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
            $this->thunderlog->writeLog("Execute => Correct => Almacen generado con exito");
            ReturnEvent::returnResponse(0, "Datos obtennidos con exito", "Almacen generado con exito");
        } else {
          $this->thunderlog->writeLog("Execute => Incorrect");
          ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
      } else {
        $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
      }
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

  public function crudSearch($uu, $cc, $clave)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $query = "SELECT clave, descri, coloni, domici, ciudad, munici, estado, pais, codpos, telef1 FROM ma_almac WHERE clave = :clave";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);

      if ($res) {
        $res->bindParam(':clave', $clave, PDO::PARAM_STR);
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
          $this->thunderlog->writeLog("Execute => Correct => Almacen encontrado con exito");
          ReturnEvent::returnResponse(0, "Datos obtennidos con exito", $result);
        } else {
          $this->thunderlog->writeLog("Execute => Incorrect");
          ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
      } else {
        $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
      }
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

}

function main()
{
  // Leer el cuerpo de la solicitud
  $contenido = file_get_contents("php://input");
  $data = json_decode($contenido, true);
  $componenteService = new AlmacenesService();
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
