<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 19/11/2024
ruta: thundersc/thundercloud/system/Inventarios/Consultas/IngresoxEquipo/IngresoxEquipoService.php
===============================================================================*/

require_once('../../../Connection/ConnectionADM.php');
require_once('../../../Connection/Connection.php');
require_once('../../../../Config/Config.php');
require_once('../../../../ReturnEvent/ReturnEvent.php');
require_once('../../../Connection/Statement.php');
require_once('../../../../ThunderLog/ThunderLog.php');

class InventarioxEquiposService
{
  private $connadm = null;
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->connadm = (new ConnectionADM(__DIR__))->connect();
    $this->thunderlog = new Log(__DIR__, $uu);
  }


  public function consulta($uu, $cc, $serie, $cod_inv, $f_ini, $f_fin, $marca, $clasif, $status, $formato)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $active = ''; $xserie = ''; $xperiodo = '';
      $active = ($status == 1) ? "AND a.status = 'A'" : "AND a.status <> 'A'";
      $xserie = strlen($serie) > 0 ? "AND a.serie = '$serie'" : '';
      $marca = strlen($marca) > 0 ? "AND a.cve_marca = '$marca'" : '';
      $clasif = strlen($clasif) > 0 ? "AND a.cve_clasif = '$clasif'" : '';
      $cod_inv = strlen($cod_inv) > 0 ? "AND a.cod_inv = '$cod_inv'" : '';
      $xperiodo = strlen($f_ini) > 0 && strlen($f_fin) > 0 ? "AND a.f_regis BETWEEN '$f_ini' AND '$f_fin'" : '';

      $query = "SELECT a.serie, a.cod_inv, b.descri as marca, c.descri as clasif, a.modelo, a.f_regis, 
      CASE WHEN a.status = 'A' THEN 'Activo' ELSE 'Inactivo' END AS status,
      case when (select count(d.clave) from ma_eqasis d where cve_eqsis = a.clave) > 0 
      then (select e.descri from ma_eqasis d, ma_emple e where d.cve_emple = e.id and cve_eqsis = a.clave order by d.f_movto DESC limit 1) 
      else 'SIN ASIGNAR' end as asignado
      from ma_eqsis a, ma_marca b, ma_clasif c
      where a.cve_marca = b.clave and a.cve_clasif = c.clave
      $active
      $xserie
      $marca
      $clasif
      $cod_inv
      $xperiodo
      order by a.f_regis desc";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);
      $this->thunderlog->writeLog("Query => " . $query);

      if ($res) {
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
          

          for ($x = 0; $x < count($result); $x++) {
            $result[$x]['cod_inv'] = thunderToUtf8(trim($result[$x]['cod_inv']));
            $result[$x]['serie'] = thunderToUtf8(trim($result[$x]['serie']));
            $result[$x]['marca'] = thunderToUtf8(trim($result[$x]['marca']));
            $result[$x]['modelo'] = thunderToUtf8(trim($result[$x]['modelo']));
            $result[$x]['clasif'] = thunderToUtf8(trim($result[$x]['clasif']));
            $result[$x]['f_regis'] = date("d/m/Y", strtotime($result[$x]['f_regis']));
            $result[$x]['status'] = thunderToUtf8(trim($result[$x]['status']));
            $result[$x]['asignado'] = thunderToUtf8(trim($result[$x]['asignado']));
          }

          if ($formato == "GRID") {
            $headerGrid = [
              ["headerName" => "Num. Serie", "field" => "serie", "width" => 150],
              ["headerName" => "Cod. Inv", "field" => "cod_inv", "width" => 150],
              ["headerName" => "Marca", "field" => "marca", "width" => 120],
              ["headerName" => "Tipo", "field" => "clasif", "width" => 120],
              ["headerName" => "Modelo", "field" => "modelo", "width" => 120],
              ["headerName" => "Fecha Registro", "field" => "f_regis", "width" => 120],
              ["headerName" => "Status", "field" => "status", "width" => 80],
              ["headerName" => "Asignado", "field" => "asignado", "width" => 150]
            ];
  
            array_push($result, $headerGrid);
            ReturnEvent::returnResponse(0, "Datos obtennidos con exito", $result);
          } else {
            //PDF
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
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

  public function getAlmacenes($uu, $cc, $args)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $query = "SELECT clave, descri FROM ma_almac a, ma_almus b WHERE a.clave = b.cve_alm and b.cns_sn = 'S' AND b.cve_usu = :uu";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);

      if ($res) {
        $res->bindParam(':uu', explode('-',$uu)[0], PDO::PARAM_STR);
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {

          for ($x = 0; $x < count($result); $x++) {
            $result[$x]['clave'] = thunderToUtf8(trim($result[$x]['clave']));
            $result[$x]['descri'] = thunderToUtf8(trim($result[$x]['descri']));
          }

          ReturnEvent::returnResponse(0, "Almacenes Obtenidas con Exito", $result);
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
  $componenteService = new InventarioxEquiposService($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
