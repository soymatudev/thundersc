<?php

class Log {
    private $fichero = 'thunderlog.log';
    private $path;
    private $uu;

    public function __construct($path = null, $uu = "Unknown") {
        $this->path = $path;
        $this->uu = $uu;
    }

    public function writeLog($message) {
        $filePath = is_null($this->path) ? __DIR__. "/Log/" . $this->fichero : $this->path . "/" . $this->fichero;

        if (!file_exists($filePath)) {
            touch($filePath);
            chmod($filePath, 777);

            exec("chcon -t httpd_log_t " . escapeshellarg($filePath)); // Coloca el contexto SELinux
        }

        // Escribir en el archivo de log
        $time = date('Y-m-d H:i:s');
        $usr = $this->uu ?? 'Unknown';
        file_put_contents($filePath, "\n $time - $usr >>> $message", FILE_APPEND);
    }
}