<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 14/12/2023
ruta: thundersc/thundercloud/log/log.php
===============================================================================*/
require_once('../system/Connection/Connection.php');
require_once('../system/Connection/Statement.php');
require_once('./codec.php');

class Querys extends Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public static function setEquipoTrabajo($nombre, $cve, $area)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO de_equi_trabajo (nombre, cve, area, contador_actividades) VALUES 
    (:nombre, :cve, :area, 0)";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':cve', $cve, PDO::PARAM_STR);
      $stmt->bindParam(':area', $area, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        return ["Execute" => "Correct"];;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }


  public static function getTable($catalogo)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }
    file_put_contents(self::LOG_FILE, "\nCatalogo => " . $catalogo . "\n", FILE_APPEND);
    if ($catalogo == "usuarios") {
      $query = "SELECT nombre, telefono, cve_equi_trabajo FROM de_usuario_soporte";
    } else if ($catalogo == "equipos") {
      $query = "SELECT nombre, cve, area FROM de_equi_trabajo";
    }
    //$query = "SELECT nombre FROM de_$catalogo";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public function cerrarConexion()
  {
    // Cierra la conexion cuando ya no sea necesaria
    $this->conexion = null;
  }
}


function addEquipoTrabajo()
{
  $nombre = $_POST['nombre'];
  $cve = $_POST['cve'];
  $area = $_POST['area'];

  $data = Querys::setEquipoTrabajo($nombre, $cve, $area);
  header('Content-Type: application/json');
  return json_encode($data);
}

function showTable()
{
  $catalogo = $_POST['catalogo'];
  $data = Querys::getTable($catalogo);
  //$data->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($data);
}
