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

  public static function getUsuario($username, $password)
  {
    $privateKey = openssl_pkey_get_private(file_get_contents('../ssl/thundersc_Key_privada.pem'));
    $conn = Connection::connect();
    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT * FROM thundersc_usuario WHERE username = :username";
    //$query = "SELECT * FROM thundersc_usuario";
    $stmt = self::prepareStatement($query);

    //file_put_contents(self::LOG_FILE, "\nQuery => ".$query."\n", FILE_APPEND);

    if ($stmt) {
      $stmt->bindParam(':username', $username, PDO::PARAM_STR);
      
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        /* file_put_contents(self::LOG_FILE, "\nExecute => Correct".print_r($result, true)."\n", FILE_APPEND); */

          if (password_verify($password, $result[0]['password'])) {

            $result[0]['permisos'] = openssl_private_decrypt($result[0]['permisos'], $decrypted, $privateKey);
            $codec = new Codec();
            $decrypted = $codec->decode($decrypted);
            $permisos = implode(", ", $decrypted);
            $infoUsuario[0]['permisos'] = $permisos;
            $infoUsuario[0]['username'] = $result[0]['username'];
          
            file_put_contents(self::LOG_FILE, "\nInfo Usuario => ".print_r($infoUsuario, true)."\n", FILE_APPEND);

            if ($infoUsuario !== false) {
              return Querys::setSession($infoUsuario);
            } else {
              file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
              return ["Execute" => "Incorrect"];
            }
          }
        return ["Execute" => "Correct"];
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return null;
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return null;
    }
  }

  public static function setSession ($infoUsuario) {
    session_start();
    $_SESSION['username'] = $infoUsuario[0]['username'];
    $_SESSION['permisos'] = $infoUsuario[0]['permisos'];
    $_SESSION['tiempo_login'] = time();
    //$_SESSION['tiempoMax'] = $_SESSION['tiempo'] + 600;
    file_put_contents(self::LOG_FILE, "\nSession => ".print_r($_SESSION, true)."\n", FILE_APPEND);
    $result = ["Session" => "Correct"];
    return $result;
  }

  public function cerrarConexion()
  {
    // Cierra la conexion cuando ya no sea necesaria
    $this->conexion = null;
  }
}

function login()
{
  $username = $_POST['username'];
  $password = $_POST['password'];

  $data = Querys::getUsuario($username, $password);
  header('Content-Type: application/json');
  return json_encode($data);
}
