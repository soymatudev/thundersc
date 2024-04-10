<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 06/03/2024
ruta: thundersc/thundercloud/system/catalogo/maquina/maquina.php
===============================================================================*/

require_once('../../Connection/Connection.php');
require_once('../../Connection/Statement.php');

class Querys extends Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public static function setEquipo()
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }
    $nombre = $_POST['nombre'];
    $numSerie = $_POST['numSerie'];
    $clasif = $_POST['clasif'];
    $ubicacion = $_POST['ubicacion'];
    $componentes = $_POST['componentes'];
    $formato = $_POST['formato'];
    $tabla = $formato == "Equipo" ? "de_equi_maq" : "de_subequi_maq";

    $query = "INSERT INTO $tabla (id_ubicacion, nombre, num_serie, clasif, componentes) VALUES 
    ((SELECT id FROM ma_ubicacion WHERE nombre = :ubicacion),
    :nombre, :numSerie, :clasif, :componentes)";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':ubicacion', $ubicacion, PDO::PARAM_STR);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':numSerie', $numSerie, PDO::PARAM_STR);
      $stmt->bindParam(':clasif', $clasif, PDO::PARAM_STR);
      $stmt->bindParam(':componentes', $componentes, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        return ["Execute" => "Correct"];;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function setComponente($nombre)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO de_componente (nombre) VALUES (:nombre)";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        return ["Execute" => "Correct"];;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function setClasificacion($nombre) {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO de_clasif_equi (nombre) VALUES (:nombre)";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        return ["Execute" => "Correct"];;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function setRelacion($equipo, $subequipo)
  {
    $conn = Connection::connect();
    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }
    file_put_contents(self::LOG_FILE, "\nequipo => " . $equipo . "\n", FILE_APPEND);
    file_put_contents(self::LOG_FILE, "\nsubequipo => " . $subequipo . "\n", FILE_APPEND);

    $query = "INSERT INTO ma_equi_maq (id_equi_maq, id_subequi_maq) VALUES 
    ((SELECT id FROM de_equi_maq WHERE nombre = :equipo),
    (SELECT id FROM de_subequi_maq WHERE nombre = :subequipo))";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':equipo', $equipo, PDO::PARAM_STR);
      $stmt->bindParam(':subequipo', $subequipo, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        return ["Execute" => "Correct"];;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function getTable($catalogo)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }
    file_put_contents(self::LOG_FILE, "\nCatalogo => " . $catalogo . "\n", FILE_APPEND);
    if ($catalogo == "equipo") {
      $query = "SELECT eq.nombre AS 'Nombre', eq.num_serie AS 'Num_Serie', eq.clasif AS 'Clasificacion', eq.componentes AS 'Componentes', ub.nombre 'Ubicacion' FROM de_equi_maq eq INNER JOIN ma_ubicacion ub ON eq.id_ubicacion = ub.id";
    } else if ($catalogo == "subequipo") {
      $query = "SELECT seq.nombre AS 'Nombre', seq.num_serie AS 'Num_Serie', seq.clasif AS 'Clasificacion', seq.componentes AS 'Componentes', ub.nombre 'Ubicacion' FROM de_subequi_maq seq INNER JOIN ma_ubicacion ub ON seq.id_ubicacion = ub.id";
    } else if ($catalogo == "componente") {
      $query = "SELECT nombre FROM de_componente";
    } else if ($catalogo == "clasificacion") {
      $query = "SELECT nombre FROM de_clasif_equi";
    } else if ($catalogo == "relacion") {
      $query = "SELECT dee.nombre, GROUP_CONCAT(dse.nombre) AS 'Sub Equipos', dee.componentes FROM ma_equi_maq mae JOIN de_equi_maq dee ON mae.id_equi_maq = dee.id JOIN de_subequi_maq dse ON mae.id_subequi_maq = dse.id";
    }
    //$query = "SELECT nombre FROM de_$catalogo";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
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


function addEquipo()
{
  $data = Querys::setEquipo();
  header('Content-Type: application/json');
  return json_encode($data);
}

function addComponente()
{
  $nombre = $_POST['nombre'];
  $data = Querys::setComponente($nombre);
  header('Content-Type: application/json');
  return json_encode($data);
}

function addClasificacion()
{
  $nombre = $_POST['nombre'];
  $data = Querys::setClasificacion($nombre);
  header('Content-Type: application/json');
  return json_encode($data);
}

function addRelacion()
{
  $equipo = $_POST['equipo'];
  $subequipo = $_POST['subequipo'];
  $data = Querys::setRelacion($equipo, $subequipo);
  header('Content-Type: application/json');
  return json_encode($data);
}

function showTable()
{
  $catalogo = $_POST['catalogo'];
  $data = Querys::getTable($catalogo);
  //$data->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($data);
}
