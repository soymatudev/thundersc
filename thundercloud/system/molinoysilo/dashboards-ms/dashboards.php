<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 15/02/2024
ruta: thundersc/thundercloud/system/molinoysilo/datatable/call.php
===============================================================================*/

require_once('../../Connection/Connection.php');
require_once('../../Connection/Statement.php');

class DatosMol extends Statement
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
      /* $query = "SELECT ma.dato_1 as 'dato_1' FROM ma_registro ma 
      JOIN equipo eq 
      JOIN de_agrupacion ag 
      JOIN empresa em ON ag.id_empresa = em.id 
      JOIN cedis ce ON ag.id_cedis = ce.id 
      JOIN grupo gr ON ag.id_grupo = gr.id 
      WHERE ma.id_equipo = eq.id 
      AND eq.alias = :value 
      AND eq.id_agrupacion = ag.id ORDER BY ma.fecha_hora DESC LIMIT 3"; */
      $query = "SELECT ma.dato_1
                  FROM ma_registro ma
                  JOIN equipo eq ON ma.id_equipo = eq.id
                  JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
                  WHERE eq.alias = :value
                  AND ma.fecha_hora >= NOW() - INTERVAL 1 HOUR
                  ORDER BY ma.fecha_hora DESC
                  LIMIT 3
              
              UNION ALL
              (
                SELECT 0.0
                  FROM ma_registro ma
                  WHERE NOT EXISTS (
                      SELECT ma.dato_1
                      FROM ma_registro ma
                      JOIN equipo eq ON ma.id_equipo = eq.id
                      JOIN de_agrupacion ag ON eq.id_agrupacion = ag.id
                      WHERE eq.alias = :valueB
                      AND ma.fecha_hora >= NOW() - INTERVAL 1 HOUR
                      LIMIT 3
                  )
            LIMIT 3
              )
              LIMIT 3";
      
      $stmt = self::prepareStatement($query);
      if ($stmt) {
        $stmt->bindParam(':value', $value['alias']);
        $stmt->bindParam(':valueB', $value['alias']);
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

  public static function getTiempoTS()
  {

    $NombreMolinos = self::getMol();
    $resultados = array();  // Inicializa un array para almacenar los resultados

    if ($NombreMolinos) {
      foreach ($NombreMolinos as $value) {
        //$query = "SELECT TIME_TO_SEC(TIMEDIFF(MAX(mr.fecha_hora), MIN(mr.fecha_hora))) / 3600 AS tiempo_trabajado_en_horas FROM ma_registro mr JOIN equipo eq ON mr.id_equipo = eq.id WHERE eq.nombre = '" . $value . "'" . " AND WEEK(mr.fecha_hora, 1) = WEEK(NOW(), 1)";
        $query = "SELECT 
        SUM(tiempo_trabajado) / 3600 AS tiempo_trabajado_en_horas
        FROM (
        SELECT 
            m.id_equipo,
            IF(CAST(m.dato_1 AS DECIMAL(10,2)) >= 1, TIMESTAMPDIFF(SECOND, m.fecha_hora, LEAD(m.fecha_hora) OVER (ORDER BY m.fecha_hora)), 0) AS tiempo_trabajado
        FROM 
            ma_registro m
        JOIN 
            equipo e ON m.id_equipo = e.id
        WHERE 
            e.alias = :value AND
        YEARWEEK(m.fecha_hora, 1) = YEARWEEK(NOW(), 1)
        ) AS subconsulta
        JOIN 
            equipo e ON subconsulta.id_equipo = e.id
        GROUP BY 
            e.alias";
        $stmt = self::prepareStatement($query);
        $stmt->bindParam(':value', $value['alias']);
        $resultados[$value['alias']] = self::executePreparedQuery($stmt);
      }
    }

    if ($resultados !== false) {
      file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
      file_put_contents(self::LOG_FILE, "\nExecute TiempoTS => ".print_r($resultados, true)."\n", FILE_APPEND);
      return $resultados;  // Devuelve el array asociativo
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function getNomSilo()
  {
    $query = "SELECT DISTINCT eq.alias as 'alias' FROM ma_registro ma 
    JOIN equipo eq 
    JOIN de_agrupacion ag 
    JOIN empresa em ON ag.id_empresa = em.id 
    JOIN cedis ce ON ag.id_cedis = ce.id 
    JOIN grupo gr ON ag.id_grupo = gr.id 
    WHERE ma.id_equipo = eq.id 
    AND eq.id_agrupacion = ag.id 
    AND ag.id_grupo = 2";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => ".print_r($result, true)."\n", FILE_APPEND);
        
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    }
  }

  public static function getVolumen()
  {
    $NombreSilos = self::getNomSilo();
    $resultados = array();

    if ($NombreSilos) {
      foreach ($NombreSilos as $value) {
        $query = "SELECT
        CASE WHEN (ma.dato_1/100) > eq.alto THEN 0.00 ELSE 
        ROUND
        (
          (
            ((eq.ancho * eq.largo * (eq.alto - (CAST(ma.dato_1 AS DECIMAL(10, 2))/100))))
            * 100
          ) / (eq.ancho * eq.largo * eq.alto), 2
        ) END AS porcentaje,
        CASE WHEN 
        (ma.dato_1/100) > eq.alto THEN 0.00 ELSE 
        CONCAT(ROUND(((eq.ancho * eq.largo * (eq.alto - (CAST(ma.dato_1 AS DECIMAL(10, 2))/100)))*eq.densidad), 2), ' Ton') 
        END AS dato_1,
        eq.materia_prima
    FROM ma_registro ma 
    JOIN equipo eq 
    JOIN de_agrupacion ag 
    JOIN empresa em 
    ON ag.id_empresa = em.id 
    JOIN cedis ce 
    ON ag.id_cedis = ce.id 
    JOIN grupo gr 
    ON ag.id_grupo = gr.id 
    WHERE ma.id_equipo = eq.id 
        AND eq.alias = :value AND eq.id_agrupacion = ag.id 
        AND fecha_hora >= CONVERT(CURDATE(), DATETIME) 
    ORDER BY ma.fecha_hora DESC 
    LIMIT 1";

        $stmt = self::prepareStatement($query);
        $stmt->bindParam(':value', $value['alias']);
        $resultados[$value['alias']] = self::executePreparedQuery($stmt);
      }
    }
    if ($resultados !== false) {
      file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
      file_put_contents(self::LOG_FILE, "\nExecute => ".print_r($resultados, true)."\n", FILE_APPEND);
      return $resultados;
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
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
  $setMol = new DatosMol();
  $molData = $setMol->getMol();
  $setMol->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($molData);
}

function ampere()
{
  $setMol = new DatosMol();
  $molData = $setMol->AmpereMol();
  $setMol->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($molData);
}

function tiempoTS()
{
  $setTiempo = new DatosMol();
  $tiempoT = $setTiempo->getTiempoTS();
  $setTiempo->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($tiempoT);
}

function volumen()
{
  $setVol = new DatosMol();
  $volumenS = $setVol->getVolumen();
  $setVol->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($volumenS);
}
