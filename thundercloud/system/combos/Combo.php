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
  private const LOG_FILE = 'process.log';

  public static function getEquipo()
  {
    $conn = Connection::connect();

    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    try{
      $query = "SELECT nombre FROM de_mp_equipo";
      $stmt = $conn->prepare($query);
      $stmt->execute();

      file_put_contents(self::LOG_FILE, "\nConsulta Select\n", FILE_APPEND);
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      file_put_contents(self::LOG_FILE, "\nError en la consulta\n", FILE_APPEND);
      return null;
    }
  }

  public static function getSubEquipo()
  {
    $conn = Connection::connect();

    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    try{
      $query = "SELECT nombre FROM de_mp_subequipo";
      $stmt = $conn->prepare($query);
      $stmt->execute();

      file_put_contents(self::LOG_FILE, "\nConsulta Select\n", FILE_APPEND);
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      file_put_contents(self::LOG_FILE, "\nError en la consulta\n", FILE_APPEND);
      return null;
    }
  }

  public function cerrarConexion()
  {
    // Cierra la conexión cuando ya no sea necesaria
    Connection::closeConnection();
  }
}

function equipo()
{
  header('Content-Type: application/json');
  $Data = Combo::getEquipo();
  return json_encode($Data); // Convertir a JSON antes de devolver
}

function subEquipo()
{
  header('Content-Type: application/json');
  $Data = Combo::getSubEquipo();
  return json_encode($Data); // Convertir a JSON antes de devolver
}
