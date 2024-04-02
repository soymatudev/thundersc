<?php
require_once('../../Connection/Connection.php');
require_once('../../prepare/Statement.php');
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


  public static function getMol()
  {
    $conn = Connection::connect();

    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }
    $query = "SELECT DISTINCT eq.alias as 'alias' FROM 
    ma_registro ma 
    JOIN equipo eq 
    JOIN de_agrupacion ag 
    JOIN empresa em ON ag.id_empresa = em.id 
    JOIN cedis ce ON ag.id_cedis = ce.id 
    JOIN grupo gr ON ag.id_grupo = gr.id 
    WHERE ma.id_equipo = eq.id 
    AND eq.id_agrupacion = ag.id 
    AND ag.id_grupo = 1";
    $stmt = self::prepareStatement($query);
    if ($stmt) {
      $result = self::executePreparedQuery($stmt);

      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct => Obentenemos los nombres\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => ".print_r($result, true)."\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    }
  }

  public static function AmpereMol()
  {
    $NombreMolinos = self::getMol();
    $resultados = array();
    $activos = array();

    foreach ($NombreMolinos as $value) {
      $query = "SELECT ma.dato_1 as 'dato_1' FROM ma_registro ma 
      JOIN equipo eq 
      JOIN de_agrupacion ag 
      JOIN empresa em ON ag.id_empresa = em.id 
      JOIN cedis ce ON ag.id_cedis = ce.id 
      JOIN grupo gr ON ag.id_grupo = gr.id 
      WHERE ma.id_equipo = eq.id 
      AND eq.alias = :value 
      AND eq.id_agrupacion = ag.id ORDER BY ma.fecha_hora DESC LIMIT 3";
      
      $stmt = self::prepareStatement($query);
      if ($stmt) {
        $stmt->bindParam(':value', $value['alias']);
        $resultados[$value['alias']] = self::executePreparedQuery($stmt);
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute AmpereMol => ".print_r($resultados, true)."\n", FILE_APPEND);
       
      } 
    }

    $contA = 0;
    $index = 0;
    foreach ($NombreMolinos as $molino) {
      foreach ($resultados[$molino['alias']] as $value) {
        if ($value >= 1) {
          $contA++;
        }
      }
      $contA >= 2 ? $activos[$index] = true : $activos[$index] = false;
      $index++;
      $contA = 0;
    }
    
    if ($activos !== false ) {
      file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
      file_put_contents(self::LOG_FILE, "\nExecute Activos => ".print_r($activos, true)."\n", FILE_APPEND);
       
      return $activos;
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function getHistorialA () {
    $NombreMolinos = self::getMol();
    $resulktados = array();

    if ($NombreMolinos) {
      foreach ($NombreMolinos as $value) {
        $query = "SELECT ma.dato_1 FROM ma_registro ma 
        JOIN equipo eq 
        JOIN de_agrupacion ag 
        JOIN empresa em ON ag.id_empresa = em.id 
        JOIN cedis ce ON ag.id_cedis = ce.id 
        JOIN grupo gr ON ag.id_grupo = gr.id 
        WHERE ma.id_equipo = eq.id 
        AND eq.alias = :value 
        AND eq.id_agrupacion = ag.id 
        AND DATE(ma.fecha_hora) = CURDATE() 
        ORDER BY fecha_hora DESC LIMIT 48";
        
        $stmt = self::prepareStatement($query);
        if ($stmt) {
          $stmt->bindParam(':value', $value['alias']);
          $resultados[$value['alias']] = self::executePreparedQuery($stmt);
          file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
          file_put_contents(self::LOG_FILE, "\nExecute HistorialA => ".print_r($resultados, true)."\n", FILE_APPEND);
          return $resultados;
        } else {
          file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
          return ["Execute" => "Incorrect"];
        }
      }
    }
  }

  public static function getHistorialTiempo() {
    $NombreMolinos = self::getMol();
    $resultados = array();

    if ($NombreMolinos) {
      foreach ($NombreMolinos as $value) {
        $query = "SELECT 
        CONCAT(
          LPAD(HOUR(fecha_hora), 2, '0'),
          ':',
          LPAD(MINUTE(fecha_hora), 2, '0')
        ) AS hora_minutos FROM ma_registro ma 
        JOIN equipo eq 
        JOIN de_agrupacion ag 
        JOIN empresa em ON ag.id_empresa = em.id 
        JOIN cedis ce ON ag.id_cedis = ce.id 
        JOIN grupo gr ON ag.id_grupo = gr.id 
        WHERE ma.id_equipo = eq.id 
        AND eq.alias = :value 
        AND eq.id_agrupacion = ag.id 
        AND DATE(ma.fecha_hora) = CURDATE() 
        ORDER BY fecha_hora DESC LIMIT 48";
        
        $stmt = self::prepareStatement($query);
        if ($stmt) {
          $stmt->bindParam(':value', $value['alias']);
          $resultados[$value['alias']] = self::executePreparedQuery($stmt);
          file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
          file_put_contents(self::LOG_FILE, "\nExecute HistorialTiempo => ".print_r($resultados, true)."\n", FILE_APPEND);
          return $resultados;
        }
      }
    }
  }

  public static function getTiempoT() {
    $NombreMolinos = self::getMol();
    $resultados = array();

    if ($NombreMolinos) {
      foreach ($NombreMolinos as $value) {
        $query = "SELECT 
        SUM(tiempo_trabajado) / 3600 AS tiempo_trabajado_en_horas
        FROM (
        SELECT 
            m.id_equipo,
            IF(CAST(m.dato_1 AS DECIMAL(10,2)) >= 1, TIMESTAMPDIFF(SECOND, m.fecha_hora, LEAD(m.fecha_hora) OVER (ORDER BY m.fecha_hora)), 0) AS tiempo_trabajado
        FROM ma_registro m
        JOIN equipo e ON m.id_equipo = e.id
        WHERE e.alias = :value
        AND YEARWEEK(m.fecha_hora, 1) = YEARWEEK(NOW(), 1)) AS subconsulta
        JOIN equipo e ON subconsulta.id_equipo = e.id
        GROUP BY e.nombre";
        
        $stmt = self::prepareStatement($query);
        if ($stmt) {
          $stmt->bindParam(':value', $value['alias']);
          $resultados[$value['alias']] = self::executePreparedQuery($stmt);
          file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
          file_put_contents(self::LOG_FILE, "\nExecute TiempoT => ".print_r($resultados, true)."\n", FILE_APPEND);
          return $resultados;
        }
      }
    }
  }

  public function cerrarConexion()
  {
    // Cierra la conexion cuando ya no sea necesaria
    $this->conexion = null;
  }
}

function mol()
{
  $setMol = new Querys();
  $molData = $setMol->getMol();
  $setMol->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($molData);
}

function ampere()
{
  $setMol = new Querys();
  $molData = $setMol->AmpereMol();
  $setMol->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($molData);
}

function historial()
{
  $setHistorial = new Querys();
  $historialData = $setHistorial->getHistorialA();
  $setHistorial->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($historialData);
}

function historialTiempo()
{
  $setHistorial = new Querys();
  $historialData = $setHistorial->getHistorialTiempo();
  $setHistorial->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($historialData);
}

function tiempoT()
{
  $setTiempo = new Querys();
  $tiempoT = $setTiempo->getTiempoT();
  $setTiempo->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($tiempoT);
}