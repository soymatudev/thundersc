<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/system/Inventarios/Catalogos/Equipos/EquiposService.php
===============================================================================*/

require_once('../../../Connection/ConnectionADM.php');
require_once('../../../Connection/Connection.php');
require_once('../../../../Config/Config.php');
require_once('../../../../ReturnEvent/ReturnEvent.php');
require_once('../../../Connection/Statement.php');
require_once('../../../../ThunderLog/ThunderLog.php');

class EquiposSerice
{
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->thunderlog = new Log(__DIR__, $uu);
  }

  /* 
<!-- 
  Columna   |     Tipo      | Ordenamiento | Nulable  |               Por omisión               
------------+---------------+--------------+----------+-----------------------------------------
 clave      | integer       |              | not null | nextval('ma_eqsis_clave_seq'::regclass)
 serie      | character(30) |              |          | 
 cod_inv    | character(30) |              |          | 
 cve_marca  | integer       |              |          | 
 cve_clasif | integer       |              |          | 
 f_regis    | date          |              |          | 
 status     | character(1)  |              |          | 
 -->
  */
  //codigo, serie, marca, clasificacion, f_ini, status
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
        $stmt = $this->conn->prepare("INSERT into ma_eqsis (serie, cod_inv, cve_marca, cve_clasif, f_regis, status, modelo) 
        values (:serie, :cod_inv, :cve_marca, :cve_clasif, :f_regis, :status, :modelo)");
        $stmt->bindParam(':serie', $item['serie'], PDO::PARAM_STR);
        $stmt->bindParam(':cod_inv', $item['codgen'], PDO::PARAM_STR);
        $stmt->bindParam(':cve_marca', $item['cve_marca'], PDO::PARAM_INT);
        $stmt->bindParam(':cve_clasif', $item['cve_clasificacion'], PDO::PARAM_INT);
        $stmt->bindParam(':f_regis', $item['fini'], PDO::PARAM_STR);
        $stmt->bindParam(':status', $item['status'], PDO::PARAM_STR);
        $stmt->bindParam(':modelo', $item['modelo'], PDO::PARAM_STR);
        $result = $stmt->execute();
        $this->thunderlog->writeLog("Execute => " . print_r($result, true));
      }

      if (true) {
        $res = $this->conn->commit();
        if($res !== false) {
          $this->thunderlog->writeLog("Execute => Correct => Equipo(s) generado con exito");
          ReturnEvent::returnResponse(0, "Equipo(s) generado con exito", "Equipo(s) generado con exito");
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

  public function crudUpdate($uu, $cc, $serie, $cod_inv, $cve_marca, $cve_clasif, $f_regis, $status, $modelo) {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }
      $this->thunderlog->writeLog("Execute => " . $serie . " " . $cod_inv . " " . $cve_marca . " " . $cve_clasif . " " . $f_regis . " " . $status . " " . $modelo);

      $this->conn->beginTransaction();

      $stmt = $this->conn->prepare("UPDATE ma_eqsis SET serie = :serie, cve_marca = :cve_marca, cve_clasif = :cve_clasif, f_regis = :f_regis, status = :status, modelo = :modelo WHERE cod_inv = :cod_inv");
      $stmt->bindParam(':serie', $serie, PDO::PARAM_STR);
      $stmt->bindParam(':cod_inv', $cod_inv, PDO::PARAM_STR);
      $stmt->bindParam(':cve_marca', $cve_marca, PDO::PARAM_INT);
      $stmt->bindParam(':cve_clasif', $cve_clasif, PDO::PARAM_INT);
      $stmt->bindParam(':f_regis', $f_regis, PDO::PARAM_STR);
      $stmt->bindParam(':status', $status, PDO::PARAM_STR);
      $stmt->bindParam(':modelo', $modelo, PDO::PARAM_STR);
      $this->thunderlog->writeLog("Execute => " . $stmt->queryString);
      $result = $stmt->execute();

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

  public function crudDelete($uu, $cc, $codigo) {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $this->conn->beginTransaction();

      $stmt = $this->conn->prepare("DELETE FROM ma_eqsis WHERE clave = (SELECT clave FROM ma_eqsis WHERE cod_inv = :codinv)");
      $stmt->bindParam(':codinv', $codigo, PDO::PARAM_STR);
      $result = $stmt->execute();
      $this->thunderlog->writeLog("Execute => " . $stmt->queryString);

      if (true) {
        $res = $this->conn->commit();
        if ($res !== false) {
            $this->thunderlog->writeLog("Execute Correct => Equipo eliminado con exito");
            ReturnEvent::returnResponse(0, "Equipo eliminado con exito", "Equipo eliminado con exito");
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

  public function crudSearch($uu, $cc, $cod_inv)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $query = "SELECT serie, cod_inv, cve_marca, cve_clasif, f_regis, status, modelo FROM ma_eqsis WHERE cod_inv = :cod_inv";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);

      if ($res) {
        $res->bindParam(':cod_inv', $cod_inv, PDO::PARAM_STR);
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
          $this->thunderlog->writeLog("Execute => Correct => Equipo encontrado con exito");

          for ($x = 0; $x < count($result); $x++) {
            $result[$x]['serie'] = thunderToUtf8(trim($result[$x]['serie']));
            $result[$x]['cod_inv'] = thunderToUtf8(trim($result[$x]['cod_inv']));
            $result[$x]['cve_marca'] = thunderToUtf8(trim($result[$x]['cve_marca']));
            $result[$x]['cve_clasif'] = thunderToUtf8(trim($result[$x]['cve_clasif']));
            $result[$x]['f_regis'] = thunderToUtf8(trim($result[$x]['f_regis']));
            $result[$x]['status'] = thunderToUtf8(trim($result[$x]['status']));
            $result[$x]['modelo'] = thunderToUtf8(trim($result[$x]['modelo']));
          }

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
  $componenteService = new EquiposSerice($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
