<?php
require_once('../ThunderLog/ThunderLog.php');
require_once('../ReturnEvent/ReturnEvent.php');

class KillSessions{
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->thunderlog = new Log(__DIR__."/../ThunderLog", $uu);
  }

  function killSession() {
    try {
      session_start();
      session_destroy();
      //header("Location: ../../index.php");
      $this->thunderlog->writeLog("KillSession >>> Sesión cerrada correctamente");
      ReturnEvent::returnResponse(0, "Sesion cerrada con exito", "Sesion cerrada con exito");
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error al cerrar la sesión: " . $e->getMessage());
    }
  }
}

function main()
{
  // Leer el cuerpo de la solicitud
  $contenido = file_get_contents("php://input");
  $data = json_decode($contenido, true);
  $componenteService = new KillSessions($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();