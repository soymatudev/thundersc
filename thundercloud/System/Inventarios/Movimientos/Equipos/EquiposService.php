<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/system/Inventarios/Movimientos/Equipos/EquiposService.php
===============================================================================*/

require_once('../../../Connection/ConnectionADM.php');
require_once('../../../Connection/Connection.php');
require_once('../../../../Config/Config.php');
require_once('../../../../ReturnEvent/ReturnEvent.php');
require_once('../../../Connection/Statement.php');
require_once('../../../../ThunderLog/ThunderLog.php');
require_once('../../../../vendor/autoload.php');
use mPDF\mPDF;

class EquiposService
{
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->conn = null;
    $this->thunderlog = new Log(__DIR__, $uu);
  }

  public function crudSave($uu, $cc, $arrEquipos)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();

      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $this->conn->beginTransaction();
      $this->thunderlog->writeLog("Execute => " . print_r($arrEquipos, true));

      foreach($arrEquipos as $equipo) {
        
        $stmt = $this->conn->prepare("INSERT into ma_eqasis (cve_alm, cve_eqsis, cve_emple, cve_depar, f_movto) 
        values (:cve_alm, (SELECT clave FROM ma_eqsis where cod_inv = :codinv), :cve_emple, :cve_depar, :f_movto)");

        $stmt->bindParam(':cve_alm', $equipo['cve_alm'], PDO::PARAM_STR);
        $stmt->bindParam(':codinv', $equipo['codinv'], PDO::PARAM_STR);
        $stmt->bindParam(':cve_emple', $equipo['cve_emple'], PDO::PARAM_INT);
        $stmt->bindParam(':cve_depar', $equipo['cve_depar'], PDO::PARAM_INT);
        $stmt->bindParam(':f_movto', $equipo['f_movto'], PDO::PARAM_STR);

        $result = $stmt->execute();
        $this->thunderlog->writeLog("Execute => " . print_r($result, true));
      }
//SELECT clave FROM ma_eqsis where cod_inv = 'ACMOP0000091224P003';
      if (true) {
        $res = $this->conn->commit();
        if ($res !== false) {
            $this->thunderlog->writeLog("Execute => Correct => Movimiento generado con exito");
            ReturnEvent::returnResponse(0, "Movimiento generado con exito", "Movimiento generado con exito");
        } else {
          $this->thunderlog->writeLog("Execute => Incorrect");
          ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
      } else {
        $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
        $this->conn->rollBack();
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
      }
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
      $this->conn->rollBack();
    }
  }

  public function crudSearch($uu, $cc, $cod_inv)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $query = "SELECT a.serie, a.cod_inv, a.cve_marca, b.descri as marca, a.cve_clasif, c.descri as tipo, f_regis, a.modelo from ma_eqsis a, ma_marca b, ma_clasif c
                where a.cve_marca = b.clave
                and a.cve_clasif = c.clave
                and cod_inv = :cod_inv";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);

      if ($res) {
        $res->bindParam(':cod_inv', $cod_inv, PDO::PARAM_STR);
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
          $this->thunderlog->writeLog("Execute => Correct => Equipo encontrado con exito");

          for ($x = 0; $x < count($result); $x++) {
            $result[$x]['serie'] = thunderToUtf8(trim($result[$x]['serie']));
            $result[$x]['cod_inv'] = thunderToUtf8(trim($result[$x]['cod_inv']));
            $result[$x]['cve_marca'] = thunderToUtf8(trim($result[$x]['cve_marca']));
            $result[$x]['cve_clasif'] = thunderToUtf8(trim($result[$x]['cve_clasif']));
            $result[$x]['f_regis'] = thunderToUtf8(trim($result[$x]['f_regis']));
            $result[$x]['status'] = thunderToUtf8(trim($result[$x]['status']));
            $result[$x]['modelo'] = thunderToUtf8(trim($result[$x]['modelo']));
          }

          ReturnEvent::returnResponse(0, "Datos obtennidos con exito", $result);
        } else {
          $this->thunderlog->writeLog("Execute => Incorrect");
          ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
        }
      } else {
        $this->thunderlog->writeLog("Execute => Incorrect sin stmt");
        ReturnEvent::returnResponse(1, "Error en la consulta", "Error en la consulta");
      }
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

  public function getResponsiva($uu, $cc, $arrEquipos, $asignatario, $almac, $depto) {
    try {
        $mpdf = version_compare(PHP_VERSION, '5.6.0') >= 0
        ? new \Mpdf\Mpdf(array(
        "setAutoBottomMargin" => "false",
        "format" => "Letter",
        "margin_footer" => 8,
        "margin_left" => 8,
        "margin_right" => 12,
        "margin_header" => 8,
        "orientation" => "P",
        'mode' => 'utf-8',
        'margin_top' => 25,
        "margin_bottom" => 13
      ))
      : new mPDF(["", "Letter", 0, "", 8, 12, 25, 13, 8, 8, "P"]);

      $this->thunderlog->writeLog("Execute => " . print_r($arrEquipos, true));
      $this->thunderlog->writeLog("Datos => $asignatario, $almac, $depto");

      $table = "<table style='font-size: .6rem;'>";
      $arrTable = array();

       /* "id": Date.now(),
                "cve_alm": cve_alm,
                "almac": almacen,
                "codinv": datax[0].cod_inv,
                "serie": datax[0].serie,
                "cve_marca": datax[0].cve_marca,
                "marca": datax[0].marca,
                "cve_clasif": datax[0].cve_clasif,
                "clasificacion": datax[0].tipo,
                "cve_emple": cve_emple,
                "empleado": empleado,
                "cve_depar": cve_depar,
                "departamento": departamento,
                "f_movto": f_movto */

      foreach($arrEquipos as $ii => $rd)
      {
        if($ii == count($arrEquipos)-1) {
          $table.="<tr>";
            $table.="<td width='25%' style='border-bottom: 1px solid; border-left: 1px solid;'>". $rd['codinv']."</td>";
            $table.="<td width='25%' style='border-bottom: 1px solid; border-left: 1px solid;'>". $rd['serie']."</td>";
            $table.="<td width='15%' style='border-bottom: 1px solid; border-left: 1px solid;'>". $rd['marca']."</td>";
            $table.="<td width='15%' style='border-bottom: 1px solid; border-left: 1px solid;'>". $rd['clasificacion']."</td>";
            $table.="<td width='20%' style='border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;'>". $rd['modelo']."</td>";
            /* $table.="<td align='center' width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['departamento']."</td>"; */
          $table.="</tr>";
        } else {
          $table.="<tr>";
            $table.="<td width='25%' style='border-bottom: 0px solid #000; border-left: 1px solid;'>". $rd['codinv']."</td>";
            $table.="<td width='25%' style='border-bottom: 0px solid #000; border-left: 1px solid;'>". $rd['serie']."</td>";
            $table.="<td width='15%' style='border-bottom: 0px solid #000; border-left: 1px solid;'>". $rd['marca']."</td>";
            $table.="<td width='15%' style='border-bottom: 0px solid #000; border-left: 1px solid;'>". $rd['clasificacion']."</td>";
            $table.="<td width='20%' style='border-bottom: 0px solid #000; border-left: 1px solid; border-right: 1px solid;'>". $rd['modelo']."</td>";
            /* $table.="<td align='center' width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['departamento']."</td>"; */
          $table.="</tr>";
        }
      }

      $table.="<tr><td colspan='5' style='border-bottom: 0px solid #000; border-left: 0px solid;'></td></tr>";
      $table.="<tr><td colspan='5' style='border-bottom: 0px solid #000; border-left: 0px solid;'></td></tr>";
      $table.="<tr><td colspan='5' style='border-bottom: 0px solid #000; border-left: 0px solid;'></td></tr>";
      $table.="<tr><td colspan='5' style='border-bottom: 0px solid #000; border-left: 0px solid;'></td></tr>";

      // d/m/Y
      $f_movto = $arrEquipos[0]['f_movto'] ? date("d/m/Y", strtotime($arrEquipos[0]['f_movto'])) : date("d/m/Y");
      $almacen = $arrEquipos[0]['almac'];
      $respon = $arrEquipos[0]['empleado'];
      $depto = $arrEquipos[0]['departamento'];

      $table.="<tr>";
        $table.="
        <td colspan='5' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>
          <p style='font-size: 1.3rem;'>
          El día <b>$f_movto</b> recibí de parte de Productos de Consumo Z los equipos listados en la parte superior.</b>
          </p>
        </td>";
      $table.="</tr>";

      $table.="<tr>";
      $table.="
      <td colspan='5' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>
        <p style='font-size: 1.3rem;'>
        Dichos equipos se han entregado <b>para su uso en la sucursal y en el área correspondiente.</b> Si, durante el periodo de uso, sufrieran algún siniestro (total o parcial por negligencia o descuido),
         <b>será responsabilidad de quien se le asignó el equipo realizar la reparación o sustitución del mismo.</b>
        </p>
      </td>";
      $table.="</tr>";

      $table.="<tr>";
      $table.="
      <td colspan='5' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>
        <p style='font-size: 1.3rem;'>
        Este equipo se asignará a: <b>$almacen</b>
        </p>
      </td>";
      $table.="</tr>";

      $table.="<tr>";
      $table.="
      <td colspan='8' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>
        <p style='font-size: 1.3rem;'>
        Del Cedis/Departamento: <b>$depto</b>
        </p>
      </td>";
      $table.="</tr>";

      $table.="</table>";
      $arrTable[]=$table;
      $table="";

      $header="<div class='content-pdf'>
      <div class='title_h3' style='font-size: 1.2rem;' >Productos de Consumo Z SA de CV</div>
        <div class='title_h3' style='font-size: 1.2rem;' > Relación de Inventario - Sistemas TI </div>
      </div>
      <table>
        <thead>
          <tr>
              <th width='25%'>Codigo de Inventario</th>
              <th width='25%'>Numero de Serie</th>
              <th width='15%'>Marca</th>
              <th width='15%'>Equipo</th>
              <th width='20%'>Modelo</th>
          </tr>
        </thead>
      </table>
      ";

      $footer = "<hr>
      <div class='d-flex footer'>
          <div>Relación de Inventario - Sistemas TI ".date("d/m/Y H:m A")."</div>
          <div class='right'>Página {PAGENO} de {nbpg}</div>
      </div>
      ";

      if (!empty($respon)) {
        $htmla = "
        <div class='content-pdf'>
          <div >
            <div>";
        $htmlb="
            </div>
          </div>
            <div>
              <div style='margin: 80px 0 5px'>
                  <div style='margin: auto' class=' w-25 cont-tab_firmas'>
                      <table class='tbl_border0' style='margin: 0'>
                          <tr>
                              <th style='font-size: 1.5rem;'>$respon</th>
                          </tr>
                      </table>
                  </div>
              </div>
          </div>
        </div> ";
      }

      $stylesheet = file_get_contents(__DIR__ . '/../../../ReportesPDF/assets/main.css');

      $mpdf->SetHTMLHeader($header);
      $mpdf->SetHTMLFooter($footer);

      // Añadir contenido al PDF
      $namePdf = "Responsiva-". date("d-m-Y") .".pdf";
      $mpdf->AddPage();
      $mpdf->SetTitle($namePdf);
      $mpdf->WriteHTML($stylesheet,1);
      $mpdf->WriteHTML($htmla,2);
      foreach($arrTable as $table){
        $mpdf->WriteHTML($table,2 );
      }
      $mpdf->WriteHTML($htmlb,2);
      $content = $mpdf->Output('', 'S');

      ReturnEvent::returnResponse(0, "PDF generado con exito", base64_encode($content));
    } catch (Exception $e) {
      $this->thunderlog->writeLog("Error => " . $e->getMessage());
    }
  }

}

function main()
{
  // Leer el cuerpo de la solicitud
  $contenido = file_get_contents("php://input");
  $data = json_decode($contenido, true);
  $componenteService = new EquiposService($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
