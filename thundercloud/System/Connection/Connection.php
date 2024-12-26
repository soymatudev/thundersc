<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 19/11/2024
ruta: thundersc/thundercloud/system/Connection/ConnectionADM.php
===============================================================================*/

date_default_timezone_set('America/Mexico_City');
require_once (__DIR__.'/../../vendor/autoload.php');
require_once (__DIR__.'/../../ThunderLog/ThunderLog.php');

class Connection {
  private const LOG_FILE = 'process.log';
  private $thunderlog = null;
  private static $conn = null;
  private $cc = null;

  public function __construct($path, $cc) {
      $this->thunderlog = new Log($path);
      $this->cc = $cc;
  }

  public function connect(){
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../../');
    $dotenv->load();

    // Variables de entorno locales
    $localHost = $_ENV['DB_HOST_DEV'] ?: '';
    $localPort = $_ENV['DB_PORT_DEV'] ?: '';
    $localDBName = $_ENV['DB_NAME_'.$this->cc] ?: '';
    $localUser = $_ENV['DB_USER_DEV'] ?: '';
    $localPassword = $_ENV['DB_PASS_DEV'] ?: '';

    $localDsn = "pgsql:host=$localHost;port=$localPort;dbname=$localDBName";

    // Variables de entorno de producción
    $prodHost = $_ENV['DB_HOST_PROD'] ?: '';
    $prodPort = $_ENV['DB_PORT_PROD'] ?: '';
    $prodDBName = $_ENV['DB_NAME_'.$this->cc] ?: '';
    $prodUser = $_ENV['DB_USER_PROD'] ?: '';
    $prodPassword = $_ENV['DB_PASS_PROD'] ?: '';

    $prodDsn = "pgsql:host=$prodHost;port=$prodPort;dbname=$prodDBName";

    $this->thunderlog->writeLog("=====================================================");
    $this->thunderlog->writeLog("Connecting...");

    // Intentar conexión local
    try {
      if (self::$conn === null) {
        self::$conn = new PDO($localDsn, $localUser, $localPassword);
        self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->thunderlog->writeLog("= Connection Correct (Local) =");
      }
      return self::$conn;
    } catch (PDOException $e) {
      $this->thunderlog->writeLog("Error en la conexión local: " . $e->getMessage());

      // Intentar conexión de producción
      try {
        self::$conn = new PDO($prodDsn, $prodUser, $prodPassword);
        self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->thunderlog->writeLog("= Connection Correct (Production) =");
        return self::$conn;
      } catch (PDOException $e) {
        $this->thunderlog->writeLog("Error en la conexión de producción: " . $e->getMessage());
        return null;
      }
    }
  }

  public function closeConnection() {
    self::$conn = null;
    $this->thunderlog->writeLog("= Connection Closed =");
  }
}