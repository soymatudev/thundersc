<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/system/Dashboard/Sensores/SensoresTempService.php
===============================================================================*/

require_once('../../Connection/Connection.php');
require_once('../../../Config/Config.php');
require_once('../../../ReturnEvent/ReturnEvent.php');
require_once('../../Connection/Statement.php');
require_once('../../../ThunderLog/ThunderLog.php');
require_once('../../../vendor/autoload.php');
use mPDF\mPDF;

class SensoresTempService
{
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->conn = null;
    $this->thunderlog = new Log(null, $uu);
  }

  public function getEquipos($uu, $cc, $arr = []) {
    try {
        $this->conn = (new Connection(null, $cc))->connect();
        if (!$this->conn) {
          $this->thunderlog->writeLog("Error de conexión" . $this->conn);
          return null;
        }
  
        $query = "SELECT a.clave, a.nombre, a.serie, a.modelo, b.descri as unidad, c.nombre as zona, a.alias, a.materia 
        from ma_equipo a, ma_unidad b, de_zona c 
        where cve_unidad = 'TEM'
        and a.cve_zona = c.clave
        and a.cve_unidad = b.clave";
        $stmt = new Statement($this->conn, (null));
        $res = $stmt->prepareStatement($query);
  
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
            $this->thunderlog->writeLog("Execute => Correct => Equipo encontrado con exito");

            for ($x = 0; $x < count($result); $x++) {
                $result[$x]['clave'] = thunderToUtf8(trim($result[$x]['clave']));
                $result[$x]['nombre'] = thunderToUtf8(trim($result[$x]['nombre']));
                $result[$x]['serie'] = thunderToUtf8(trim($result[$x]['serie']));
                $result[$x]['modelo'] = thunderToUtf8(trim($result[$x]['modelo']));
                $result[$x]['unidad'] = thunderToUtf8(trim($result[$x]['unidad']));
                $result[$x]['zona'] = thunderToUtf8(trim($result[$x]['zona']));
                $result[$x]['alias'] = thunderToUtf8(trim($result[$x]['alias']));
                $result[$x]['materia'] = thunderToUtf8(trim($result[$x]['materia']));
            }

            ReturnEvent::returnResponse(0, "Datos obtenidos con exito", $result);
        } else {
        $this->thunderlog->writeLog("Execute => Incorrect");
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

  function getUltTemp($uu, $cc, $nombre = null) {
    try {
        $this->conn = (new Connection(null, $cc))->connect();
        if (!$this->conn) {
          $this->thunderlog->writeLog("Error de conexión" . $this->conn);
          return null;
        }
  
        $query = "SELECT a.clave, a.nombre, a.serie, a.modelo, b.descri as unidad, c.nombre as zona, a.alias, a.materia, d.fecha_hora, d.dato_1 as temp, d.dato_2 as hum 
        from ma_equipo a, ma_unidad b, de_zona c, ma_regzoro d
        where cve_unidad = 'TEM'
        and a.cve_zona = c.clave
        and a.cve_unidad = b.clave
        and a.clave = d.cve_equipo
        and fecha_hora = (SELECT MAX(fecha_hora) FROM ma_regzoro WHERE cve_equipo = a.clave)";
        $query .= $nombre ? " and a.nombre = '$nombre'" : "";
        $stmt = new Statement($this->conn, (null));
        $res = $stmt->prepareStatement($query);
  
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
            $this->thunderlog->writeLog("Execute => Correct => Equipo encontrado con exito");

            for ($x = 0; $x < count($result); $x++) {
                $result[$x]['nombre'] = thunderToUtf8(trim($result[$x]['nombre']));
                $result[$x]['serie'] = thunderToUtf8(trim($result[$x]['serie']));
                $result[$x]['modelo'] = thunderToUtf8(trim($result[$x]['modelo']));
                $result[$x]['unidad'] = thunderToUtf8(trim($result[$x]['unidad']));
                $result[$x]['zona'] = thunderToUtf8(trim($result[$x]['zona']));
                $result[$x]['alias'] = thunderToUtf8(trim($result[$x]['alias']));
                $result[$x]['materia'] = thunderToUtf8(trim($result[$x]['materia']));
                $result[$x]['temp'] = $result[$x]['temp'] - 1.5;
                $result[$x]['hum'] = $result[$x]['hum'] - 1.5;
            }

            ReturnEvent::returnResponse(0, "Datos obtenidos con exito", $result);
        } else {
        $this->thunderlog->writeLog("Execute => Incorrect");
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

  function getDataLines($uu, $cc, $f_ini = null, $f_fin = null, $sensor = null) {
    try {
      $this->conn = (new Connection(null, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $range = $f_ini != "" && $f_fin != "" ? "and date(fecha_hora) between '$f_ini' and '$f_fin' " : " and fecha_hora >= CURRENT_DATE-3 ";
      $limit = $f_ini != "" && $f_fin != "" ? "" : " limit 15";
      $sensor = $sensor != "" ? " and a.clave = '$sensor'" : "";

      $query = "SELECT a.nombre, a.serie, a.modelo, b.descri as unidad, c.nombre as zona, a.alias, a.materia, d.fecha_hora, d.dato_1 as temp, d.dato_2 as hum 
      from ma_equipo a, ma_unidad b, de_zona c, ma_regzoro d
      where cve_unidad = 'TEM'
      and a.cve_zona = c.clave
      and a.cve_unidad = b.clave
      and a.clave = d.cve_equipo
      $range
      $sensor
      order by a.nombre, fecha_hora desc $limit";
      $this->thunderlog->writeLog("$query");

      $stmt = new Statement($this->conn);
      $res = $stmt->prepareStatement($query);
      $result = $stmt->executePreparedQuery($res);

      for ($x = 0; $x < count($result); $x++) {
        $result[$x]['nombre'] = thunderToUtf8(trim($result[$x]['nombre']));
        $result[$x]['serie'] = thunderToUtf8(trim($result[$x]['serie']));
        $result[$x]['modelo'] = thunderToUtf8(trim($result[$x]['modelo']));
        $result[$x]['unidad'] = thunderToUtf8(trim($result[$x]['unidad']));
        $result[$x]['zona'] = thunderToUtf8(trim($result[$x]['zona']));
        $result[$x]['alias'] = thunderToUtf8(trim($result[$x]['alias']));
        $result[$x]['materia'] = thunderToUtf8(trim($result[$x]['materia']));
        $result[$x]['fecha_hora'] = date_format(date_create($result[$x]['fecha_hora']), "d M Y H:i:s");
        $result[$x]['temp'] = $result[$x]['temp'] - 1.5;
        $result[$x]['hum'] = $result[$x]['hum'] - 1.5;
      }
    
      $equipos = array_unique(array_column($result, 'alias'));
      array_push($result, $equipos);

      //$this->thunderlog->writeLog("Result => " . print_r($result, true));
      ReturnEvent::returnResponse(0, "Datos obtenidos con exito", $result);
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

  function getListados($uu, $cc, $f_ini, $f_fin, $sensor = null) {
    try {
      $this->conn = (new Connection(null, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      //$sensor = isset($sensor) ? " and a.clave = '$sensor'" : "";
      $sensor = "";
      $query = "SELECT a.nombre, a.serie, a.modelo, b.descri as unidad, c.nombre as zona, a.alias, a.materia, d.fecha_hora, d.dato_1 as temp, d.dato_2 as hum 
      from ma_equipo a, ma_unidad b, de_zona c, ma_regzoro d
      where cve_unidad = 'TEM'
      and a.cve_zona = c.clave
      and a.cve_unidad = b.clave
      and a.clave = d.cve_equipo
      and date(fecha_hora) between :f_ini and :f_fin
      $sensor
      order by a.nombre, fecha_hora";
      $this->thunderlog->writeLog("$query");


      $stmt = new Statement($this->conn);
      $res = $stmt->prepareStatement($query);
      $res->bindParam(':f_ini', $f_ini, PDO::PARAM_STR);
      $res->bindParam(':f_fin', $f_fin, PDO::PARAM_STR);
      $result = $stmt->executePreparedQuery($res);
      //date("d/m/Y", strtotime($result[$x]['f_regis']));
      for ($x = 0; $x < count($result); $x++) {
        $result[$x]['nombre'] = thunderToUtf8(trim($result[$x]['nombre']));
        $result[$x]['serie'] = thunderToUtf8(trim($result[$x]['serie']));
        $result[$x]['modelo'] = thunderToUtf8(trim($result[$x]['modelo']));
        $result[$x]['unidad'] = thunderToUtf8(trim($result[$x]['unidad']));
        $result[$x]['zona'] = thunderToUtf8(trim($result[$x]['zona']));
        $result[$x]['alias'] = thunderToUtf8(trim($result[$x]['alias']));
        $result[$x]['materia'] = thunderToUtf8(trim($result[$x]['materia']));
        $result[$x]['fecha_hora'] = date_format(date_create($result[$x]['fecha_hora']), "d/m/Y H:i:s");
        $result[$x]['temp'] = ($result[$x]['temp'] - 1.5) . " °C";
        $result[$x]['hum'] = $result[$x]['hum'] - 1.5 . " %";
      }
    
      $headerGrid = [
        ["headerName" => "Sensor", "field" => "alias", "width" => 120],
        ["headerName" => "Zona", "field" => "zona", "width" => 120],
        ["headerName" => "Fecha", "field" => "fecha_hora", "width" => 150, ],
        ["headerName" => "Temperatura", "field" => "temp", "width" => 80, "cellStyle" => ["textAlign"=> "right"]],
        ["headerName" => "Humedad", "field" => "hum", "width" => 80, "cellStyle" => ["textAlign"=> "right"]]
      ];

      array_push($result, $headerGrid);
      //$this->thunderlog->writeLog("Result => " . print_r($result, true));
      ReturnEvent::returnResponse(0, "Datos obtenidos con exito", $result);
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
  $componenteService = new SensoresTempService($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
