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
      $query = "SELECT CONCAT(nombre, ' ', apellidos) AS 'Asignatario' FROM de_asignatario WHERE 1";
      $query .= !empty($_POST['nombre']) ? " AND nombre LIKE '%" . $_POST['nombre'] . "%'" : "";
      $query .= !empty($_POST['apellidos']) ? " AND apellidos LIKE '%" . $_POST['apellidos'] . "%'" : "";
    
    } else if ($catalogo == "clasificacion") {
      $query = "SELECT nombre AS 'Equipo' FROM de_clasif_equi WHERE 1";
      $query .= !empty($_POST['nombre']) ? " AND nombre LIKE '%" . $_POST['nombre'] . "%'" : "";
    
    } else if ($catalogo == "marca") {
      $query = "SELECT nombre AS 'Marca' FROM de_marca WHERE 1";
      $query .= !empty($_POST['nombre']) ? " AND nombre LIKE '%" . $_POST['nombre'] . "%'" : "";
    
    } else if ($catalogo == "area") {
      $query = "SELECT nombre AS 'Area' FROM de_area WHERE 1";
      $query .= !empty($_POST['nombre']) ? " AND nombre LIKE '%" . $_POST['nombre'] . "%'" : "";
    
    } else if ($catalogo == "zona") {
      $query = "SELECT nombre AS 'Zona' FROM de_zona WHERE 1";
      $query .= !empty($_POST['nombre']) ? " AND nombre LIKE '%" . $_POST['nombre'] . "%'" : "";
    
    } else if ($catalogo == "almacen") {
      $query = "SELECT alm.nombre AS 'Almacen', cve_alm AS 'Cve Almacen', dz.nombre AS 'Zona' 
      FROM de_almacen alm JOIN de_zona dz ON alm.id_zona = dz.id WHERE 1";
      $query .= !empty($_POST['nombre']) ? " AND alm.nombre LIKE '%" . $_POST['nombre'] . "%'" : "";
      $query .= !empty($_POST['cve_alm']) ? " AND cve_alm LIKE '%" . $_POST['cve_alm'] . "%'" : "";
      $query .= !empty($_POST['zona']) ? " AND dz.nombre LIKE '%" . $_POST['zona'] . "%'" : "";

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
      JOIN de_almacen alm ON ma_equi_sis.id_almacen = alm.id WHERE 1";

      $query .= !empty($_POST['num_serie']) ? " AND num_serie LIKE '%" . $_POST['num_serie'] . "%'" : "";
      $query .= !empty($_POST['modelo']) ? " AND modelo LIKE '%" . $_POST['modelo'] . "%'" : "";
      $query .= !empty($_POST['clasificacion']) ? " AND cla.nombre LIKE '%" . $_POST['clasificacion'] . "%'" : "";
      $query .= !empty($_POST['marca']) ? " AND mar.nombre LIKE '%" . $_POST['marca'] . "%'" : "";
      $query .= !empty($_POST['area']) ? " AND are.nombre LIKE '%" . $_POST['area'] . "%'" : "";
      $query .= !empty($_POST['asignatario']) ? " AND CONCAT(asi.nombre, ' ', asi.apellidos) LIKE '%" . $_POST['asignatario'] . "%'" : "";
      $query .= !empty($_POST['almacen']) ? " AND CONCAT(alm.cve_alm, ' ', alm.nombre) LIKE '%" . $_POST['almacen'] . "%'" : "";
      $query .= !empty($_POST['f_Ini']) && !empty($_POST['f_Fin']) ? " AND fecha_registro BETWEEN '" . $_POST['f_Ini'] . "' AND  '" . $_POST['f_Fin'] . "'" : "";
      $query .= !empty($_POST['f_Ini']) && empty($_POST['f_Fin']) ? " AND fecha_registro = '" . $_POST['f_Ini'] . "'" : "";
      $query .= !empty($_POST['f_Fin']) && empty($_POST['f_Ini']) ? " AND fecha_registro = '" . $_POST['f_Fin'] . "'" : "";
      
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

function showTable()
{
  $catalogo = $_POST['catalogo'];
  $data = Querys::getTable($catalogo);
  //$data->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($data);
}
