<?php

// Datos de conexión (reemplázalos con tus datos)
$host = "192.168.10.100";
$port = "5432";
$dbname = "th_pczmex";
$user = "postgres";
$password = "www*aaz*com*mx";


// Cadena de conexión
$conn_string = "host={$host} port={$port} dbname={$dbname} user={$user} password={$password}";

// Establecer conexión
$conn = pg_connect($conn_string);

// Verificar la conexión
if (!$conn) {
  echo "Error: No se pudo conectar a la base de datos.\n";
  exit;
}


// Crear un socket
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
    die("No se pudo crear el socket: " . socket_strerror(socket_last_error()) . "\n");
}

// Asociar el socket a IP y puerto
if (!socket_bind($socket, '127.0.0.1', 3000)) {
    die("No se pudo enlazar el socket: " . socket_strerror(socket_last_error($socket)) . "\n");
}

// Escuchar conexiones entrantes
if (!socket_listen($socket, 5)) {
    die("No se pudo escuchar en el socket: " . socket_strerror(socket_last_error($socket)) . "\n");
}

echo "Servidor escuchando en el puerto 1085\n";

$client = socket_accept($socket);
if ($client === false) {
    die("No se pudo aceptar la conexión: " . socket_strerror(socket_last_error($socket)) . "\n");
}

$input = socket_read($client, 1024);
echo "Mensaje recibido del cliente: $input\n";

// Enviar respuesta al cliente
$response = "Hola, cliente. Recibí tu mensaje: " . trim($input);
socket_write($client, $response, strlen($response));


/* // Crear socket TCP
$sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($sock === false) {
    die("No se pudo crear el socket: " . socket_strerror(socket_last_error()) . "\n");
}

// Asociar el socket a IP y puerto
if (!socket_bind($sock, $host, $port)) {
    die("No se pudo enlazar el socket: " . socket_strerror(socket_last_error($sock)) . "\n");
}

// Escuchar conexiones entrantes
if (!socket_listen($sock, 5)) {
    die("No se pudo escuchar en el socket: " . socket_strerror(socket_last_error($sock)) . "\n");
} */





















// Arreglo para almacenar los sockets de los clientes
$clients = [];

while (true) {
    // Crear un arreglo de sockets para monitorear
    $read = $clients;
    $read[] = $socket;

    // Esperar por actividad en alguno de los sockets
    $write = null;
    $except = null;
    socket_select($read, $write, $except, null);

    // Si hay una nueva conexión
    if (in_array($socket, $read)) {
        // Aceptar la conexión
        $new_socket = socket_accept($socket);
        $clients[] = $new_socket;
        echo "Nuevo cliente conectado\n";
    }

    // Iterar sobre los clientes conectados
    foreach ($clients as $key => $client) {
        if (in_array($client, $read)) {
            $data = socket_read($client, 1024);
            if ($data === false) {
                // El cliente se desconectó
                socket_close($client);
                unset($clients[$key]);
                echo "Cliente desconectado\n";
            } else {
				echo $data . "\n";
				// Enviar una respuesta al cliente
				socket_write($client, "Recibido");
                // Procesar los datos recibidos
                echo "Datos recibidos: " . $data . "\n";
		$datosoc =  $data;
		$valorhwd = explode(",",$datosoc);
		if (trim($data)!="") {
			//echo $valorhwd[0];
				// Consulta SQL
				$query = "SELECT * FROM ma_equipo where nombre='".trim($valorhwd[0])."'";
				// Ejecutar la consulta
				$result = pg_query($conn, $query);
				// Verificar si la consulta fue exitosa
				if (!$result) {
 				 echo "Error en la consulta.\n";
 				 exit;
					}
				// Mostrar resultados
					if ($row = pg_fetch_assoc($result)) {
  					foreach ($row as $value)
					//foreach ($row as $key => $value) {
    					echo $row['clave']."\n";
					// Enviar una respuesta al cliente
			                socket_write($client, "Recibido");
						//descomentar terminando la pruebas de envio
						//$query2="INSERT INTO ma_regzoro(cve_equipo,dato_1,dato_2,fecha_hora) VALUES(".$row['clave'].",'".$valorhwd[1]."','".$valorhwd[2]."',CURRENT_TIMESTAMP)";
						//pg_query($query2);
						
					}  else {
 					   echo "No se encontraron resultados para el nombre.\n";
						}

					// Cerrar la conexión
					//pg_close($conn);
				//$query="select * from ma_equipo where nombre='".trim($valorhwd[0])."'"; desde aqui
				//echo $query."\n";
				//$resultados = $conn->query($query);
				//foreach ($resultados as $row)
					//echo $row['id']."\n";
				//$valdqry = $row['id'];
				//if ( $valdqry > 0){
					//$query2="INSERT INTO ma_regzoro(cve_equipo,dato_1,dato_2,fecha_hora) VALUES('".$row['id']."','".$valorhwd[1]."','".$valorhwd[2]."',TIMESTAMP)";
                                	//$conn->prepare($query2)->execute();
					//$valdqry ="0";
                                	//$row['id'] = 0;
						//}
				    }
                // Enviar una respuesta al cliente
//                socket_write($client, "SILO2");
            }
        }
    }
}
