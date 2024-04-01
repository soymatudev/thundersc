<?php

require_once('../Connection/Connection.php');

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

    if ($conexion->connect_error) {
      echo 'Error de conexion: ' . $conexion->connect_error;
      return null;
    }

    $stmt = $conexion->prepare($query);

    return $stmt;
  }

  public static function executePreparedQuery($stmt)
  {
    $result = $stmt->execute();
    if ($result) {
      if ($stmt->field_count > 0) {
        file_put_contents(self::LOG_FILE, "\nConsulta Select\n", FILE_APPEND);

        $resultSet = $stmt->get_result();
        $data = array();

        while ($row = $resultSet->fetch_assoc()) {
          $data[] = $row;
        }

        $stmt->close();
        return $data;
      } else {
        file_put_contents(self::LOG_FILE, "\n===================================\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nConsulta INSERT/UPDATE/DELETE\n", FILE_APPEND);

        // Consulta INSERT/UPDATE/DELETE
        $affectedRows = $stmt->affected_rows;
        $stmt->close();

        if ($affectedRows > 0) {
          return true; // Éxito
        } else {
          return false; // No se insertaron/actualizaron filas
        }
      }
    } else {
      //echo 'Error en la consulta: ' . $stmt->error;
      echo "Mal ejecutado";
      $stmt->close();
      return false;
    }
  }
}
