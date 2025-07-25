<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 08/07/2025
ruta: thundersc/thundercloud/Sockets/SocketConnection.php
===============================================================================*/

require_once(__DIR__ . '/../Config/Config.php');
require_once(__DIR__ . '../ReturnEvent/ReturnEvent.php');
require_once(__DIR__ . '../System/Connection/Statement.php');
require_once(__DIR__ . '../ThunderLog/ThunderLog.php');
require_once(__DIR__ . '../vendor/autoload.php');

class SocketClient
{
    private $conn = null;
    private $thunderlog = null;
    private $socket = null;
    private $host = null;
    private $port = null;
    private $clientes = [];

    public function __construct($uu)
    {
        $this->conn = null;
        $this->thunderlog = new Log(null, $uu);
        $this->host = '192.168.10.100';
        $this->port = 1085;
        /* $this->host = '127.0.0.1';
        $this->port = 3000; */
    }

    function socket($data)
    {
        try {
            $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
            if ($socket === false) {
                $this->thunderlog->writeLog("Error => " . socket_strerror(socket_last_error()));
                ReturnEvent::returnResponse(1, "Error al crear el socket", socket_strerror(socket_last_error()));
            }

            while (true) {
                $this->thunderlog->writeLog("Conectando al servidor en " . $this->host . ":" . $this->port);
                if (!socket_connect($socket, $this->host, $this->port)) {
                    $this->thunderlog->writeLog("Error => " . socket_strerror(socket_last_error($socket)));
                    ReturnEvent::returnResponse(1, "Error al conectar al servidor", socket_strerror(socket_last_error($socket)));
                }
                $data .= "*cron";
                $data = $data === 'ALL' ? $data : $data . "|" . 'CLI' . "|" . 'PCZMEX';

                socket_write($socket, $data);
                sleep(300);
            }
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error => " . $e->getMessage());
            ReturnEvent::returnResponse(1, "Error al procesar la solicitud", $e->getMessage());
        }
    }

}

function main()
{
    if (php_sapi_name() === 'cli') {
        // por teminal / bash
        global $argv;

        // Esperar argumentos: uu, cc, función, args
        if (count($argv) > 4) {
            echo "\nUso: php SocketClient.php <uu> <cc> <function> [args...]\n";
            exit(1);
        }

        $function = $argv[1];
        $uu = isset($argv[3]) ? $argv[3] : 'Cli';
        $args = $argv[2];

        $componenteService = new SocketClient($uu);
        $componenteService->$function($args);
    } else {
        // Leer el cuerpo de la solicitud HTTP
        $contenido = file_get_contents("php://input");
        $data = json_decode($contenido, true);
        $componenteService = new SocketClient($data['uu']);
        $func = $data['function'];
        $componenteService->$func($data['uu'], $data['cc'], ...$data['args']);
    }
}

main();
