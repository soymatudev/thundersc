<?php
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 2024
===============================================================================
*/

class Connection {
  private const LOG_FILE = 'process.log';
  private static $conn = null;

  public static function connect(){

    $HOST = getenv('HOST_URL') ?: "127.0.0.1";
    $PORT = getenv('PORT_DB') ?: '';
    $DBNAME = "nexthw5" ?: "nexthw5";
    $USER = getenv('USER_DB') ?: "root";
    $PASSWORD = getenv('PASSWORD_DB') ?: "";

    $dsn = "mysql:host=$HOST;dbname=$DBNAME;charset=utf8";

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