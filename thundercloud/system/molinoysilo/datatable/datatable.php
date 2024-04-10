<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 15/02/2024
ruta: thundersc/thundercloud/system/molinoysilo/datatable/datatable.php
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

  public static function getTipo($equipo)
  {
    $conexion = Connection::connect();

    $query = "SELECT DISTINCT gr.tipo FROM equipo eq 
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

  public static function getData()
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
    $tipo = self::getTipo($equipo);

    if ($tipo[0]['tipo'] == "MOLINO") {
      $query = "SELECT 
        ma.id, 
        eq.alias, 
        ma.fecha_hora, 
    CASE
        WHEN un.unidad = 'AMPERE' THEN CONCAT(ma.dato_1, ' A') 
        WHEN un.unidad = 'WATT' THEN CONCAT(ma.dato_1, ' W') ELSE ma.dato_1 END AS dato_1,
        ma.dato_2, 
        eq.zona, 
        ce.cedis, 
        CONCAT(CAST((CAST(ma.dato_1 AS DECIMAL(10,2)) * 220) / 1000 AS DECIMAL(7,3)), ' KWh') AS KWh 
    FROM 
        ma_registro ma 
        JOIN equipo eq ON ma.id_equipo = eq.id 
        JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
        JOIN cedis ce ON ag.id_cedis = ce.id
        JOIN unidad un ON eq.id_unidad = un.id
    WHERE 
        zona = :grupo 
        AND ce.cedis = :cedis 
        AND ma.fecha_hora >= :f_ini 
        AND ma.fecha_hora <= :f_fin 
        AND eq.alias = :equipo";
    } else if ($tipo[0]['tipo'] == "SILO") {
      $query = "SELECT 
        ma.id, 
        eq.alias, 
        ma.fecha_hora, 
        CASE WHEN (ma.dato_1/100) > eq.alto THEN 'ERROR' ELSE CONCAT(ROUND(((eq.ancho * eq.largo * (eq.alto - (CAST(ma.dato_1 AS DECIMAL(10, 2))/100)))*eq.densidad), 2), ' Ton') END AS dato_1,
        /* CONCAT(ROUND(CAST(ma.dato_2 AS DECIMAL(10,2))/100, 1), ' °C') AS dato_2,  */
        CASE WHEN (ma.dato_1/100) > eq.alto THEN CONCAT(dato_1/100, ' m') ELSE CONCAT(dato_1/100, ' m') END AS dato_2, 
        eq.zona, 
        ce.cedis, 
        CASE WHEN (ma.dato_1/100) > eq.alto THEN 'ERROR' ELSE CONCAT(ROUND((((eq.ancho * eq.largo * (eq.alto - (CAST(ma.dato_1 AS DECIMAL(10, 2))/100)))) * 100) / (eq.ancho * eq.largo * eq.alto), 2), ' %') END AS Volumen
    FROM 
        ma_registro ma 
        JOIN equipo eq ON ma.id_equipo = eq.id 
        JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
        JOIN cedis ce ON ag.id_cedis = ce.id
        JOIN unidad un ON eq.id_unidad = un.id
    WHERE
        zona = :grupo 
        AND ce.cedis = :cedis 
        AND ma.fecha_hora >= :f_ini 
        AND ma.fecha_hora <= :f_fin 
        AND eq.alias = :equipo";
    }

    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $stmt->bindParam(':cedis', $cedis, PDO::PARAM_STR);
      $stmt->bindParam(':grupo', $grupo, PDO::PARAM_STR);
      $stmt->bindParam(':equipo', $equipo, PDO::PARAM_STR);
      $stmt->bindParam(':f_ini', $f_ini, PDO::PARAM_STR);
      $stmt->bindParam(':f_fin', $f_fin, PDO::PARAM_STR);
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


function table()
{
  $data = Querys::getData();
  header('Content-Type: application/json');
  echo json_encode($data);
}
