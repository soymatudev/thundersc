<?php
require_once('../../Connection/Connection.php');
require_once('../../Connection/Statement.php');
/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 14/12/2023
Descripción: Devuelve los datos para generar los Charts de la pagina Table
===============================================================================
*/
class CreateChartTable extends Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    // Abre la conexión al momento de instanciar la clase
    $this->conexion = Connection::connect();
  }

  public static function getTipo($equipo)
  {
    $conn = Connection::connect();

    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT gr.tipo as tipo FROM equipo eq 
    JOIN grupo gr ON eq.id_agrupacion = gr.id
    WHERE eq.alias = :equipo";

    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':equipo', $equipo, PDO::PARAM_STR);
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    }
  }

  public static function getHistorialData()
  {
    $conn = Connection::connect();

    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $cedis = $_POST['cedis'];
    $grupo = $_POST['grupo'];
    $equipo = $_POST['equipo'];
    $f_ini = $_POST['f_ini'];
    $f_fin = $_POST['f_fin'];

    
    $resultados = array();  // Inicializa un array para almacenar los resultados
    $query = '';

    $tipo = self::getTipo($equipo);

    file_put_contents(self::LOG_FILE, "\nCedis => $cedis Grupo => $grupo Equipo => $equipo f_ini => $f_ini f_fin => $f_fin Tipo => {$tipo[0]['tipo']} \n", FILE_APPEND);


    if ($tipo[0]['tipo'] == "MOLINO") {
      $query = "SELECT ma.dato_1 as dato_1 FROM ma_registro ma 
        JOIN equipo eq ON ma.id_equipo = eq.id 
        JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
        JOIN cedis ce ON ag.id_cedis = ce.id
        JOIN unidad un ON eq.id_unidad = un.id
        WHERE zona = :grupo 
        AND ce.cedis = :cedis 
        AND ma.fecha_hora >= :f_ini
        AND ma.fecha_hora <= :f_fin
        AND eq.alias = :equipo";
    } else if ($tipo[0]['tipo'] == "SILO") {
      $query = "SELECT 
      CASE WHEN (ma.dato_1/100) > eq.alto THEN 0.00 ELSE ROUND((eq.ancho * eq.largo * (eq.alto - (CAST(ma.dato_1 AS DECIMAL(10, 2))/100)))*eq.densidad, 2) END AS dato_1 FROM ma_registro ma 
      JOIN equipo eq ON ma.id_equipo = eq.id 
      JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
      JOIN cedis ce ON ag.id_cedis = ce.id
      JOIN unidad un ON eq.id_unidad = un.id
      WHERE zona = :grupo
      AND ce.cedis = :cedis
      AND ma.fecha_hora >= :f_ini 
      AND ma.fecha_hora <= :f_fin
      AND eq.alias = :equipo";
    }

    $stmt = self::prepareStatement($query);

      if ($stmt) {
        $stmt->bindParam(':grupo', $grupo, PDO::PARAM_STR);
        $stmt->bindParam(':cedis', $cedis, PDO::PARAM_STR);
        $stmt->bindParam(':f_ini', $f_ini, PDO::PARAM_STR);
        $stmt->bindParam(':f_fin', $f_fin, PDO::PARAM_STR);
        $stmt->bindParam(':equipo', $equipo, PDO::PARAM_STR);
        $resultados[$equipo] = self::executePreparedQuery($stmt);

        if ($resultados !== false) {
          file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
          file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($resultados, true) . "\n", FILE_APPEND);
          return $resultados;
        } else {
          file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
          return ["Execute" => "Incorrect"];
        }
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
  }

  public static function getHistorialTiempo()
  {

    $conn = Connection::connect();
    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $cedis = $_POST['cedis'];
    $grupo = $_POST['grupo'];
    $equipo = $_POST['equipo'];
    $f_ini = $_POST['f_ini'];
    $f_fin = $_POST['f_fin'];
    $resultados = array();  // Inicializa un array para almacenar los resultados

    if ($equipo) {
      $query = "SELECT 
        DATE_FORMAT(fecha_hora, 'Día-%d %H:%i') AS hora_minutos FROM ma_registro ma 
        JOIN equipo eq ON ma.id_equipo = eq.id 
        JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
        JOIN cedis ce ON ag.id_cedis = ce.id
        JOIN unidad un ON eq.id_unidad = un.id
        WHERE zona = :grupo
        AND ce.cedis = :cedis
        AND ma.fecha_hora >= :f_ini
        AND ma.fecha_hora <= :f_fin
        AND eq.alias = :equipo";
    }

    $stmt = self::prepareStatement($query);
    if ($stmt) {
      $stmt->bindParam(':grupo', $grupo, PDO::PARAM_STR);
      $stmt->bindParam(':cedis', $cedis, PDO::PARAM_STR);
      $stmt->bindParam(':f_ini', $f_ini, PDO::PARAM_STR);
      $stmt->bindParam(':f_fin', $f_fin, PDO::PARAM_STR);
      $stmt->bindParam(':equipo', $equipo, PDO::PARAM_STR);
      $resultados[$equipo] = self::executePreparedQuery($stmt);

      if ($resultados !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($resultados, true) . "\n", FILE_APPEND);
        return $resultados;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function getHistorialExtra()
  {

    $conn = Connection::connect();
    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $cedis = $_POST['cedis'];
    $grupo = $_POST['grupo'];
    $equipo = $_POST['equipo'];
    $f_ini = $_POST['f_ini'];
    $f_fin = $_POST['f_fin'];
    // $equipo = CreateChartTable::getEquipo();
    $resultados = array();  // Inicializa un array para almacenar los resultados

    $tipo = self::getTipo($equipo);

    if ($tipo[0]['tipo'] == "MOLINO") {
      $query = "SELECT 
        CAST((CAST(ma.dato_1 AS DECIMAL(10,2)) * 220) / 1000 AS DECIMAL(7,3)) AS Extra FROM ma_registro ma 
        JOIN equipo eq ON ma.id_equipo = eq.id 
        JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
        JOIN cedis ce ON ag.id_cedis = ce.id
        JOIN unidad un ON eq.id_unidad = un.id
        WHERE zona = :grupo
        AND ce.cedis = :cedis
        AND ma.fecha_hora >= :f_ini
        AND ma.fecha_hora <= :f_fin
        AND eq.alias = :equipo";
    } else if ($tipo[0]['tipo'] == "SILO") {
      $query = "SELECT 
        CASE WHEN (ma.dato_1/100) > eq.alto THEN 0.00 ELSE ROUND((((eq.ancho * eq.largo * (eq.alto - (CAST(ma.dato_1 AS DECIMAL(10, 2))/100)))) * 100) / (eq.ancho * eq.largo * eq.alto), 2) END AS Extra FROM ma_registro ma 
        JOIN equipo eq ON ma.id_equipo = eq.id 
        JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
        JOIN cedis ce ON ag.id_cedis = ce.id
        JOIN unidad un ON eq.id_unidad = un.id
        WHERE zona = :grupo
        AND ce.cedis = :cedis
        AND ma.fecha_hora >= :f_ini
        AND ma.fecha_hora <= :f_fin
        AND eq.alias = :equipo";
    }

    $stmt = self::prepareStatement($query);
    if ($stmt) {
      $stmt->bindParam(':grupo', $grupo, PDO::PARAM_STR);
      $stmt->bindParam(':cedis', $cedis, PDO::PARAM_STR);
      $stmt->bindParam(':f_ini', $f_ini, PDO::PARAM_STR);
      $stmt->bindParam(':f_fin', $f_fin, PDO::PARAM_STR);
      $stmt->bindParam(':equipo', $equipo, PDO::PARAM_STR);
      $resultados[$equipo] = self::executePreparedQuery($stmt);

      if ($resultados !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($resultados, true) . "\n", FILE_APPEND);
        return $resultados;
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


function historialData()
{
  $setHistorial = new CreateChartTable();
  $historialData = $setHistorial->getHistorialData();
  $setHistorial->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($historialData);
}

function historialTiempo()
{
  $setHistorial = new CreateChartTable();
  $historialData = $setHistorial->getHistorialTiempo();
  $setHistorial->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($historialData);
}

function historialExtra()
{
  $setHistorial = new CreateChartTable();
  $historialData = $setHistorial->getHistorialExtra();
  $setHistorial->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($historialData);
}
    