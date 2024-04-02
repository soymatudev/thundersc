<?php
require_once('../Connection/Connection.php');
require_once('../prepare/Statement.php');
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 14/12/2023
Descripción: Devuelve lo datos solicitados sobre los Molinos y Silos
===============================================================================
*/
class Querys extends Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public static function getCedis()
  {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT cedis FROM cedis";
    $stmt = self::prepareStatement($query);
    if ($stmt) {
      $result = self::executePreparedQuery($stmt);

      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct => Obentenemos los nombres\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function getGrupo($selectedOption)
  {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT zona FROM equipo 
    JOIN de_agrupacion ag ON equipo.id_agrupacion = ag.id
    WHERE ag.id_cedis = (SELECT id FROM cedis 
    WHERE cedis = :selectedOption)";

    $stmt = self::prepareStatement($query);
    if ($stmt) {
      $stmt->bindParam(':selectedOption', $selectedOption, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);

      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct => Obentenemos los nombres\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function getEquipo($selectedOption, $selectedOptionC)
  {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT alias FROM equipo 
    JOIN de_agrupacion ag ON equipo.id_agrupacion = ag.id
    WHERE equipo.zona = :selectedOption
    AND ag.id_cedis = (SELECT id FROM cedis 
    WHERE cedis = :selectedOptionC)";

    $stmt = self::prepareStatement($query);
    if ($stmt) {
      $stmt->bindParam(':selectedOption', $selectedOption, PDO::PARAM_STR);
      $stmt->bindParam(':selectedOptionC', $selectedOptionC, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);

      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct => Obentenemos los nombres\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public function cerrarConexion()
  {
    // Cierra la conexion cuando ya no sea necesaria
    $this->conexion = null;
  }
}

function cedis()
{
  $Querys = new Querys();
  $cedisData = $Querys->getCedis();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function grupo()
{
  // Ejemplo de uso para obtener datos de grupo
  $selectedOption = $_POST['cedis'];
  $Querys = new Querys();
  $grupoData = $Querys->getGrupo($selectedOption);
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($grupoData);
}

function equipo()
{
  // Ejemplo de uso para obtener datos de equipo
  $selectedOption = $_POST['grupo'];
  $selectedOptionC = $_POST['cedis'];
  $Querys = new Querys();
  $equipoData = $Querys->getEquipo($selectedOption, $selectedOptionC);
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($equipoData);
}
