<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 10/02/2024
ruta: thundersc/thundercloud/system/Connection/Connection.php
===============================================================================*/

date_default_timezone_set('America/Mexico_City');

class Connection {
  private const LOG_FILE = 'process.log';
  private static $conn = null;

  public static function connect(){

    $HOST = "127.0.0.1" ?: "127.0.0.1";
    //$HOST = "192.168.1.67";
    $PORT = "3306" ?: '';
    $DBNAME = "nexthw6" ?: "nexthw6";
    $USER = "root" ?: "root";
    $PASSWORD = "" ?: "";

    $dsn = "mysql:host=$HOST;port=$PORT;dbname=$DBNAME;charset=utf8";

    file_put_contents(self::LOG_FILE, "\n=====================================================\n", FILE_APPEND);
    file_put_contents(self::LOG_FILE, "\nConnecting...\n", FILE_APPEND);

    try{

      if (self::$conn === null) {
        self::$conn = new PDO($dsn, $USER, $PASSWORD);
        self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        file_put_contents(self::LOG_FILE, "\n= Connection Correct =\n", FILE_APPEND);
      }
      return self::$conn;
    } catch (PDOException $e) {
      self::logError("Error en la conexión: " . $e->getMessage());
      return null;
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
/* ~ ssh-keygen -t ed25519 -C "juanmaturana518@gmail.com"*/
/* 
class Connection {
  private const LOG_FILE = 'process.log';
  private static $conn = null;

  public static function connect(){

    $HOST = "127.0.0.1" ?: "127.0.0.1";
    //$HOST = "192.168.1.67";
    $PORT = "3306" ?: '';
    $DBNAME = "nexthw" ?: "nexthw";
    $USER = "root" ?: "root";
    $PASSWORD = "www.aaz.com.mx" ?: "www.aaz.com.mx";

    $dsn = "mysql:host=$HOST;port=$PORT;dbname=$DBNAME;charset=utf8";

    file_put_contents(self::LOG_FILE, "\n=====================================================\n", FILE_APPEND);
    file_put_contents(self::LOG_FILE, "\nConnecting...\n", FILE_APPEND);

    try{

      if (self::$conn === null) {
        self::$conn = new PDO($dsn, $USER, $PASSWORD);
        self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        file_put_contents(self::LOG_FILE, "\n= Connection Correct =\n", FILE_APPEND);
      }
      return self::$conn;
    } catch (PDOException $e) {
      self::logError("Error en la conexión: " . $e->getMessage());
      return null;
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
} */