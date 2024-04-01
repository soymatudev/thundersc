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
    $query = "";

    if ($data['catalogo'] == 'Equipo') {
      $query = "INSERT INTO de_mp_equipo(nombre) VALUES(?)";
    } else if ($data['catalogo'] == 'SubEquipo') {
      $query = "INSERT INTO de_mp_subequipo(nombre, componentes) VALUES(?, ?)";
    }

    $stmt = self::prepareStatement($query);

    if ($stmt) {
      if ($data['catalogo'] == 'Equipo') {
        $stmt->bind_param('s', $data['nombre']);
      } else if ($data['catalogo'] == 'SubEquipo') {
        $stmt->bind_param('ss', $data['nombre'], $data['area']);
      }

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

  public static function getShowCatalogo($data)
  {
    $query = "";

    if ($data['catalogo'] == "Equipo") {
      $query = "SELECT * FROM de_mp_equipo";
    } else if ($data['catalogo'] == "SubEquipo") {
      $query = "SELECT * FROM de_mp_subequipo";
    }

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
    'catalogo' => $_POST['catalogo'],
    'nombre' => $_POST['nombre'],
    'area' => $_POST['area']
  );

  $Querys = new Querys();
  header('Content-Type: application/json');
  $data = $Querys->setAddRecord($data);
  $Querys->closeConnection();

  return json_encode($data);
}

function showCatalogo()
{
    $data = array(
        'catalogo' => $_POST['catalogo'],
      );

  $Querys = new Querys();
  header('Content-Type: application/json');
  $data = $Querys->getShowCatalogo($data);
  $Querys->closeConnection();

  return json_encode($data);
}