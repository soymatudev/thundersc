<?php
$host = "127.0.0.1";
$port = 3000;

// Crear socket TCP
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
    die("Error al crear socket: " . socket_strerror(socket_last_error()) . "\n");
}

// Conectar al servidor
if (!socket_connect($socket, $host, $port)) {
    die("No se pudo conectar al servidor: " . socket_strerror(socket_last_error($socket)) . "\n");
}

// Enviar mensaje
$mensaje = "Hola servidor desde cliente PHP";
socket_write($socket, $mensaje, strlen($mensaje));

// Leer respuesta del servidor
$respuesta = socket_read($socket, 2048);
echo "Respuesta del servidor: $respuesta\n";

// Cerrar
socket_close($socket);
