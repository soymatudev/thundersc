<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 10/04/2023
ruta: thundersc/thundercloud/log/user/adduser.php
===============================================================================*/
require_once('../../system/Connection/Connection.php');
require_once('../../system/Connection/Statement.php');
require_once('../codec.php');

class Querys extends Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public static function setUsuario($nombre, $password, $permisos)
  {
    $conn = Connection::connect();
    // Encriptar permisos
    $publicKey = openssl_pkey_get_public(file_get_contents('../ssl/thundersc_Key_publica.pem'));
    // Desencriptar permisos
    $privateKey = openssl_pkey_get_private(file_get_contents('../ssl/thundersc_Key_privada.pem'));

    $permisos = openssl_public_encrypt($permisos, $encrypted, $publicKey);

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO thundersc_usuario (username, password, permisos) VALUES 
    (:username, :password, :permisos)";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':username', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':password', $password, PDO::PARAM_STR);
      $stmt->bindParam(':permisos', $encrypted, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        return ["Execute" => "Correct"];
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
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
    // Desencriptar permisos
    $privateKey = openssl_pkey_get_private(file_get_contents('../ssl/thundersc_Key_privada.pem'));

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    if ($catalogo == "usuarios") {
      $query = "SELECT permisos FROM thundersc_usuario";
    } else if ($catalogo == "equipos") {
      $query = "SELECT nombre, cve, area FROM de_equi_trabajo";
    }
    //$query = "SELECT nombre FROM de_$catalogo";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);

        $query = "SELECT username, password, permisos FROM thundersc_usuario";
        $stmt = self::prepareStatement($query);
        
        if($stmt) {
          $resultAll = self::executePreparedQuery($stmt);
          foreach ($result as $key => $value) {
            $result[$key]['permisos'] = openssl_private_decrypt($value['permisos'], $decrypted, $privateKey);
            $codec = new Codec();
            $decrypted = $codec->decode($decrypted);
            $boni = implode(", ", $decrypted);
            $resultAll[$key]['permisos'] = $boni;
            //file_put_contents(self::LOG_FILE, "\nExecute => " . $decrypted . "\n", FILE_APPEND);
          }
        }
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($resultAll, true) . "\n", FILE_APPEND);
        return $resultAll;
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

function addUsuario()
{
  $nombre = $_POST['nombre'];
  $password = $_POST['password'];
  $permisos = explode(",", $_POST['permisos']);

  $codec = new Codec();
  $permisos = $codec->encode($permisos); 

  $data = Querys::setUsuario($nombre, $password, $permisos);
  header('Content-Type: application/json');
  return json_encode($data);
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
