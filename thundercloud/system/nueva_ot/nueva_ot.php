<?php
//session_start();
require_once('../Connection/Connection.php');
require_once('../prepare/Statement.php');

class Querys extends Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public static function setAddRecord($data)
  {
    $queryIdBrigada = "SELECT id FROM de_mp_brigada WHERE cve = :brigada";
    $stmtIdBrigada = self::prepareStatement($queryIdBrigada);
    $stmtIdBrigada->bindParam(':brigada', $data['brigada']);
    $resultIdBrigada = self::executePreparedQuery($stmtIdBrigada);

    $column = "id_brigada, area, id_equipo, id_subequipo, frecuencia, desde, actividad";

    $values = "
      :id_brigada, 
      :area, 
      (SELECT id FROM de_mp_equipo WHERE nombre = :equipo), 
      (SELECT id FROM de_mp_subequipo WHERE nombre = :subEquipo), 
      :frecuencia, 
      :fDesde,
      :actividad";

    $query = "INSERT INTO de_mp_ot($column) VALUES($values)";

    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':id_brigada', $resultIdBrigada[0]['id']);
      $stmt->bindParam(':area', $data['area']);
      $stmt->bindParam(':equipo', $data['equipo']);
      $stmt->bindParam(':subEquipo', $data['subEquipo']);
      $stmt->bindParam(':frecuencia', $data['frecuencia']);
      $stmt->bindParam(':fDesde', $data['fDesde']);
      $stmt->bindParam(':actividad', $data['actividad']);

      $result = self::executePreparedQuery($stmt);

      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute Correct\n", FILE_APPEND);
        return array("Execute" => "Correct");
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute Incorrect\n", FILE_APPEND);
        return array("Execute" => "Incorrect");
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute Incorrect sin stmt\n", FILE_APPEND);
      return array("Execute" => "Incorrect");
    }
  }

  public static function pruebaInsert()
  {
    $queryIdOT = "SELECT id, desde, frecuencia FROM de_mp_ot ORDER BY id DESC";
    $stmtIdOT = self::prepareStatement($queryIdOT);
    $resultIdOT = self::executePreparedQuery($stmtIdOT);

    file_put_contents(self::LOG_FILE, "\nExecute Id => " . $resultIdOT[0]['id'] . "\n", FILE_APPEND);
    $id = $resultIdOT[0]['id'];
    $desde = $resultIdOT[0]['desde'];
    $frecuencia = explode(" ", $resultIdOT[0]['frecuencia']);
    $dayFrecuencia = $frecuencia[0];

    file_put_contents(self::LOG_FILE, "\nExecute Frecuencia => " . $desde . "\n", FILE_APPEND);

    file_put_contents(self::LOG_FILE, "\nExecute Frecuencia => " . $frecuencia[0] . "\n", FILE_APPEND);

    $query = "INSERT INTO de_mp_calendar_ot(fecha, momento, id_ot, estatus, descripcion) 
    VALUES(DATE_ADD(:desde, INTERVAL :dayFrecuencia MONTH), 'A Tiempo', :id, 'Sin Asignar', 'Inicio de la OT')";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':desde', $desde);
      $stmt->bindParam(':dayFrecuencia', $dayFrecuencia);
      $stmt->bindParam(':id', $id);

      $result = self::executePreparedQuery($stmt);

      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute Correct\n", FILE_APPEND);
        return array("Execute" => "Correct");
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute Incorrect\n", FILE_APPEND);
        return array("Execute" => "Incorrect");
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute Incorrect sin stmt\n", FILE_APPEND);
      return array("Execute" => "Incorrect");
    }
  }

  public static function getShowCalendar()
  {
    $query = "SELECT 
              (SELECT nombre FROM de_mp_equipo WHERE id = ot.id_equipo) AS title,
              ma.fecha AS start,
              ma.fecha AS end
              FROM de_mp_calendar_ot ma JOIN de_mp_ot ot ON ma.id_ot = ot.id";

    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $result = self::executePreparedQuery($stmt);

      if ($result !== false && !empty($result)) {
        file_put_contents(self::LOG_FILE, "\nExecute Correct => \n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\n" . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute Incorrect => Sin nada que mostrar\n", FILE_APPEND);
        return array("Execute" => "Incorrect");
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute Incorrect sin stmt\n", FILE_APPEND);
      return array("Execute" => "Incorrect");
    }
  }

  public static function getShowRecordCalendar()
  {
    $query = "SELECT 
              ot.id AS id,
              (SELECT nombre FROM de_mp_equipo WHERE id = ot.id_equipo) AS equipo,
              (SELECT nombre FROM de_mp_subequipo WHERE id = ot.id_subequipo) AS subEquipo,
              ot.frecuencia AS frecuencia,
              ot.desde AS desde,
              ot.actividad AS actividad
              FROM de_mp_ot ot";

    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $result = self::executePreparedQuery($stmt);

      if ($result !== false && !empty($result)) {
        file_put_contents(self::LOG_FILE, "\nExecute Correct => \n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\n" . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute Incorrect => Sin nada que mostrar\n", FILE_APPEND);
        return array("Execute" => "Incorrect");
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute Incorrect sin stmt\n", FILE_APPEND);
      return array("Execute" => "Incorrect");
    }
  }

  public function closeConnection()
  {
    $this->conexion = null;
  }
}


function addRecord()
{
  $data = array(
    'brigada' => $_POST['brigada'],
    'area' => $_POST['area'],
    'equipo' => $_POST['equipo'],
    'subEquipo' => $_POST['subEquipo'],
    'frecuencia' => $_POST['frecuencia'],
    'fDesde' => $_POST['fDesde'],
    'actividad' => $_POST['actividad'],
  );

  $Querys = new Querys();
  header('Content-Type: application/json');
  $data = $Querys->setAddRecord($data);
  $Querys->closeConnection();

  return json_encode($data);
}

function addRecordCalendar()
{

  $Querys = new Querys();
  header('Content-Type: application/json');
  $data = $Querys->pruebaInsert();
  $Querys->closeConnection();

  return json_encode($data);
}

function showCalendar()
{
  $Querys = new Querys();
  header('Content-Type: application/json');
  $data = $Querys->getShowCalendar();
  $Querys->closeConnection();

  return json_encode($data);
}

function showTableCalendar()
{
  $Querys = new Querys();
  header('Content-Type: application/json');
  $data = $Querys->getShowRecordCalendar();
  $Querys->closeConnection();

  return json_encode($data);
}
