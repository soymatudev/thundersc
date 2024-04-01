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
    $queryIdBrigada = "SELECT id FROM de_mp_brigada WHERE cve = ?";
    $stmtIdBrigada = self::prepareStatement($queryIdBrigada);
    $stmtIdBrigada->bind_param('s', $data['brigada']);
    $resultIdBrigada = self::executePreparedQuery($stmtIdBrigada);

    $column = "id_brigada, area, id_equipo, id_subequipo, frecuencia, desde, actividad";

    $values = "
      ?, 
      ?, 
      (SELECT id FROM de_mp_equipo WHERE nombre = ?), 
      (SELECT id FROM de_mp_subequipo WHERE nombre = ?), 
      ?, 
      ?,
      ?";

    $query = "INSERT INTO de_mp_ot($column) VALUES($values)";

    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bind_param(
        'sssssss',
        $resultIdBrigada[0]['id'],
        $data['area'],
        $data['equipo'],
        $data['subEquipo'],
        $data['frecuencia'],
        $data['fDesde'],
        $data['actividad']
      );

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
    VALUES(DATE_ADD('$desde', INTERVAL $dayFrecuencia MONTH), 'A Tiempo', $id, 'Sin Asignar', 'Inicio de la OT')";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
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

  public static function setCalendar()
  {
    $queryIdOT = "SELECT id, desde, frecuencia FROM de_mp_ot ORDER BY id DES";
    $stmtIdOT = self::prepareStatement($queryIdOT);
    $resultIdOT = self::executePreparedQuery($stmtIdOT);

    $frecuencia = explode(" ", $resultIdOT[0]['frecuencia']);

    $interval = $frecuencia[1] == 'meses' || $frecuencia[1] == 'mes' ? 'MONTH' : 'MONTH';

    $query = "INSERT INTO de_mp_calendar_ot(fecha, momento, id_ot, estatus, descripcion) 
    VALUES(DATE_ADD(? , INTERVAL ? ?), ?, ?, ?, ?)";

    $stmt = self::prepareStatement($query);
    file_put_contents(self::LOG_FILE, "\n Preparamos el insert => \n", FILE_APPEND);
    if ($stmt) {
      $stmt->bind_param(
        'ssssss',
        $resultIdOT[0]['desde'],
        $frecuencia[0],
        $interval,
        'A Tiempo',
        $resultIdOT[0]['id'],
        'Sin Asignar',
        'Inicio de la OT',
      );
      file_put_contents(self::LOG_FILE, "\n" . print_r($stmt, true) . "\n", FILE_APPEND);
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

  public static function setAddRecordCalendar()
  {

    $queryIdOT = "SELECT id FROM de_mp_ot ORDER BY id ASC";
    $stmtIdOT = self::prepareStatement($queryIdOT);
    $resultIdOT = self::executePreparedQuery($stmtIdOT);

    file_put_contents(self::LOG_FILE, "\n Consiguimos los IDs => \n", FILE_APPEND);
    file_put_contents(self::LOG_FILE, "\n" . print_r($resultIdOT, true) . "\n", FILE_APPEND);

    foreach ($resultIdOT as $OT) {
      $id = $OT['id'];
      $queryVerify = "SELECT COUNT(*) FROM de_mp_calendar_ot WHERE id_ot = ? AND estatus != 'Cerrada'";
      $stmtVerify = self::prepareStatement($queryVerify);
      $stmtVerify->bind_param('s', $id);
      $resultVerify = self::executePreparedQuery($stmtVerify);

      $numRegistros = $resultVerify[0]['COUNT(*)'];

      file_put_contents(self::LOG_FILE, "\n Obtenemos el numero de registros abiertos de esa OT => \n", FILE_APPEND);
      file_put_contents(self::LOG_FILE, "\n" . print_r($resultVerify, true) . "\n", FILE_APPEND);

      if ($numRegistros == 0) {
        $queryUF = "SELECT fecha, COUNT(*) AS numOT FROM de_mp_calendar_ot WHERE id_ot = ? ORDER BY fecha DESC LIMIT 1";
        $stmtUF = self::prepareStatement($queryUF);
        $stmtUF->bind_param('s', $id);
        $resultUF = self::executePreparedQuery($stmtUF);

        $resultUFF = $resultUF[0]['numOT'];

        file_put_contents(self::LOG_FILE, "\n Obtenemos la fecha de la ultima OT => \n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\n" . print_r($resultUF, true) . "\n", FILE_APPEND);

        $resultFDesde = '';
        if ($resultUFF == 0) {
          $queryFDesde = "SELECT desde FROM de_mp_ot WHERE id = ?";
          $stmtFDesde = self::prepareStatement($queryFDesde);
          $stmtFDesde->bind_param('s', $id);
          $resultFDesde = self::executePreparedQuery($stmtFDesde);
          file_put_contents(self::LOG_FILE, "\n Obtenemos la fecha de inicio de la OT => \n", FILE_APPEND);
          file_put_contents(self::LOG_FILE, "\n" . print_r($resultFDesde, true) . "\n", FILE_APPEND);
        }
        //$fechaCalendar = $resultFDesde !== '' ? $resultFDesde[0]['desde'] : $resultUF[0]['fecha'];
        $fechaCalendar = $resultFDesde[0]['desde'];
        file_put_contents(self::LOG_FILE, "\n Preparamos el insert  con Id de OT => " . $id . " y fecha " . $fechaCalendar . "\n", FILE_APPEND);

        $queryIn = "INSERT INTO 
        de_mp_calendar_ot(fecha, momento, id_ot, estatus, descripcion) 
        VALUES(DATE_ADD(?, INTERVAL 1 MONTH), ?, ?, ?, ?)";
        $stmtIn = self::prepareStatement($queryIn);



        file_put_contents(self::LOG_FILE, "\nAntes\n", FILE_APPEND);

        //if ($stmtIn) {
        $stmtIn->bind_param(
          'ssiss',
          $fechaCalendar,
          'A Tiempo',
          $id,
          'Sin Asignar',
          'Inicio de la OT',
        );
        file_put_contents(self::LOG_FILE, "\Despues\n", FILE_APPEND);

        file_put_contents(self::LOG_FILE, "\n" . print_r($stmtIn, true) . "\n", FILE_APPEND);

        $result = self::executePreparedQuery($stmtIn);
        file_put_contents(self::LOG_FILE, "\n Ejecutamos el insert => \n", FILE_APPEND);

        if ($result !== false) {
          file_put_contents(self::LOG_FILE, "\nExecute Correct\n", FILE_APPEND);
          //return array("Execute" => "Correct");
        } else {
          file_put_contents(self::LOG_FILE, "\nExecute Incorrect\n", FILE_APPEND);
          //return array("Execute" => "Incorrect");
        }
        /* } else {
          file_put_contents(self::LOG_FILE, "\nExecute Incorrect sin stmt\n", FILE_APPEND);
          file_put_contents(self::LOG_FILE, "\nError al preparar la declaración para insertar en la base de datos.\n", FILE_APPEND);
          //return array("Execute" => "Incorrect");
        } */
      }
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
    $this->conexion->close();
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
