<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 19/11/2024
ruta: thundersc/thundercloud/system/Inventarios/Consultas/InventarioxEquipos/InventarioxEquiposService.php
===============================================================================*/

require_once('../../../Connection/ConnectionADM.php');
require_once('../../../Connection/Connection.php');
require_once('../../../../Config/Config.php');
require_once('../../../../ReturnEvent/ReturnEvent.php');
require_once('../../../Connection/Statement.php');
require_once('../../../../ThunderLog/ThunderLog.php');
require_once('../../../../vendor/autoload.php');
use mPDF\mPDF;

class InventarioxEquiposService
{
  private $connadm = null;
  private $conn = null;
  private $thunderlog = null;

  public function __construct($uu)
  {
    $this->connadm = (new ConnectionADM(__DIR__))->connect();
    $this->thunderlog = new Log(__DIR__, $uu);
  }


  public function consulta($uu, $cc, $cve_alm, $f_ini, $f_fin, $marca, $clasif, $empleado, $status, $formato)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $active = ''; $xalm = ''; $xperiodo = '';
      $active = ($status == 1) ? "AND b.status = 'A'" : "AND b.status <> 'A'";
      $xalm = strlen($cve_alm) > 0 ? "AND a.cve_alm = '$cve_alm'" : '';
      $marca = strlen($marca) > 0 ? "AND b.cve_marca = '$marca'" : '';
      $clasif = strlen($clasif) > 0 ? "AND b.cve_clasif = '$clasif'" : '';
      $empleado = strlen($empleado) > 0 ? "AND a.cve_emple = '$empleado'" : '';
      $xperiodo = strlen($f_ini) > 0 && strlen($f_fin) > 0 ? "AND a.f_movto BETWEEN '$f_ini' AND '$f_fin'" : '';

      $query = "SELECT b.cod_inv, b.serie, c.clave, c.descri as almac, f.descri as emple, g.descri as marca, e.descri as depar, d.descri as clasif, a.f_movto, 
      CASE WHEN b.status = 'A' THEN 'Activo' ELSE 'Inactivo' END AS status
      from ma_eqasis a, ma_eqsis b, ma_almac c, ma_clasif d, ma_depar e, ma_emple f, ma_marca g
      where 
      a.cve_alm = c.clave
      and a.cve_eqsis = b.clave
      and a.cve_emple = f.id
      and a.cve_depar = e.clave
      and b.cve_marca = g.clave
      and b.cve_clasif = d.clave
      $active
      $xalm
      $marca
      $clasif
      $empleado
      $xperiodo
      order by a.f_movto desc";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);
      $this->thunderlog->writeLog("Query => " . $query);

      if ($res) {
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {
          

          for ($x = 0; $x < count($result); $x++) {
            $result[$x]['cod_inv'] = thunderToUtf8(trim($result[$x]['cod_inv']));
            $result[$x]['serie'] = thunderToUtf8(trim($result[$x]['serie']));
            $result[$x]['clave'] = thunderToUtf8(trim($result[$x]['clave']));
            $result[$x]['almac'] = thunderToUtf8(trim($result[$x]['almac']));
            $result[$x]['emple'] = thunderToUtf8(trim($result[$x]['emple']));
            $result[$x]['marca'] = thunderToUtf8(trim($result[$x]['marca']));
            $result[$x]['depar'] = thunderToUtf8(trim($result[$x]['depar']));
            $result[$x]['clasif'] = thunderToUtf8(trim($result[$x]['clasif']));
            $result[$x]['f_movto'] = date("d/m/Y", strtotime($result[$x]['f_movto']));
            $result[$x]['status'] = thunderToUtf8(trim($result[$x]['status']));
          }

          if ($formato == "GRID") {
            $headerGrid = [
              ["headerName" => "Cve Alm", "field" => "clave", "width" => 80],
              ["headerName" => "Almacen", "field" => "almac", "width" => 200],
              ["headerName" => "Cod. Inv", "field" => "cod_inv", "width" => 150],
              ["headerName" => "Serie", "field" => "serie", "width" => 120],
              ["headerName" => "Marca", "field" => "marca", "width" => 120],
              ["headerName" => "Clasificación", "field" => "clasif", "width" => 120],
              ["headerName" => "Departamento", "field" => "depar", "width" => 120],
              ["headerName" => "Empleado", "field" => "emple", "width" => 120],
              ["headerName" => "Fecha Movto", "field" => "f_movto", "width" => 120],
              ["headerName" => "Status", "field" => "status", "width" => 80]
            ];
  
            array_push($result, $headerGrid);
            ReturnEvent::returnResponse(0, "Datos obtennidos con exito", $result);
          } else {
            //PDF
          }
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

  public function getAlmacenes($uu, $cc, $args)
  {
    try {
      $this->conn = (new Connection(__DIR__, $cc))->connect();
      if (!$this->conn) {
        $this->thunderlog->writeLog("Error de conexión" . $this->conn);
        return null;
      }

      $query = "SELECT clave, descri FROM ma_almac a, ma_almus b WHERE a.clave = b.cve_alm and b.cns_sn = 'S' AND b.cve_usu = :uu";
      $stmt = new Statement($this->conn, (__DIR__));
      $res = $stmt->prepareStatement($query);

      if ($res) {
        $res->bindParam(':uu', explode('-',$uu)[0], PDO::PARAM_STR);
        $result = $stmt->executePreparedQuery($res);
        if ($result !== false) {

          for ($x = 0; $x < count($result); $x++) {
            $result[$x]['clave'] = thunderToUtf8(trim($result[$x]['clave']));
            $result[$x]['descri'] = thunderToUtf8(trim($result[$x]['descri']));
          }

          ReturnEvent::returnResponse(0, "Almacenes Obtenidas con Exito", $result);
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

  public function getResponsiva($uu, $cc, $arrEquipos) {
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
      
      //$this->thunderlog->writeLog("Execute => " . print_r($arrEquipos, true));

      $table = "<table style='font-size: .6rem;'>";
      $arrTable = array();

      foreach($arrEquipos as $ii => $rd)
      {
        if($ii == count($arrEquipos)-1) {
          $table.="<tr>";
            $table.="<td width='25%' style='border-bottom: 1px solid; border-left: 1px solid;'>". $rd['cod_inv']."</td>";
            $table.="<td width='25%' style='border-bottom: 1px solid; border-left: 1px solid;'>". $rd['serie']."</td>";
            $table.="<td width='15%' style='border-bottom: 1px solid; border-left: 1px solid;'>". $rd['marca']."</td>";
            $table.="<td width='15%' style='border-bottom: 1px solid; border-left: 1px solid;'>". $rd['clasif']."</td>";
            $table.="<td width='20%' style='border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;'>". $rd['modelo']."</td>";
            /* $table.="<td align='center' width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['departamento']."</td>"; */
          $table.="</tr>";
        } else {
          $table.="<tr>";
            $table.="<td width='25%' style='border-bottom: 0px solid #000; border-left: 1px solid;'>". $rd['cod_inv']."</td>";
            $table.="<td width='25%' style='border-bottom: 0px solid #000; border-left: 1px solid;'>". $rd['serie']."</td>";
            $table.="<td width='15%' style='border-bottom: 0px solid #000; border-left: 1px solid;'>". $rd['marca']."</td>";
            $table.="<td width='15%' style='border-bottom: 0px solid #000; border-left: 1px solid;'>". $rd['clasif']."</td>";
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
      $respon = $arrEquipos[0]['emple'];
      $depto = $arrEquipos[0]['depar'];

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
      ReturnEvent::returnResponse(1, "Error al generar el PDF", "Error al generar el PDF");
    }
  }
}

function main()
{
  // Leer el cuerpo de la solicitud
  $contenido = file_get_contents("php://input");
  $data = json_decode($contenido, true);
  $componenteService = new InventarioxEquiposService($data['uu']);
  $func = $data['function'];
  $componenteService->$func($data['uu'],$data['cc'],...$data['args']);
}

main();
