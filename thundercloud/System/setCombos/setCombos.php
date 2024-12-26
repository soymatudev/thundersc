<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 26/02/2024
ruta: thundersc/thundercloud/system/setCombos/setCombos.php
===============================================================================*/

require_once('../Connection/Connection.php');
require_once('../Connection/Statement.php');

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

  public static function getZona()
  {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT nombre FROM de_zona";
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

  public static function getArea()
  {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT nombre FROM de_area";
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

  public static function getUbicacion()
  {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT nombre FROM ma_ubicacion";
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

  public static function getClasif()
  {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT nombre FROM de_clasif_equi";
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

  public static function getComponente()
  {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT nombre FROM de_componente";
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

  public static function getEquipoMaq() {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT nombre FROM de_equi_maq";
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

  function getSubEquipoMaq() {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT nombre FROM de_subequi_maq";
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

  public function getEquipoTrabajo () {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT cve FROM de_equi_trabajo";
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

  public function getAsignatario () {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT CONCAT(nombre, ' ', apellidos) AS nombre FROM de_asignatario";
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

  public function getMarca () {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT DISTINCT nombre FROM de_marca";
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

  public function getAlmacen () {
    $con = Connection::connect();

    if (!$con) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT CONCAT(cve_alm, ' ', nombre) AS nombre FROM de_almacen";
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

function zona()
{
  $Querys = new Querys();
  $cedisData = $Querys->getZona();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function area()
{
  $Querys = new Querys();
  $cedisData = $Querys->getArea();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function ubicacion () {
  $Querys = new Querys();
  $cedisData = $Querys->getUbicacion();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function clasif () {
  $Querys = new Querys();
  $cedisData = $Querys->getClasif();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function componente () {
  $Querys = new Querys();
  $cedisData = $Querys->getComponente();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function equipomaq (){
  $Querys = new Querys();
  $cedisData = $Querys->getEquipoMaq();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function subequipomaq() {
  $Querys = new Querys();
  $cedisData = $Querys->getSubEquipoMaq();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function equipostrabajo() {
  $Querys = new Querys();
  $cedisData = $Querys->getEquipoTrabajo();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function asignatario() {
  $Querys = new Querys();
  $cedisData = $Querys->getAsignatario();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function marca() {
  $Querys = new Querys();
  $cedisData = $Querys->getMarca();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function almacen() {
  $Querys = new Querys();
  $cedisData = $Querys->getAlmacen();
  $Querys->cerrarConexion(); // Cierra la conexión después de obtener los datos
  header('Content-Type: application/json');
  return json_encode($cedisData);
}

function almacenScorpion() {
  $almacenes = ["E01"=>"192.168.102.1","E02"=>"192.168.111.1","E03"=>"192.168.109.1","E04"=>"192.168.121.1","E05"=>"192.168.110.1","E06"=>"192.168.119.1","E07"=>"192.168.120.1","E08"=>"192.168.124.1","E09"=>"192.168.138.1","E10"=>"192.168.134.1","E11"=>"192.168.105.1","E12"=>"192.168.137.1","E13"=>"192.168.113.1","E14"=>"192.168.117.1","E15"=>"192.168.139.1","E16"=>"192.168.128.1","E17"=>"192.168.107.1","E18"=>"192.168.101.1","E19"=>"192.168.116.1","E20"=>"192.168.129.1","E21"=>"192.168.104.1","E22"=>"192.168.106.1","E23"=>"192.168.118.1","E24"=>"192.168.142.1","E25"=>"192.168.143.1","E26"=>"192.168.144.1","E27"=>"192.168.149.1","E28"=>"192.168.103.1","E29"=>"192.168.150.1","E30"=>"192.168.108.1","E31"=>"192.168.132.1","E32"=>"192.168.131.1","E33"=>"192.168.135.1","E34"=>"192.168.126.1","E35"=>"192.168.114.1","E36"=>"192.168.131.1","E37"=>"192.168.141.1","E38"=>"192.168.115 1","E39"=>"192.168.227.1","E40"=>"192.168.148.1","E41"=>"192.168.145.1","E42"=>"192.168.156.1","E43"=>"192.168.155.1","E44"=>"192.168.122.1","E45"=>"192.168.153.1","E46"=>"192.168.158.1","E47"=>"192.168.160.1","E48"=>"192.168.147.1","E49"=>"192.168.161.1","E50"=>"192.168.162.1","E51"=>"192.168.163.1","E52"=>"192.168.164.1","E53"=>"192.168.125.1","E54"=>"192.168.165.1","E55"=>"192.168.166.1","E56"=>"192.168.167.1","E57"=>"192.168.168.1","E58"=>"192.168.170.1","E59"=>"192.168.183.1","E60"=>"192.168.195.1","E61"=>"192.168.168.1","E62"=>"192.168.150.1","E63"=>"192.168.159.1","E64"=>"192.168.123.1","E65"=>"192.168.171.1","E66"=>"192.168.172.1","E67"=>"192.168.174.1","E68"=>"192.168.173.1","E69"=>"192.168.175.1","E70"=>"192.168.177.1","E71"=>"192.168.179.1","E72"=>"192.168.182.1","E73"=>"192.168.136.1","E74"=>"192.168.194.1","E75"=>"192.168.186.1","E76"=>"192.168.188.1","E77"=>"192.168.189.1","E78"=>"192.168.191.1"];
  header('Content-Type: application/json');
  return json_encode($almacenes);
}