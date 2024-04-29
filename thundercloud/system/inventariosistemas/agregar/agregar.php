<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 22/04/2024
ruta: thundersc/thundercloud/system/mantenimiento/usuarioyequipo/usuarioyequipo.php
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

  public static function setAsignatario($nombre, $apellidos)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO de_asignatario (nombre, apellidos) VALUES (:nombre, :apellidos)";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':apellidos', $apellidos, PDO::PARAM_STR);
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

  public static function setClasificacion($nombre)
  {
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

  public static function setMarca($nombre)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO de_marca (nombre) VALUES (:nombre)";
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

  public static function setArea($nombre)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO de_area (nombre) VALUES (:nombre)";
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

  public static function setAlmacen($nombre, $cve, $zona)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO de_almacen (nombre, cve_alm, id_zona) 
    VALUES (:nombre, :cve, (SELECT id FROM de_zona WHERE nombre = :zona))";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':cve', $cve, PDO::PARAM_STR);
      $stmt->bindParam(':zona', $zona, PDO::PARAM_STR);
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

  public static function setZona($nombre)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO de_zona (nombre) VALUES (:nombre)";
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

  public static function setEquipo($numserie, $modelo, $clasificacion, $marca, $area, $almacen, $asignatario, $f_registro)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "INSERT INTO ma_equi_sis 
    (num_serie, modelo, id_clasif, id_marca, id_area, id_asignatario, id_almacen, fecha_registro) 
    VALUES 
    (:numserie, 
    :modelo, 
    (SELECT id FROM de_clasif_equi WHERE nombre = :clasificacion), 
    (SELECT id FROM de_marca WHERE nombre = :marca), 
    (SELECT id FROM de_area WHERE nombre = :area), 
    (SELECT id FROM de_asignatario WHERE CONCAT(de_asignatario.nombre, ' ', de_asignatario.apellidos) = :asignatario), 
    (SELECT id FROM de_almacen alm WHERE CONCAT(alm.cve_alm, ' ', alm.nombre) = :almacen), 
    :f_registro)";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':numserie', $numserie, PDO::PARAM_STR);
      $stmt->bindParam(':modelo', $modelo, PDO::PARAM_STR);
      $stmt->bindParam(':clasificacion', $clasificacion, PDO::PARAM_STR);
      $stmt->bindParam(':marca', $marca, PDO::PARAM_STR);
      $stmt->bindParam(':area', $area, PDO::PARAM_STR);
      $stmt->bindParam(':asignatario', $asignatario, PDO::PARAM_STR);
      $stmt->bindParam(':almacen', $almacen, PDO::PARAM_STR);
      $stmt->bindParam(':f_registro', $f_registro, PDO::PARAM_STR);
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
    if ($catalogo == "asignatario") {
      $query = "SELECT CONCAT(nombre, ' ', apellidos) AS 'Asignatario' FROM de_asignatario";
    } else if ($catalogo == "clasificacion") {
      $query = "SELECT nombre AS 'Equipo' FROM de_clasif_equi";
    } else if ($catalogo == "marca") {
      $query = "SELECT nombre AS 'Marca' FROM de_marca";
    } else if ($catalogo == "area") {
      $query = "SELECT nombre AS 'Area' FROM de_area";
    } else if ($catalogo == "zona") {
      $query = "SELECT nombre AS 'Zona' FROM de_zona";
    } else if ($catalogo == "almacen") {
      $query = "SELECT alm.nombre AS 'Almacen', cve_alm AS 'Cve Almacen', dz.nombre AS 'Zona' FROM de_almacen alm JOIN de_zona dz ON alm.id_zona = dz.id";
    } else if ($catalogo == "equipo") {
      $query = "SELECT 
      fecha_registro, num_serie AS 'Numero_Serie', 
      modelo, cla.nombre AS 'Equipo', 
      mar.nombre AS 'Marca', 
      are.nombre AS 'Area', 
      CONCAT(asi.nombre, ' ', asi.apellidos) AS 'Asignatario', 
      CONCAT(alm.cve_alm, ' ', alm.nombre) AS 'Almacen' 
      FROM ma_equi_sis 
      JOIN de_clasif_equi cla ON ma_equi_sis.id_clasif = cla.id 
      JOIN de_marca mar ON ma_equi_sis.id_marca = mar.id 
      JOIN de_area are ON ma_equi_sis.id_area = are.id 
      JOIN de_asignatario asi ON ma_equi_sis.id_asignatario = asi.id 
      JOIN de_almacen alm ON ma_equi_sis.id_almacen = alm.id";
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


function addAsignatario()
{
  $nombre = $_POST['nombre'];
  $apellidos = $_POST['apellidos'];

  $data = Querys::setAsignatario($nombre, $apellidos);
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

function addMarca()
{
  $nombre = $_POST['nombre'];

  $data = Querys::setMarca($nombre);
  header('Content-Type: application/json');
  return json_encode($data);
}

function addArea()
{
  $nombre = $_POST['nombre'];

  $data = Querys::setArea($nombre);
  header('Content-Type: application/json');
  return json_encode($data);
}

function addAlmacen()
{
  $nombre = $_POST['nombre'];
  $cve = $_POST['cve'];
  $zona = $_POST['zona'];

  $data = Querys::setAlmacen($nombre, $cve, $zona);
  header('Content-Type: application/json');
  return json_encode($data);
}

function addZona()
{
  $nombre = $_POST['nombre'];

  $data = Querys::setZona($nombre);
  header('Content-Type: application/json');
  return json_encode($data);
}

function addEquipo()
{
  $numserie = $_POST['numserie'];
  $modelo = $_POST['modelo'];
  $clasificacion = $_POST['clasificacion'];
  $marca = $_POST['marca'];
  $area = $_POST['area'];
  $asignatario = $_POST['asignatario'];
  $almacen = $_POST['almacen'];
  $f_registro = $_POST['f_registro'];

  $data = Querys::setEquipo($numserie, $modelo, $clasificacion, $marca, $area, $almacen, $asignatario, $f_registro);
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
