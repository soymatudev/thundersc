<?php
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 2024
===============================================================================
*/

require_once('Connection.php');

class Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public static function prepareStatement($query)
  {
    $conexion = Connection::connect();
    if (!$conexion) {
      file_put_contents(self::LOG_FILE, "\nError de conexion: " . $conexion->connect_error, FILE_APPEND);
      echo 'Error de conexion: ' . $conexion->connect_error;
      return null;
    }
  
    $stmt = $conexion->prepare($query);
    
    if (!$stmt) {
      file_put_contents(self::LOG_FILE, "\nError al preparar la consulta: " . $conexion->error, FILE_APPEND);
      echo 'Error al preparar la consulta: ' . $conexion->error;
      return null;
    }

    return $stmt;
  }

  public static function executePreparedQuery($stmt)
  {
    try {
      $result = $stmt->execute();

      if ($result) {
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        
        if ($stmt->columnCount() > 0) {
          file_put_contents(self::LOG_FILE, "\nConsulta Select\n", FILE_APPEND);
          $data = $stmt->fetchAll();
          $stmt->closeCursor();
          return $data;
        } else {
          file_put_contents(self::LOG_FILE, "\n===================================\n", FILE_APPEND);
          file_put_contents(self::LOG_FILE, "\nConsulta INSERT/UPDATE/DELETE\n", FILE_APPEND);

          // Consulta INSERT/UPDATE/DELETE
          $affectedRows = $stmt->rowCount();
          $stmt->closeCursor();

          return $affectedRows > 0 ? true : false;
        }
      } else {
        file_put_contents(self::LOG_FILE, "Error en la consulta STMT: ", FILE_APPEND);
        echo "Mal ejecutado";
        $stmt->closeCursor();
        return false;
      }
    } catch (PDOException $e) {
      file_put_contents(self::LOG_FILE, "Error en la consulta: " . $e->getMessage(), FILE_APPEND);
      echo "Error en la consulta: " . $e->getMessage();
      return false;
    }
  }
}
