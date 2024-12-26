<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 20/02/2024
ruta: thundersc/thundercloud/system/Connection/Statement.php
===============================================================================*/

require_once('Connection.php');

class Statement
{
  private static $conn = null;
  private static $thunderlog = null;

  /* public function __construct()
  {
    $this->conexion = Connection::connect();
  } */

  public function __construct($conexion, $path = "/thunder/thundercloud/ThunderLog/thunderlog.log") {
    self::$thunderlog = new Log($path);
    self::$conn = $conexion;
  }


  public static function prepareStatement($query)
  {
    $conexion = self::$conn;
    if (!$conexion) {
      self::$thunderlog->writeLog("Error de conexión" . $conexion->connect_error);
      echo 'Error de conexion: ' . $conexion->connect_error;
      return null;
    }
  
    $stmt = $conexion->prepare($query);
    
    if (!$stmt) {
      self::$thunderlog->writeLog("Error al preparar la consulta: " . $conexion->error);
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
          self::$thunderlog->writeLog("Consulta Select");
          $data = $stmt->fetchAll();
          $stmt->closeCursor();
          return $data;
        } else {
          self::$thunderlog->writeLog("Consulta INSERT/UPDATE/DELETE");
          // Consulta INSERT/UPDATE/DELETE
          $affectedRows = $stmt->rowCount();
          $stmt->closeCursor();

          return $affectedRows > 0 ? true : false;
        }
      } else {
        self::$thunderlog->writeLog("Mal ejecutado > Error en la consulta STMT" . $stmt->errorInfo());
        //echo "Mal ejecutado";
        $stmt->closeCursor();
        return false;
      }
    } catch (PDOException $e) {
      self::$thunderlog->writeLog("Error en la consulta: " . $e->getMessage());
      //echo "Error en la consulta: " . $e->getMessage();
      return false;
    }
  }
}
