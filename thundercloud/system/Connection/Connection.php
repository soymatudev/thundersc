<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 10/02/2024
ruta: thundersc/thundercloud/system/Connection/Connection.php
===============================================================================*/

date_default_timezone_set('America/Mexico_City');
require_once (__DIR__.'/../../vendor/autoload.php');

class Connection {
  private const LOG_FILE = 'process.log';
  private static $conn = null;

  public static function connect(){
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../../');
    $dotenv->load();

    // Variables de entorno locales
    $localHost = $_ENV['DB_HOST_M'] ?: '';
    $localPort = $_ENV['DB_PORT_M'] ?: '';
    $localDBName = $_ENV['DB_NAME_M'] ?: '';
    $localUser = $_ENV['DB_USER_M'] ?: '';
    $localPassword = "" ?: '';

    $localDsn = "mysql:host=$localHost;port=$localPort;dbname=$localDBName;charset=utf8";

    // Variables de entorno de producción
    $prodHost = $_ENV['DB_HOST_Mai'] ?: '';
    $prodPort = $_ENV['DB_PORT_Mai'] ?: '';
    $prodDBName = $_ENV['DB_NAME_Mai'] ?: '';
    $prodUser = $_ENV['DB_USER_Mai'] ?: '';
    $prodPassword = $_ENV['DB_PASSWORD_Mai'] ?: '';

    $prodDsn = "mysql:host=$prodHost;port=$prodPort;dbname=$prodDBName;charset=utf8";

    file_put_contents(self::LOG_FILE, "\n=====================================================\n", FILE_APPEND);
    file_put_contents(self::LOG_FILE, "\nConnecting...\n", FILE_APPEND);

    // Intentar conexión local
    try {
      if (self::$conn === null) {
        self::$conn = new PDO($localDsn, $localUser, $localPassword);
        self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        file_put_contents(self::LOG_FILE, "\n= Connection Correct (Local) =\n", FILE_APPEND);
      }
      return self::$conn;
    } catch (PDOException $e) {
      self::logError("Error en la conexión local: " . $e->getMessage());

      // Intentar conexión de producción
      try {
        self::$conn = new PDO($prodDsn, $prodUser, $prodPassword);
        self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        file_put_contents(self::LOG_FILE, "\n= Connection Correct (Production) =\n", FILE_APPEND);
        return self::$conn;
      } catch (PDOException $e) {
        self::logError("Error en la conexión de producción: " . $e->getMessage());
        return null;
      }
    }
  }

  public static function closeConnection() {
    self::$conn = null;
    file_put_contents(self::LOG_FILE, "\n= Connection Closed =\n", FILE_APPEND);
  }

  private static function logError($message) {
    file_put_contents(self::LOG_FILE, "\n= NO Connection =\n", FILE_APPEND);
    file_put_contents(self::LOG_FILE, "Error: " . $message, FILE_APPEND);
  }
}