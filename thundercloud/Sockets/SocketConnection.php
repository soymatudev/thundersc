<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 08/07/2025
ruta: thundersc/thundercloud/Sockets/SocketConnection.php
===============================================================================*/

require_once('../System/Connection/Connection.php');
require_once('../Config/Config.php');
require_once('../ReturnEvent/ReturnEvent.php');
require_once('../System/Connection/Statement.php');
require_once('../ThunderLog/ThunderLog.php');
require_once('../vendor/autoload.php');

class SocketConnection
{
  private $conn = null;
  private $thunderlog = null;
  private $socket = null;
  private $host = null;
  private $port = null;

  public function __construct($uu)
  {
    $this->conn = null;
    $this->thunderlog = new Log(null, $uu);
    $this->host = '192.168.10.100';
    $this->port = 1085;

    /* $this->host = '127.0.0.1';
    $this->port = 3000; */
  }

  function socketCreate() {
    try {
        $this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        if ($this->socket === false) {
            die("No se pudo crear el socket: " . socket_strerror(socket_last_error()) . "\n");
        }
        // Vincular el socket a un puerto
        if (!socket_bind($this->socket, $this->host, $this->port)) {
            die("No se pudo enlazar el socket: " . socket_strerror(socket_last_error($this->socket)) . "\n");
        }
        // Escuchar conexiones entrantes
        if (!socket_listen($this->socket, 5)) {
            die("No se pudo escuchar en el socket: " . socket_strerror(socket_last_error($this->socket)) . "\n");
        }
        $this->thunderlog->writeLog("Servidor escuchando en el puerto 1085 \n");
        while (true) {
            $this->socketListen();
        }

    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

  function socketListen () {
    $client = socket_accept($this->socket);
    if ($client === false) {
        die("No se pudo aceptar la conexión: " . socket_strerror(socket_last_error($this->socket)) . "\n");
    }

    $input = socket_read($client, 1024);
    //echo "Mensaje recibido del cliente: $input\n";
    $this->thunderlog->writeLog("Mensaje recibido del cliente: " . $input);

    if (strlen($input) === 0) {
        // El cliente se desconectó
        socket_close($client);
        unset($client);
        $this->thunderlog->writeLog("Cliente desconectado");
    } else {
        $input = explode("|", trim($input));
        $this->socketQuery($input[1], $input[2], $input[0], $client);
    }
  }

  function socketClient ($uu, $cc, $data = []) {
    try {
        $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        if ($socket === false) {
            $this->thunderlog->writeLog("Error => " . socket_strerror(socket_last_error()));
            die("Error al crear socket: " . socket_strerror(socket_last_error()) . "\n");
        }
    
        // Conectar al servidor
        if (!socket_connect($socket, $this->host, $this->port)) {
            $this->thunderlog->writeLog("Error => " . socket_strerror(socket_last_error($socket)));
            $this->thunderlog->writeLog("Host: " . $this->host . " - Port: " . $this->port);
            die("No se pudo conectar al servidor: " . socket_strerror(socket_last_error($socket)) . "\n");
        }

        $data = $data === 'ALL' ? $data : $data;
        $data .= "|" . $uu . "|" . $cc;
        $this->thunderlog->writeLog("Data Enviada => " . $data);
        socket_write($socket, $data, strlen($data));
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

  function socketQuery ($uu, $cc, $data, $client) {
    try {
        $this->conn = (new Connection(null, $cc))->connect();
        if (!$this->conn) {
          $this->thunderlog->writeLog("Error de conexión" . $this->conn);
          return null;
        }
        $datosoc = $data;
        $valorhwd = explode(",",$datosoc);
        if (strlen($data) > 0) {
            $equipos = $data === 'ALL' ? "nombre like '%Temp%'" : "nombre = '".trim($valorhwd[0])."'";

            $query = "SELECT * FROM ma_equipo where $equipos";
            $this->thunderlog->writeLog("Query => " . $query);
            $stmt = new Statement($this->conn, (null));
            $res = $stmt->prepareStatement($query);

            $result = $stmt->executePreparedQuery($res);
            if ($result !== false) {
                $this->thunderlog->writeLog("Execute => Correct => ");

                for ($x = 0; $x < count($result); $x++) {
                    $result[$x]['clave'] = thunderToUtf8(trim($result[$x]['clave']));
                    $this->thunderlog->writeLog("Execute => Correct => " . $result[$x]['clave']);

                    $response = "Recibido";
                    socket_write($client, $response, strlen($response));
                    $this->thunderlog->writeLog("Respuesta enviada al cliente: " . $response);

                    socket_write($client, $response, strlen($response));
                }

                socket_close($client);
                ReturnEvent::returnResponse(0, "Datos obtenidos con exito", $result);
            } else {
                $this->thunderlog->writeLog("Execute => Incorrect");
                ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
            }
        }
    } catch (Exception $e) {
        $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }
}

function main()
{
  if (php_sapi_name() === 'cli') {
    // por teminal / bash
    global $argv;
    
    // Esperar argumentos: uu, cc, función, args
    if (count($argv) < 4) {
      echo "Uso: php SocketConnection.php <uu> <cc> <function> [args...]\n";
      exit(1);
    }

    $uu = $argv[1];
    $cc = $argv[2];
    $function = $argv[3];
    $args = array_slice($argv, 4);

    $componenteService = new SocketConnection($uu);
    $componenteService->$function($uu, $cc, $args);
  } else {
    // Leer el cuerpo de la solicitud HTTP
    $contenido = file_get_contents("php://input");
    $data = json_decode($contenido, true);
    $componenteService = new SocketConnection($data['uu']);
    $func = $data['function'];
    $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
  }
}

main();
