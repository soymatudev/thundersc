<?php
/*===============================================================================
Dev: Juan Maturana - SoyMatudev
Fecha de Creación: 30/12/2024
ruta: thundersc/thundercloud/System/Utilerias/RevisarVtaSco.php
===============================================================================*/
require_once('../../Connection/Connection.php');
require_once('../../Connection/Statement.php');
require_once('../../../ThunderLog/ThunderLog.php');
require_once('../../../ReturnEvent/ReturnEvent.php');
require_once('./AlmacSco.php');
require_once('../../../vendor/autoload.php');

class Syncventas {

    private $thunderlog = null;
    private $uu = null;

    public function __construct($uu)
    {
        $this->thunderlog = new Log(__DIR__, $uu);
        $this->uu = $uu;
    }

    public function sync($almacen, $dia) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../../../');
        $dotenv->load();

        $fecha = date('Ymd')-1;
        if (trim($dia) != '') {
            $dia = DateTime::createFromFormat("Y-m-d", $dia);
            $dia = $dia->format("Ymd");
            $fecha = $dia;
        }

        $this->thunderlog->writeLog("Fecha => $fecha");
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

    public function loop($dia = '') {
        try {
            $almacenes = new AlmacenesSco();
            $almacenes = $almacenes->almacenes;
            $this->thunderlog->writeLog("Fecha => $dia");
            foreach ($almacenes as $almacen => $server) {
                $status = $this->sync($almacen, $dia);
                sleep(60);
            }
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error durante la ejecucion => " . $e);
            ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
    }

    public function loopCrontab($almacenes, $dia = ''){
        try {
            $this->thunderlog->writeLog("Fecha => $dia");
            foreach ($almacenes as $almacen => $server) {
                $status = $this->sync($almacen, $dia);
                sleep(60);
            }
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error durante la ejecucion => " . $e);
            ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
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
                $Querys = new Querys($this->uu);
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

        $this->thunderlog->writeLog("Ventas de MAY => " . print_r($MAY, true));
        $this->thunderlog->writeLog("Ventas de TDA => " . print_r($TDA, true));

        $Querys = new Querys($this->uu);
        $Querys->setVta($MAY["MAY"], $almacen, $fecha, "MAY", $adl1M, $adl2M);
        $Querys->setVta($TDA["TDA"], $almacen, $fecha, "TDA", $adl1T, $adl2T);

        ReturnEvent::returnResponse(0, "Datos obtenidos con exito", "Datos obtenidos con exito");
    }
}


class Querys
{
    private $conn = null;
    private $thunderlog = null;
    private $cc = 'PCZMEX';

    public function __construct($uu)
    {
        $this->thunderlog = new Log(__DIR__, $uu);
    }

  public function setVta($arr_vta, $almacen, $fecha, $tip_vta, $adl1, $adl2)
  {
    try {
        $this->conn = (new Connection(__DIR__, $this->cc))->connect();
        if (!$this->conn) {
            $this->thunderlog->writeLog("Error de conexión" . $this->conn);
            return null;
        }

        $query = "SELECT * FROM ma_ventasco WHERE cve_alm = '{$arr_vta['cve_alm']}' AND f_venta = :f_venta AND tip_vta = :tip_vta";
        $stmt = new Statement($this->conn, (__DIR__));
        $res = $stmt->prepareStatement($query);

        if($res) {
            $res->bindParam(':f_venta', $fecha, PDO::PARAM_STR);
            $res->bindParam(':tip_vta', $tip_vta, PDO::PARAM_STR);
            $result = $stmt->executePreparedQuery($res);

            if ($result !== false) {
                $this->thunderlog->writeLog("La venta del dia $fecha ya existe, cambian su status");
                $query_update = "UPDATE ma_ventasco SET status = 'N' WHERE cve_alm = '{$arr_vta['cve_alm']}' AND f_venta = '$fecha' AND tip_vta = '$tip_vta'";
                $stmt_update = $stmt->prepareStatement($query_update);
                $result_update = $stmt->executePreparedQuery($stmt_update);
                if ($result_update !== false) {
                    $this->thunderlog->writeLog("Status Actualizado Correctamente");
                } else {
                    $this->thunderlog->writeLog("Error al actualizar el status");
                }
            }

            $queryInsert = "INSERT INTO ma_ventasco
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

            $stmtInsert = $stmt->prepareStatement($queryInsert);
            $resultInsert = $stmt->executePreparedQuery($stmtInsert);

            if ($resultInsert !== false) {
                $this->thunderlog->writeLog("Venta insertada correctamente");
            } else {
                $this->thunderlog->writeLog("Error al insertar la venta");
            }
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

        } else {
            $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
            ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error => " . $e->getMessage());
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
    }
  }

  public function setAlmacenes($almacen, $ip, $dbname, $user, $pw) {
    try {
        $this->conn = (new Connection(__DIR__, $this->cc))->connect();
        if (!$this->conn) {
            $this->thunderlog->writeLog("Error de conexión" . $this->conn);
            return null;
        }
        
        $query_ver = "SELECT * FROM ma_almacsco WHERE clave = :almacen";
        $stmt = new Statement($this->conn, (__DIR__));
        $res = $stmt->prepareStatement($query_ver);
        $this->thunderlog->writeLog("Query => $query_ver");

        if ($res !== false) {
            $res->bindParam(':almacen', $almacen, PDO::PARAM_STR);
            $result_ver = $stmt->executePreparedQuery($res);

            if ($result_ver !== false) {
                $this->thunderlog->writeLog("El almacen $almacen ya existe");
                $query_updaye = "UPDATE ma_almacsco SET status = 'N' WHERE clave = :almac";
                $stmt = new Statement($this->conn, (__DIR__));
                $stmt_update = $stmt->prepareStatement($query_updaye);
                $this->thunderlog->writeLog("Query => $query_updaye");

                $stmt_update->bindParam(':almac', $almacen, PDO::PARAM_STR);
                $result_update = $stmt->executePreparedQuery($stmt_update);
                if ($result_update !== false) {
                    $this->thunderlog->writeLog("Status Actualizado Correctamente");
                } else {
                    $this->thunderlog->writeLog("Error al actualizar el status");
                }
            }
        } else {
            $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
        }

        $queryInsert = "INSERT INTO ma_almacsco (clave, descri, ip, dbname, usr, pass, status) VALUES (:almacen, :almacen, :ip, :dbname, :user, :pw, 'S')";
        $stmt = new Statement($this->conn, (__DIR__));
        $res = $stmt->prepareStatement($queryInsert);
        $res->bindParam(':almacen', $almacen, PDO::PARAM_STR);
        $res->bindParam(':ip', $ip, PDO::PARAM_STR);
        $res->bindParam(':dbname', $dbname, PDO::PARAM_STR);
        $res->bindParam(':user', $user, PDO::PARAM_STR);
        $res->bindParam(':pw', $pw, PDO::PARAM_STR);
        $result = $stmt->executePreparedQuery($res);

        if ($result !== false) {
            $this->thunderlog->writeLog("Almacen $almacen insertado correctamente");
        } else {
            $this->thunderlog->writeLog("Error al insertar el almacen $almacen");
        }
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error => " . $e->getMessage());
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
    }
  }
}

function main()
{
  // Leer el cuerpo de la solicitud
  $contenido = file_get_contents("php://input");
  $data = json_decode($contenido, true);
  $componenteService = new Syncventas($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();

