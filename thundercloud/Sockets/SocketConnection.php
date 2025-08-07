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
require_once(__DIR__ . '/../APIBot/APIService.php');

class SocketConnection
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

    function socketCreate()
    {
        try {
            $this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
            socket_set_option($this->socket, SOL_SOCKET, SO_REUSEADDR, 1);

            if ($this->socket === false) {
                die("No se pudo crear el socket: " . socket_strerror(socket_last_error()) . "\n");
            }
            // Vincular el socket a un puerto
            socket_set_option($this->socket, SOL_SOCKET, SO_REUSEADDR, 1);
            if (!socket_bind($this->socket, $this->host, $this->port)) {
                die("No se pudo enlazar el socket: " . socket_strerror(socket_last_error($this->socket)) . "\n");
            }
            // Escuchar conexiones entrantes
            if (!socket_listen($this->socket)) {
                die("No se pudo escuchar en el socket: " . socket_strerror(socket_last_error($this->socket)) . "\n");
            }
            $this->thunderlog->writeLog("Servidor " . $this->host . " : " . $this->port . "\n");
            $this->socketLoop();
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error => " . $e->getMessage());
        }
    }

    function socketLoop()
    {
        $this->clientes = [$this->socket];

        while (true) {
            $lectura = $this->clientes;
            socket_select($lectura, $write, $except, 0);

            foreach ($lectura as $sock) {

                if ($sock === $this->socket) {
                    $nuevoCliente = socket_accept($this->socket);

                    if ($nuevoCliente) {
                        $this->clientes[] = $nuevoCliente;
                        $this->thunderlog->writeLog("Nuevo cliente conectado.");
                        socket_write($nuevoCliente, "Bienvenido al servidor de sockets. \n");
                        continue;
                    }
                } else {
                    $buffer = @socket_read($sock, 1024, PHP_BINARY_READ);
                    $mensaje = trim($buffer);

                    if ($mensaje !== "" && $mensaje !== false) {
                        $this->thunderlog->writeLog("Mensaje recibido: " . $mensaje);

                        if ($mensaje === "exit" || $mensaje === "bye") {

                            $this->socketClose($sock);

                            continue;
                        } else if (str_contains($mensaje, "ALL")) {

                            $this->socketResponse($sock, "ALL");
                            if (str_contains($mensaje, "*web") || str_contains($mensaje, "*cron")) $this->socketClose($sock);

                            continue;
                        }

                        $partes = explode("|", $mensaje);
                        if (count($partes) === 3) {

                            list($data, $uu, $cc) = $partes;
                            $this->socketResponse($sock, explode("*", $data)[0]);

                            if (str_contains($mensaje, "*web")) {
                                $this->socketClose($sock);
                            } else {
                                $result = $this->socketQuery($uu, $cc, $data, $sock);
                                $result ? socket_write($sock, "Datos insertados correctamente. \n") : socket_write($sock, "Error al procesar la consulta");
                            }
                        } else {
                            socket_write($sock, "Mensaje no válido \n");
                        }
                    }
                }
            }
        }
    }

    function socketQuery($uu, $cc, $data, $client)
    {
        try {
            $this->conn = (new Connection(null, $cc))->connect();
            if (!$this->conn) {
                $this->thunderlog->writeLog("Error de conexión" . $this->conn);
                return null;
            }
            $this->thunderlog->writeLog("Parseando data");

            $datosoc = $data;
            $valorhwd = $this->format($datosoc);
            if (strlen($data) <= 0) {
                $this->thunderlog->writeLog("Error al parsear data");
                return null;
            }

            $equipos = $data === 'ALL' ? "nombre like '%Temp%'" : "nombre in (" . trim($valorhwd) . ")";

            $query = "SELECT * FROM ma_equipo where $equipos";
            $this->thunderlog->writeLog("Query => " . $query);
            $stmt = new Statement($this->conn, (null));
            $res = $stmt->prepareStatement($query);
            $result = $stmt->executePreparedQuery($res);

            if (count($result) > 0) {

                $query = "insert into ma_regzoro(cve_equipo, fecha_hora, dato_1, dato_2) values(:cve_equipo, now(), :dato_1, :dato_2)";
                $this->thunderlog->writeLog("Query => " . $query);
                $stmt = new Statement($this->conn, (null));
                $res = $stmt->prepareStatement($query);

                $data = explode(",", $data);
                $nombre = $result[0]['nombre'];

                $this->thunderlog->writeLog("data => " . print_r($data, true));
                $res->bindParam(':cve_equipo', $result[0]['clave'], PDO::PARAM_STR);
                $res->bindParam(':dato_1', $data[1], PDO::PARAM_STR);
                $res->bindParam(':dato_2', $data[2], PDO::PARAM_STR);

                $this->thunderlog->writeLog("Por ejecutar la consulta");
                $result = $stmt->executePreparedQuery($res);
                $this->thunderlog->writeLog("Consulta ejecutada correctamente");

                $this->thunderlog->writeLog("Llamando a Boty");
                $this->BotTemp($data[1], $data[2], $nombre);

                return $result ? 1 : 0;
            } else {
                $this->thunderlog->writeLog("Equipos no encontrados");
                ReturnEvent::returnResponse(1, "Equipos no encontrados", "Error en la consulta");
            }
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error => " . $e->getMessage());
            return 0;
        }
    }

    function socketHTTP($uu = null, $cc = null, $data)
    {
        try {
            $socketHTTP = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
            if ($socketHTTP === false) {
                $this->thunderlog->writeLog("Error => " . socket_strerror(socket_last_error()));
                ReturnEvent::returnResponse(1, "Error al crear el socket", socket_strerror(socket_last_error()));
            }

            $this->thunderlog->writeLog("Conectando al servidor en " . $this->host . ":" . $this->port);
            if (!socket_connect($socketHTTP, $this->host, $this->port)) {
                $this->thunderlog->writeLog("Error => " . socket_strerror(socket_last_error($socketHTTP)));
                ReturnEvent::returnResponse(1, "Error al conectar al servidor", socket_strerror(socket_last_error($socketHTTP)));
            }
            $data = $data === 'ALL' ? $data : $data . "|" . $uu . "|" . $cc;

            socket_write($socketHTTP, $data);
            ReturnEvent::returnResponse(0, "", "Datos enviados correctamente");
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error => " . $e->getMessage());
            ReturnEvent::returnResponse(1, "Error al procesar la solicitud", $e->getMessage());
        }
    }

    function socketResponse($sock, $mensaje)
    {
        foreach ($this->clientes as $cliente) {
            if ($cliente !== $sock && $cliente !== $this->socket) {
                socket_write($cliente, "$mensaje\n");
            }
        }
    }

    function socketClose($sock)
    {
        $idx = array_search($sock, $this->clientes);
        if ($idx !== false) {
            unset($this->clientes[$idx]);
            socket_close($sock);
            $this->thunderlog->writeLog("Cliente desconectado.");
        } else {
            $this->thunderlog->writeLog("Error al cerrar el socket del cliente.");
        }
    }


    function format($data)
    {
        $b = explode(",", $data);
        $c = [];
        foreach ($b as $item) {
            $item = trim($item);
            $c[] = "'$item'";
        }
        return implode(",", $c);
    }
    
    function BotTemp($temperatura = null, $humedad = null, $sensor = null) {
        try {
            $this->thunderlog->writeLog("Enviando datos al bot de Telegra\n m");

            $msg = $temperatura != null ? "🌡️ Sensor: $sensor \n" . "Temperatura: $temperatura \n" . "Humedad: $humedad" : "Error: Sin Datos";

            $objmsg = [
                "update_id" => 151980837,
                "message" => [
                    "message_id" => 7,
                    "from" => [
                        "id" => 7325450079,
                        "is_bot" => false,
                        "first_name" => "Juan",
                        "language_code" => "es",
                    ],
                    "chat" => [
                        "id" => 7325450079,
                        "first_name" => "Juan",
                        "type" => "private"
                    ],
                    "date" => 1691170114,
                    "text" => "🤖 Thundersc: \n" . "$msg"
                ]
            ];

            $obj = [
                'uu' => 'API_BOT',
                'cc' => 'BotSensoresService',
                'function' => 'API',
                'args' => [$objmsg]
            ];

            $api = new API_BOT();
            $api->API('API_BOT', 'BotSensoresService', $objmsg);
            $this->thunderlog->writeLog("Datos enviados al bot de Telegram correctamente");
        } catch (Exception $e) {
            $this->thunderlog->writeLog("Error al enviar datos al bot de Telegram: " . $e->getMessage());
            ReturnEvent::returnResponse(1, "Error al enviar datos al bot de Telegram", $e->getMessage());
        }
    }
}

function main()
{
    if (php_sapi_name() === 'cli') {
        // por teminal / bash
        global $argv;

        // Esperar argumentos: uu, cc, función, args
        if (count($argv) > 3) {
            echo "\nUso: php SocketConnection.php <uu> <cc> <function> [args...]\n";
            exit(1);
        }

        $function = $argv[1];
        $uu = isset($argv[2]) ? $argv[2] : 'Cli';
        $cc = isset($argv[3]) ? $argv[3] : '';
        $args = array_slice($argv, 4);

        $componenteService = new SocketConnection($uu);
        $componenteService->$function($uu);
    } else {
        // Leer el cuerpo de la solicitud HTTP
        $contenido = file_get_contents("php://input");
        $data = json_decode($contenido, true);
        $componenteService = new SocketConnection($data['uu']);
        $func = $data['function'];
        $componenteService->$func($data['uu'], $data['cc'], ...$data['args']);
    }
}

main();
