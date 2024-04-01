<?php
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 2024
===============================================================================
*/

class Connection
{
  
  private const LOG_FILE = 'process.log';

  private static $con = null;

  public static function connect()
  {

    $HOST = getenv('HOST_URL') ?: "127.0.0.1";
    $PORT = getenv('PORT_DB') ?: '';
    $DBNAME = getenv('DBNAME') ?: "mp";
    $USER = getenv('USER_DB') ?: "root";
    $PASSWORD = getenv('PASSWORD_DB') ?: "";

    file_put_contents(self::LOG_FILE, "\n=====================================================\n", FILE_APPEND);
    file_put_contents(self::LOG_FILE, "\nConnecting...\n", FILE_APPEND);
    try {
      if (self::$con === null) {
        self::$con = new mysqli($HOST, $USER, $PASSWORD, $DBNAME);

        if (self::$con->connect_error) {
          self::logError("Error en la conexión: " . self::$con->connect_error);
        } else {
          file_put_contents(self::LOG_FILE, "\n= Connection Correct =\n", FILE_APPEND);
        }
      }
    } catch (Exception $e) {
      self::logError("Error en la conexión: " . $e->getMessage());
    }

    return self::$con;
  }

  public static function closeConnection()
  {
    if (self::$con !== null) {
      self::$con->close();
      self::$con = null;
    }
  }

  private static function logError($message)
  {
    file_put_contents(self::LOG_FILE, "\n= NO Connection =\n", FILE_APPEND);
    file_put_contents(self::LOG_FILE, "Error: " . $message, FILE_APPEND);
  }
}
