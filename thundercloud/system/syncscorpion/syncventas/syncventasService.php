<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 07/10/2024
ruta: thundersc/thundercloud/system/syncscorpion/syncventas/call.php
===============================================================================*/
require_once('../../Connection/Connection.php');
require_once('../../Connection/Statement.php');
require_once('../almac_scorpion/almacenes.php');
require '../../../vendor/autoload.php';

class Syncventas {

    private const LOG_FILE = 'process.log';

    public function sync($almacen, $dia) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../../../');
        $dotenv->load();

        $fecha = date('Ymd')-1;
        if (trim($dia) != '') {
            $dia = DateTime::createFromFormat("Y-m-d", $dia);
            $dia = $dia->format("Ymd");
            $fecha = $dia;
        }
        file_put_contents(self::LOG_FILE, "\nFecha => $fecha\n", FILE_APPEND);
        $output = ""; $php_process = "/usr/local/zend/bin/php /home/vharo/errorScor.php $almacen $fecha";
        //$php_process = '/usr/local/zend/bin/php -v';
        $pass = $_ENV['PASSWORD_SERVER_SYNC'];
        $user = $_ENV['USER_SERVER_SYNC'];
        $server = $_ENV['SERVER_SYNC'];

        $command = "sshpass -p $pass ssh -o StrictHostKeyChecking=no $user@$server '$php_process'";
        exec($command, $output, $returnCode);
    
        $this->getData($output, $almacen, $fecha);
        return $returnCode == 0;
    }
    
    public function loop($almacenesP, $dia = '') {
        //$almacenesP = ["E01" => "192.168.102.1"];
        file_put_contents(self::LOG_FILE, "\nFecha => $dia\n", FILE_APPEND);
        try {
        foreach ($almacenesP as $almacen => $server) {
            $status = $this->sync($almacen, $dia);
            sleep(5);
        }
        } catch (Exception $e) {
            file_put_contents(self::LOG_FILE, "\nError durante la ejecucion => \n". $e , FILE_APPEND);
            return ["Execute" => "Incorrect"];
        }
    }
    
    public function getData($info, $almacen, $fecha) {
        $MAY = []; $TDA = [];
        $dataServer = ''; $countTip = 0;
        $dbname = ''; $user = ''; $pw = '';
        $cves = ["CVE_VND", "DEVO_CRED", "DEVO_CONT", "DEVO", "VENTA_CRED", "VENTA_CONT", "VENTA", 'COMIS', 'TOTVTA', 'ALLVTA'];
    
        foreach ($info as $ii => $line) {
            if (strpos($line, 'ip=') !== false) {
    
                //echo "IP: " .trim($line)."\n";
                $dataServer = str_replace(['ip=', 'dbname=', 'user=', 'pw=', ';'], '', trim($line));
                $dataServer = explode(' ', $dataServer);
                $ip = $dataServer[0] ?? null; $dbname = $dataServer[1] ?? null; 
                $user = $dataServer[2] ?? null; $pw = $dataServer[3] ?? null;
                //echo "IP: $ip | DB: $dbname | User: $user | PW: $pw\n";
                $Querys = new Querys();
                $Querys->setAlmacenes($almacen, $ip, $dbname, $user, $pw);
    
            } else if (strpos($line, 'MAY') !== false || strpos($line, 'TDA') !== false) {
    
                $vta = explode(' ', trim($line));
                $vtaSco = $vta[3] ?? null;
                $vtaPcz = $vta[4] ?? null;
                $vtaDif = $vta[5] ?? null;
                
                if (strpos($line, 'MAY') !== false) {
                    $MAY["MAY"] = ['cve_alm' => $almacen, 'vtaSco' => $vtaSco, 'vtaPcz' => $vtaPcz, 'vtaDif' => $vtaDif];
                    $countTip = 0;
                } else {
                    $TDA["TDA"] = ['cve_alm' => $almacen, 'vtaSco' => $vtaSco, 'vtaPcz' => $vtaPcz, 'vtaDif' => $vtaDif];
                    $countTip = 0;
                }
            }
    
            foreach($cves as $i => $clave) {
                if(strpos($line, $clave) !== false) {
                    $cve = explode(' ', trim($line));
                    $valor = $cve[2] ?? null;
                    
                    if ($countTip < 14) {
                        $MAY["MAY"][$clave] = $valor;
                        $countTip++;
                    } else {
                        $TDA["TDA"][$clave] = $valor;
                    }
    
                }
            }
        }
        array_key_exists('MAY', $MAY) ? $MAY["MAY"] : $MAY["MAY"] = [];
        array_key_exists('TDA', $TDA) ? $TDA["TDA"] : $TDA["TDA"] = [];

        $adl1M = ''; $adl2M = ''; $adl1T = ''; $adl2T = '';
        $adl1M = count($MAY["MAY"]) > 0 ? 'S' : 'N';
        $adl2M = $adl1M == 'N' ? 'NO HAY DATOS DE VENTA' : '0';
        $adl1T = count($TDA["TDA"]) > 0 ? 'S' : 'N';
        $adl2T = $adl1T == 'N' ? 'NO HAY DATOS DE VENTA' : '0';

        if (count($MAY["MAY"]) <= 0) {
            $MAY["MAY"]['cve_alm'] = $almacen;
            $MAY["MAY"]['f_venta'] = $fecha;
            $MAY["MAY"]['tip_vta'] = 'MAY';
        } 
        if (count($TDA["TDA"]) <= 0) {
            $TDA["TDA"]['cve_alm'] = $almacen;
            $TDA["TDA"]['f_venta'] = $fecha;
            $TDA["TDA"]['tip_vta'] = 'TDA';
        }

        file_put_contents(self::LOG_FILE, "\nVentas de MAY => \n" . print_r($MAY, true), FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nVentas de TDA => \n" . print_r($TDA, true), FILE_APPEND);

        $Querys = new Querys();
        $Querys->setVta($MAY["MAY"], $almacen, $fecha, "MAY", $adl1M, $adl2M);
        $Querys->setVta($TDA["TDA"], $almacen, $fecha, "TDA", $adl1T, $adl2T);
    }
}


class Querys extends Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public static function setVta($arr_vta, $almacen, $fecha, $tip_vta, $adl1, $adl2)
  {
    try {
        $conn = Connection::connect();
        $query = '';

        if (!$conn) {
          file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
          return null;
        }
    
        /* $query = "INSERT INTO ma_vtasco
        (tip_vta, cve_alm, vta_sco, vta_pcz, vta_dif, f_venta, cve_vnd, devo_cred, devo_cont, 
        devo, vta_cred, vta_cont, venta, comis, tot_vta, all_vta, status, adl1, adl2)
        VALUES 
        (:tip_vta, :cve_alm, :vta_sco, :vta_pcz, :vta_dif, :f_venta, :cve_vnd, :devo_cred, :devo_cont, 
        :devo, :vta_cred, :vta_cont, :venta, :comis, :tot_vta, :all_vta, :statuss, :adl1, :adl2)"; */

        $query_ver = "SELECT * FROM ma_vtasco WHERE cve_alm = '{$arr_vta['cve_alm']}' AND f_venta = '$fecha' AND tip_vta = '$tip_vta'";
        $stmt_ver = self::prepareStatement($query_ver);
        $result_ver = self::executePreparedQuery($stmt_ver);

        if (count($result_ver) > 0) {
            file_put_contents(self::LOG_FILE, "\nLa venta del dia $fecha ya existe, cambian su status => \n", FILE_APPEND);
            $query_update = "UPDATE ma_vtasco SET status = 'N' WHERE cve_alm = '{$arr_vta['cve_alm']}' AND f_venta = '$fecha' AND tip_vta = '$tip_vta'";
            file_put_contents(self::LOG_FILE, "\n $query_update \n", FILE_APPEND);
            $stmt_update = self::prepareStatement($query_update);
            $result_update = self::executePreparedQuery($stmt_update);
            if ($result_update !== false) {
                file_put_contents(self::LOG_FILE, "\nStatus Actualizado Correctamente\n", FILE_APPEND);
            } else {
                file_put_contents(self::LOG_FILE, "\n\n", FILE_APPEND);
            }
        }

        $query = "INSERT INTO ma_vtasco
        (tip_vta, cve_alm, vta_sco, vta_pcz, vta_dif, f_venta, cve_vnd, devo_cred, devo_cont, 
        devo, vta_cred, vta_cont, venta, comis, tot_vta, all_vta, status, adl1, adl2)
        VALUES 
        (
            '{$tip_vta}', 
            '{$arr_vta['cve_alm']}', 
            '{$arr_vta['vtaSco']}', 
            '{$arr_vta['vtaPcz']}', 
            '{$arr_vta['vtaDif']}', 
            '$fecha', 
            '{$arr_vta['CVE_VND']}', 
            '{$arr_vta['DEVO_CRED']}', 
            '{$arr_vta['DEVO_CONT']}', 
            '{$arr_vta['DEVO']}', 
            '{$arr_vta['VENTA_CRED']}', 
            '{$arr_vta['VENTA_CONT']}', 
            '{$arr_vta['VENTA']}', 
            '{$arr_vta['COMIS']}', 
            '{$arr_vta['TOTVTA']}', 
            '{$arr_vta['ALLVTA']}', 
            'S', 
            '{$adl1}', 
            '{$adl2}'
        )";


        $stmt = self::prepareStatement($query);

        if (!$stmt) {
            throw new Exception("Error al preparar el query: " . implode(", ", $conn->errorInfo()));
            file_put_contents(self::LOG_FILE, "\nError al preparar el query: " . implode(", ", $conn->errorInfo()) ."\n", FILE_APPEND);
        }
    
        if ($stmt) {
            file_put_contents(self::LOG_FILE, "\n Execute Query => $query\n", FILE_APPEND);
            file_put_contents(self::LOG_FILE, print_r($arr_vta, true), FILE_APPEND);
    
            /* $stmt->bindParam(':tip_vta', $tip_vta, PDO::PARAM_STR);
            $stmt->bindParam(':cve_alm', $arr_vta['cve_alm'], PDO::PARAM_STR);
            $stmt->bindParam(':vta_sco', $arr_vta['vtaSco'], PDO::PARAM_STR);
            $stmt->bindParam(':vta_pcz', $arr_vta['vtaPcz'], PDO::PARAM_STR);
            $stmt->bindParam(':vta_dif', $arr_vta['vtaDif'], PDO::PARAM_STR);
            $stmt->bindParam(':f_venta', '2024-10-10', PDO::PARAM_STR);
            $stmt->bindParam(':cve_vnd', $arr_vta['CVE_VND'], PDO::PARAM_STR);
            $stmt->bindParam(':devo_cred', $arr_vta['DEVO_CRED'], PDO::PARAM_STR);
            $stmt->bindParam(':devo_cont', $arr_vta['DEVO_CONT'], PDO::PARAM_STR);
            $stmt->bindParam(':devo', $arr_vta['DEVO'], PDO::PARAM_STR);
            $stmt->bindParam(':vta_cred', $arr_vta['VENTA_CRED'], PDO::PARAM_STR);
            $stmt->bindParam(':vta_cont', $arr_vta['VENTA_CONT'], PDO::PARAM_STR);
            $stmt->bindParam(':venta', $arr_vta['VENTA'], PDO::PARAM_STR);
            $stmt->bindParam(':comis', $arr_vta['COMIS'], PDO::PARAM_STR);
            $stmt->bindParam(':tot_vta', $arr_vta['TOTVTA'], PDO::PARAM_STR);
            $stmt->bindParam(':all_vta', $arr_vta['ALLVTA'], PDO::PARAM_STR);
            $stmt->bindParam(':statuss', 'S', PDO::PARAM_STR);
            $stmt->bindParam(':adl1', $adl1, PDO::PARAM_STR);
            $stmt->bindParam(':adl2', $adl2, PDO::PARAM_STR); */
            

            
            file_put_contents(self::LOG_FILE, "Por Ejecutar Query =>", FILE_APPEND);
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
    } catch (Exception $e) {
      file_put_contents(self::LOG_FILE, "\nError durante la ejecucion => \n". $e , FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public function setAlmacenes($almacen, $ip, $dbname, $user, $pw) {
    try {
        $conn = Connection::connect();
        $query = '';

        if (!$conn) {
          file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
          return null;
        }
        
        $query_ver = "SELECT * FROM ma_almasco WHERE clave = '$almacen'";
        $stmt_ver = self::prepareStatement($query_ver);
        $result_ver = self::executePreparedQuery($stmt_ver);

        if (count($result_ver) > 0) {
            file_put_contents(self::LOG_FILE, "\nEl almacen $almacen ya existe\n", FILE_APPEND);
            $query_updaye = "UPDATE ma_almasco SET status = 'N' WHERE clave = '$almacen'";
            $stmt_update = self::prepareStatement($query_updaye);
            $result_update = self::executePreparedQuery($stmt_update);
        }

        $query = "INSERT INTO ma_almasco (clave, descri, ip, dbname, user, pass, status) VALUES ('$almacen', '$almacen', '$ip', '$dbname', '$user', '$pw', 'S')";
        $stmt = self::prepareStatement($query);
        $result = self::executePreparedQuery($stmt);

        file_put_contents(self::LOG_FILE, "\nQuery => $query\n", FILE_APPEND);

        if ($result !== false) {
            file_put_contents(self::LOG_FILE, "\nAlmacen $almacen insertado correctamente\n", FILE_APPEND);
            //return ["Execute" => "Correct"];
        } else {
            file_put_contents(self::LOG_FILE, "\nError al insertar el almacen $almacen\n", FILE_APPEND);
            //return ["Execute" => "Incorrect"];
        }

    } catch (Exception $e) {
      file_put_contents(self::LOG_FILE, "\nError durante la ejecucion => \n". $e , FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public function cerrarConexion()
  {
    // Cierra la conexion cuando ya no sea necesaria
    $this->conexion = null;
  }
}

function activeServerVtaSco() {
    $syncVentas = new Syncventas();
    $almacenes = new AlmacenesSco();
    $syncVentas->loop($almacenes->almacenes, '');
    header('Content-Type: application/json');
    return json_encode(["Execute" => "Correct"]);
}

function activeServerVtaScoWeb() {
    $dia = $_POST['f_sinc'];
    $syncVentas = new Syncventas();
    $almacenes = new AlmacenesSco();
    $syncVentas->loop($almacenes->almacenes, $dia);
    header('Content-Type: application/json');
    return json_encode(["Execute" => "Correct"]);
}

function addAsignatario()
{
  $nombre = $_POST['nombre'];
  $apellidos = $_POST['apellidos'];

  $data = Querys::setAsignatario($nombre, $apellidos);
  header('Content-Type: application/json');
  return json_encode($data);
}


if ($argc > 1) {
    $class = new Syncventas();
    $functionName = $argv[1];
    //$methodArgs = array_slice($argv, 2);
    $almacenes = new AlmacenesSco();
    if (method_exists($class, $functionName)) {
        call_user_func([$class, $functionName], $almacenes->almacenesP, '');
    } else {
        echo "Function $functionName not found\n";
    }
}