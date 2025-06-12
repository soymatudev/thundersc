<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 23/01/2025
ruta: thundersc/thundercloud/system/Utilerias/TiendasNext/TiendasNextService.php
===============================================================================*/

require_once('../../Connection/Connection.php');
require_once('../../../Config/Config.php');
require_once('../../../ReturnEvent/ReturnEvent.php');
require_once('../../Connection/Statement.php');
require_once('../../../ThunderLog/ThunderLog.php');

class TiendasNextService
{
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->thunderlog = new Log(__DIR__, $uu);
  }


  public function consulta($uu, $cc)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $query = "SELECT a.cve_alm, b.descri, a.ip, a.lon, a.lat from de_almac a, ma_almac b where a.cve_alm = b.clave and a.lon != 0 and a.lat != 0";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);
      $this->thunderlog->writeLog("Query => " . $query);

      if ($res) {
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {

            for ($x = 0; $x < count($result); $x++) {
                /* $result[$x]['cve_alm'] = thunderToUtf8(trim($result[$x]['cve_alm']));
                $result[$x]['descri'] = thunderToUtf8(trim($result[$x]['descri']));
                $result[$x]['ip'] = thunderToUtf8(trim($result[$x]['ip']));
                $result[$x]['lon'] = thunderToUtf8(trim($result[$x]['lon']));
                $result[$x]['lat'] = thunderToUtf8(trim($result[$x]['lat'])); */
                //$result[$x] = $result[$x]['cve_alm'] . " - " . $result[$x]['ip'] . "\n - " . substr($result[$x]['lat'], 0, 7);
                //$result[$x] = '<p>22 </p>';
            }

            $result = array_chunk($result, 5);
            
            //$this->thunderlog->writeLog("Result => " . print_r($result, true));

            $headerGrid = [];

            for($i = 0; $i < count($result)-1; $i++){
               $headerGrid[] = ["headerName" => "", "field" => "$i", "cellRenderer" => "<p>oli</p>", "width" => 200];
            }

            $this->thunderlog->writeLog("HeaderGrid => " . print_r($headerGrid, true));

            /* $headerGrid = [
              ["headerName" => "Cve Alm", "field" => "0", "width" => 80],
              ["headerName" => "Almacen", "field" => "almac", "width" => 200],
              ["headerName" => "Cod. Inv", "field" => "cod_inv", "width" => 150],
              ["headerName" => "Serie", "field" => "serie", "width" => 120],
              ["headerName" => "Marca", "field" => "marca", "width" => 120],
              ["headerName" => "Clasificación", "field" => "clasif", "width" => 120],
              ["headerName" => "Departamento", "field" => "depar", "width" => 120],
              ["headerName" => "Empleado", "field" => "emple", "width" => 120],
              ["headerName" => "Fecha Movto", "field" => "f_movto", "width" => 120],
              ["headerName" => "Status", "field" => "status", "width" => 80]
            ]; */
  
            array_push($result, $headerGrid);
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
  $componenteService = new TiendasNextService($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
