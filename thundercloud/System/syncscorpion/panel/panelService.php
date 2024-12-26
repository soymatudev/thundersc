<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 22/04/2024
ruta: thundersc/thundercloud/system/mantenimiento/usuarioyequipo/usuarioyequipo.php
===============================================================================*/
require_once('../../Connection/Connection.php');
require_once('../../Connection/Statement.php');
require '../../../vendor/autoload.php';
use mPDF\mPDF;
//use Mpdf\Mpdf;

class Querys extends Statement
{
  private $conexion;
  private const LOG_FILE = 'process.log';

  public function __construct()
  {
    $this->conexion = Connection::connect();
  }

  public static function getTable()
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }

    $query = "SELECT tip_vta as Tipo, cve_alm as Almacen, f_venta as F_Venta, vta_sco as Venta_Sco, vta_pcz as Venta_Importada, vta_dif as Diferencia FROM ma_vtasco where status = 'S'";

    $almacen = $_POST['almacen'];
    $fecha = $_POST['fecha'];
    $query .= $fecha != "" ? " and f_venta = '" . $fecha . "'" : "";
    $query .= $almacen != "TODOS" ? " and cve_alm = ''" : "";

    file_put_contents(self::LOG_FILE, "\n Execute Query => " . $query . "\n", FILE_APPEND);

    //$query = "SELECT nombre FROM de_$catalogo";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {

        for($i = 0; $i < count($result); $i++) {
            $result[$i]['Tipo'] = trim($result[$i]['Tipo']);
            $result[$i]['Almacen'] = trim($result[$i]['Almacen']);
            $result[$i]['F_Venta'] = trim($result[$i]['F_Venta']);
            $result[$i]['Venta_Sco'] = number_format($result[$i]['Venta_Sco'], 8, '.', ',');
            $result[$i]['Venta_Importada'] = number_format($result[$i]['Venta_Importada'], 8, '.', ',');
            $result[$i]['Diferencia'] = number_format($result[$i]['Diferencia'], 8, '.', ',');
        }

        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public static function getDataPDF($catalogo)
  {
    $conn = Connection::connect();

    $query = '';
    if (!$conn) {
      file_put_contents(self::LOG_FILE, "\nError de conexión\n", FILE_APPEND);
      return null;
    }
    file_put_contents(self::LOG_FILE, "\nCatalogo => " . $catalogo . "\n", FILE_APPEND);

    if ($catalogo == "equipo") {
      $query = "SELECT 
      fecha_registro, num_serie AS 'Numero_Serie', 
      modelo, cla.nombre AS 'Equipo', 
      mar.nombre AS 'Marca', 
      are.nombre AS 'Area', 
      CONCAT(asi.nombre, ' ', asi.apellidos) AS 'Asignatario', 
      CONCAT(alm.cve_alm, ' ', alm.nombre) AS 'Almacen' 
      FROM ma_equi_sis 
      JOIN de_clasif_equi cla ON ma_equi_sis.id_clasif = cla.id 
      JOIN de_marca mar ON ma_equi_sis.id_marca = mar.id 
      JOIN de_area are ON ma_equi_sis.id_area = are.id 
      JOIN de_asignatario asi ON ma_equi_sis.id_asignatario = asi.id 
      JOIN de_almacen alm ON ma_equi_sis.id_almacen = alm.id WHERE 1";

      $query .= !empty($_POST['num_serie']) ? " AND num_serie LIKE '%" . $_POST['num_serie'] . "%'" : "";
      $query .= !empty($_POST['modelo']) ? " AND modelo LIKE '%" . $_POST['modelo'] . "%'" : "";
      $query .= !empty($_POST['clasificacion']) ? " AND cla.nombre LIKE '%" . $_POST['clasificacion'] . "%'" : "";
      $query .= !empty($_POST['marca']) ? " AND mar.nombre LIKE '%" . $_POST['marca'] . "%'" : "";
      $query .= !empty($_POST['area']) ? " AND are.nombre LIKE '%" . $_POST['area'] . "%'" : "";
      $query .= !empty($_POST['asignatario']) ? " AND CONCAT(asi.nombre, ' ', asi.apellidos) LIKE '%" . $_POST['asignatario'] . "%'" : "";
      $query .= !empty($_POST['almacen']) ? " AND CONCAT(alm.cve_alm, ' ', alm.nombre) LIKE '%" . $_POST['almacen'] . "%'" : "";
      $query .= !empty($_POST['f_Ini']) && !empty($_POST['f_Fin']) ? " AND fecha_registro BETWEEN '" . $_POST['f_Ini'] . "' AND  '" . $_POST['f_Fin'] . "'" : "";
      $query .= !empty($_POST['f_Ini']) && empty($_POST['f_Fin']) ? " AND fecha_registro = '" . $_POST['f_Ini'] . "'" : "";
      $query .= !empty($_POST['f_Fin']) && empty($_POST['f_Ini']) ? " AND fecha_registro = '" . $_POST['f_Fin'] . "'" : "";
      
    } 
    //$query = "SELECT nombre FROM de_$catalogo";
    $stmt = self::prepareStatement($query);

    if ($stmt) {
      $result = self::executePreparedQuery($stmt);
      if ($result !== false) {
        file_put_contents(self::LOG_FILE, "\nExecute => Correct\n", FILE_APPEND);
        file_put_contents(self::LOG_FILE, "\nExecute => " . print_r($result, true) . "\n", FILE_APPEND);
        return $result;
      } else {
        file_put_contents(self::LOG_FILE, "\nExecute => Incorrect\n", FILE_APPEND);
        return ["Execute" => "Incorrect"];
      }
    } else {
      file_put_contents(self::LOG_FILE, "\nExecute => Incorrect sin stmt\n", FILE_APPEND);
      return ["Execute" => "Incorrect"];
    }
  }

  public function cerrarConexion()
  {
    // Cierra la conexion cuando ya no sea necesaria
    $this->conexion = null;
  }
}

function showTable()
{
  $data = Querys::getTable();
  //$data->cerrarConexion();
  header('Content-Type: application/json');
  return json_encode($data);
}

function showDataPDF()
{
  try {
    $catalogo = $_POST['catalogo'];
    $data = Querys::getDataPDF($catalogo);

    return getPDF($data);
  } catch (\Mpdf\MpdfException $e) {
    // Handle specific mPDF errors
    file_put_contents("process.log", "Error => " . $e->getMessage(), FILE_APPEND);
    return ["Error" => "Error con mPDF: " . $e->getMessage()];
  }
}

function getPDF($data)
{
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

  $table = "<table style='font-size: .6rem;'>";
  $arrTable = array();

  foreach($data as $ii => $rd)
  {
    if ($ii == count($data)-1) {
      $table.="<tr>";
        $table.="<td width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['fecha_registro']."</td>";
        $table.="<td align='center' width='16%' align='center' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Numero_Serie']."</td>";
        $table.="<td align='center' width='12%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['modelo']."</td>";
        $table.="<td align='center' width='13%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Equipo']."</td>";
        $table.="<td align='center' width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Marca']."</td>";
        $table.="<td align='center' width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Area']."</td>";
        $table.="<td align='center' width='16%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Asignatario']."</td>";
        $table.="<td align='center' width='12%' style='border: 0px solid #000;'>". $rd['Almacen']."</td>";
      $table.="</tr>";
    } else {
      $table.="<tr>";
        $table.="<td width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['fecha_registro']."</td>";
        $table.="<td align='center' width='16%' align='center' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Numero_Serie']."</td>";
        $table.="<td align='center' width='12%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['modelo']."</td>";
        $table.="<td align='center' width='13%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Equipo']."</td>";
        $table.="<td align='center' width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Marca']."</td>";
        $table.="<td align='center' width='10%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Area']."</td>";
        $table.="<td align='center' width='16%' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>". $rd['Asignatario']."</td>";
        $table.="<td align='center' width='12%' style='border: 0px solid #000;'>". $rd['Almacen']."</td>";
      $table.="</tr>";
    }
  }

  $table.="<tr>";
    $table.="<td colspan='3' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>Se procesaron: ". count($data) ." Equipos</td>";
  $table.="</tr>";

  $table.="<tr>";
    $table.="
    <td colspan='8' style='border-bottom: 0px solid #000; border-left: 0px solid #000;'>
      <p style='font-size: 1.2rem;'>
      Equipo que se ha entregado <b>Para el uso en sucursal y del área;</b> si enel transcurso del periodo de uuso sufriese algún siniestro 
      (total o parcial por negligencia o descruido), <b>será responsabilidad de quien se le fue asginado la reparación o sustitución del mismo.</b>
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
          <th align='center' width='10%' style='font-size: 1.2rem;' >F. Registro</th>
          <th align='center' width='16%'>Num. Serie</th>
          <th width='12%'>Modelo</th>
          <th width='13%'>Equipo</th>
          <th width='10%'>Marca</th>
          <th width='10%'>Area</th>
          <th width='16%'>Asignatario</th>
          <th width='12%'>Almacen</th>
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

  if (!empty($_POST['asignatario'])) {
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
                          <th style='font-size: 1.5rem;'>Responsable y Firma</th>
                      </tr>
                  </table>
              </div>
          </div>
      </div>
    </div> ";
  }

  $stylesheet = file_get_contents(__DIR__ . '/../../ReportesPDF/assets/main.css');

  $mpdf->SetHTMLHeader($header);
  $mpdf->SetHTMLFooter($footer);

  // Añadir contenido al PDF
  $namePdf = "NuevoPDF.pdf";
  $mpdf->AddPage();
  $mpdf->SetTitle($namePdf);
  $mpdf->WriteHTML($stylesheet,1);
  $mpdf->WriteHTML($htmla,2);
  foreach($arrTable as $table){
    $mpdf->WriteHTML($table,2 );
  }
  $mpdf->WriteHTML($htmlb,2);
  $content = $mpdf->Output('', 'S');

  header('Content-Type: application/json');
  return json_encode(base64_encode($content));
}