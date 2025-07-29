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

  function getDataLines($uu, $cc) {
    try {
      $this->conn = (new Connection(null, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $query = "SELECT a.nombre, a.serie, a.modelo, b.descri as unidad, c.nombre as zona, a.alias, a.materia, d.fecha_hora, d.dato_1 as temp, d.dato_2 as hum 
      from ma_equipo a, ma_unidad b, de_zona c, ma_regzoro d
      where cve_unidad = 'TEM'
      and a.cve_zona = c.clave
      and a.cve_unidad = b.clave
      and a.clave = d.cve_equipo
      and fecha_hora >= CURRENT_DATE-3
      order by a.nombre, fecha_hora desc limit 5";
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
              $result[$x]['fecha_hora'] = date_format(date_create($result[$x]['fecha_hora']), "d M Y H:i:s");
          }
          
          $equipos = array_unique(array_column($result, 'nombre'));
          array_push($result, $equipos);

          $this->thunderlog->writeLog("Result => " . print_r($result, true));
          ReturnEvent::returnResponse(0, "Datos obtenidos con exito", $result);
      } else {
      $this->thunderlog->writeLog("Execute => Incorrect");
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
  $componenteService = new SensoresTempService($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
