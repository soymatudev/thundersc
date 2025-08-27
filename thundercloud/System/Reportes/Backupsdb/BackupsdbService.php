<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 19/11/2024
ruta: thundersc/thundercloud/system/Inventarios/Consultas/IngresoxEquipo/IngresoxEquipoService.php
===============================================================================*/

require_once('../../Connection/ConnectionADM.php');
require_once('../../Connection/Connection.php');
require_once('../../../Config/Config.php');
require_once('../../../ReturnEvent/ReturnEvent.php');
require_once('../../Connection/Statement.php');
require_once('../../../ThunderLog/ThunderLog.php');

class BackupsdbService
{
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->conn = null;
    $this->thunderlog = new Log(null, $uu);
  }


  public function consulta($uu, $cc, $f_ini, $f_fin)
  {
    try {
      $this->conn = (new Connection(null, $cc))->otherConnect("mysql");
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $xperiodo = '';
      $xperiodo = strlen($f_ini) > 0 && strlen($f_fin) > 0 
      ? "WHERE date(a.date) BETWEEN date('$f_ini') AND date('$f_fin')" 
      : 'WHERE date(a.date) BETWEEN date(CURRENT_DATE-2) AND date(CURRENT_DATE)';

      $query = "SELECT a.host, a.date, a.time, a.size, a.path, a.type, a.status, a.class from backups a
      $xperiodo
      order by a.host, a.date desc";
      $stmt = new Statement($this->conn);
      $res = $stmt->prepareStatement($query);
      $this->thunderlog->writeLog("Query => " . $query);

      $today =  (new DateTime())->format('Y-m-d');
      $yesterday =  ((new DateTime())->modify('-1 day'))->format('Y-m-d');

      $result = $stmt->executePreparedQuery($res);
        for ($x = 0; $x < count($result); $x++) {
          $result[$x]['host'] = thunderToUtf8(trim($result[$x]['host']));
          $result[$x]['time'] = thunderToUtf8(trim($result[$x]['time']));
          $result[$x]['size'] = thunderToUtf8(trim($result[$x]['size']));
          $result[$x]['path'] = thunderToUtf8(trim($result[$x]['path']));
          $result[$x]['status'] = $result[$x]['date'] == $today || $result[$x]['date'] == $yesterday ? "Succes" : "Warning";
          $result[$x]['date'] = date("d/m/Y", strtotime($result[$x]['date']));
          $result[$x]['type'] = trim($result[$x]['type']) == "F" ? "Completo" : "Incremental";
          $result[$x]['class'] = thunderToUtf8(trim($result[$x]['class']));
        }

        $headerGrid = [
          ["headerName" => "Servidor", "field" => "host", "width" => 120],
          ["headerName" => "Fecha", "field" => "date", "width" => 120],
          ["headerName" => "Hora", "field" => "time", "width" => 120],
          ["headerName" => "Ruta", "field" => "path", "width" => 200],
          ["headerName" => "Tamano", "field" => "size", "width" => 120],
          ["headerName" => "Tipo", "field" => "type", "width" => 120],
          ["headerName" => "Status", "field" => "status", "width" => 120],
          ["headerName" => "Calsif", "field" => "class", "width" => 120]
        ];

        array_push($result, $headerGrid);
        ReturnEvent::returnResponse(0, "Datos obtennidos con exito", $result);
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
      $stmt =new Statement($this->conn);
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
  $componenteService = new BackupsdbService($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
