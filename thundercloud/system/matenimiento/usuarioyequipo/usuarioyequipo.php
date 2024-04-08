<?php
require_once('../../Connection/Connection.php');
require_once('../../Connection/Statement.php');
require_once('../../especialwork/imageconversor/imageconversor.php');
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 14/12/2023
Descripción: Devuelve lo datos solicitados sobre los Molinos y Silos
===============================================================================
*/
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

  public static function setUsuarioSoporte($nombre, $telefono, $password, $equipos, $target, $fileTmpName) {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    if (move_uploaded_file($fileTmpName, $target)) {
      $query = "INSERT INTO de_usuario_soporte 
      (nombre, username, telefono, password, cve_equi_trabajo, url_foto) 
      VALUES 
      (:nombre, :username, :telefono, :password, :equipos, :url_foto)";
      $stmt = self::prepareStatement($query);

      if ($stmt) {
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindParam(':username', $telefono, PDO::PARAM_STR);
        $stmt->bindParam(':telefono', $password, PDO::PARAM_STR);
        $stmt->bindParam(':password', $equipos, PDO::PARAM_STR);
        $stmt->bindParam(':equipos', $target, PDO::PARAM_STR);
        $stmt->bindParam(':url_foto', $target, PDO::PARAM_STR);
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
    } else {
      file_put_contents(self::LOG_FILE, "\nError de imagen". error_get_last() ."\n", FILE_APPEND);
      return ["Execute" => "Incorrect", "Error" => "Sin Imagen"];
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

function addUsuarioSoporte(){
  file_put_contents('process.log', "\nAdentro de la primer funcion\n", FILE_APPEND);
  $nombre = $_POST['nombre'];
  $telefono = $_POST['telefono'];
  $password = $_POST['password'];
  $equipos = $_POST['equipos'];
  $fileName = $_FILES['file']['name'];
  $fileTmpName = $_FILES['file']['tmp_name'];
  $dir = __DIR__ . '../../../src/user_images/';
  $target = $dir . basename($fileName);

  file_put_contents('process.log', "\nPor revisar la imagen\n", FILE_APPEND);
  if ($_FILES['file']['name']){
    $nuevaImagen = imageconversor($fileName, $fileTmpName, 100, 100, 50, 'webp');
    file_put_contents('process.log', "\nDespues del conversor ". image_type_to_mime_type($nuevaImagen)."\n", FILE_APPEND);

    if ($target == null) {
      file_put_contents('process.log', "\nError de imagen\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }

    $data = Querys::setUsuarioSoporte($nombre, $telefono, $password, $equipos, $target, $fileTmpName);
    header('Content-Type: application/json');
    return json_encode($data);
  } else {
    file_put_contents('process.log', "\nSin imagen\n", FILE_APPEND);
    return ["Execute" => "Incorrect", "Error" => "Sin Imagen"];
  }
}

function showTable()
{
  $catalogo = $_POST['catalogo'];
  $data = Querys::getTable($catalogo);
  //$data->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($data);
}
