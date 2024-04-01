<?php
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 2024
===============================================================================
*/

require_once('../Connection/Connection.php');

class Combo
{
  private $conexion;

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public function executeQuery($query, $column)
  {
    try {
      $result = $this->conexion->query($query);

      if ($result) {
        $data = array();
        if ($column) {
          while ($row = $result->fetch_assoc()) {
            $data[] = $row[$column];
          }
        } else {
          while ($row = $result->fetch_assoc()) {
            $data[] = $row;
          }
        }
        return $data;
      } else {
        throw new Exception("Error en la consulta: " . $this->conexion->error);
      }
    } catch (Exception $e) {
      echo "Error: " . $e->getMessage();
      return null;
    }
  }


  public function getEquipo()
  {
    $querySelect = "SELECT nombre FROM de_mp_equipo";
    $result = $this->executeQuery($querySelect, "nombre");
    return $result !== null ? $result : array("Execute" => "Incorrect");
  }

  public function getSubEquipo()
  {
    $querySelect = "SELECT nombre FROM de_mp_subequipo";
    $result = $this->executeQuery($querySelect, "nombre");
    return $result !== null ? $result : array("Execute" => "Incorrect");
  }


  public function cerrarConexion()
  {
    // Cierra la conexión cuando ya no sea necesaria
    $this->conexion->close();
  }
}

function equipo()
{
  $setCombo = new Combo();
  header('Content-Type: application/json');
  $Data = $setCombo->getEquipo();
  $setCombo->cerrarConexion();
  // file_put_contents(self::LOG_FILE, "\nProducto Data: ".$Data."\n", FILE_APPEND);
  return json_encode($Data);
}

function subEquipo()
{
  $setCombo = new Combo();
  header('Content-Type: application/json');
  $Data = $setCombo->getSubEquipo();
  $setCombo->cerrarConexion();
  // file_put_contents(self::LOG_FILE, "\nProducto Data: ".$Data."\n", FILE_APPEND);
  return json_encode($Data);
}