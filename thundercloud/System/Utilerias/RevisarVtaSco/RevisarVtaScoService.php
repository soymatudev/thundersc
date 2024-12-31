<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 19/11/2024
ruta: thundersc/thundercloud/system/Inventarios/Utilerias/RevisarVtaScoService.php
===============================================================================*/

require_once('../../Connection/Connection.php');
require_once('../../../Config/Config.php');
require_once('../../../ReturnEvent/ReturnEvent.php');
require_once('../../Connection/Statement.php');
require_once('../../../ThunderLog/ThunderLog.php');

class InventarioxEquiposService
{
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->thunderlog = new Log(__DIR__, $uu);
  }


  public function consulta($uu, $cc, $f_ini, $f_fin, $formato)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $xperiodo = '';
      $xperiodo = strlen($f_ini) > 0 && strlen($f_fin) > 0 ? "AND f_venta BETWEEN '$f_ini' AND '$f_fin'" : '';

      $query = "SELECT tip_vta, concat(cve_alm, ' - ',b.descri) as cve_alm, f_venta, vta_sco, vta_pcz, vta_dif 
      FROM ma_ventasco a, ma_almac b 
      where status = 'S'
      and a.cve_alm = b.clave
      $xperiodo
      order by f_venta, cve_alm asc";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);
      $this->thunderlog->writeLog("Query => " . $query);

      if ($res) {
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
          

          for ($x = 0; $x < count($result); $x++) {
            $result[$x]['tip_vta'] = thunderToUtf8(trim($result[$x]['tip_vta']));
            $result[$x]['cve_alm'] = thunderToUtf8(trim($result[$x]['cve_alm']));
            $result[$x]['f_venta'] = date("d/m/Y", strtotime($result[$x]['f_venta']));
            $result[$x]['vta_sco'] = number_format(trim($result[$x]['vta_sco']), 2, '.', ',');
            $result[$x]['vta_pcz'] = number_format(trim($result[$x]['vta_pcz']), 2, '.', ',');
            $result[$x]['vta_dif'] = number_format(trim($result[$x]['vta_dif']), 2, '.', ',');
          }

          if ($formato == "GRID") {
            $headerGrid = [
              ["headerName" => "Tipo", "field" => "tip_vta", "width" => 80],
              ["headerName" => "Almacen", "field" => "cve_alm", "width" => 180],
              ["headerName" => "F. Venta", "field" => "f_venta", "width" => 120],
              ["headerName" => "Venta Sco", "field" => "vta_sco", "width" => 120],
              ["headerName" => "Venta Importada", "field" => "vta_pcz", "width" => 120],
              ["headerName" => "Diferencia", "field" => "vta_dif", "width" => 120]
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
