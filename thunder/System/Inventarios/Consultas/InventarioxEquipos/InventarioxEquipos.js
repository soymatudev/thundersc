
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 29/11/2024
ruta: thundersc/thunder/System/Inventario/Consultas/InventarioxEquipos.js
===============================================================================*/

let numPermi = 0; let ObjGrid = null;
let arrItems = [];
init();

function init() {
  initCamp();

  Funciones.setComboButtom(consultar,"#comboButtom",['GRID']);
  Funciones.FormatDate(["f_ini", "f_fin"]);
  $("#crud_bt_responsiva").off('click').on('click', function () { getResponsiva(); });

  $('#download-grid').on('click', function() {
    ObjGrid.api.exportDataAsCsv({
      fileName: 'InventarioxEquipo.csv', // Nombre del archivo
      columnSeparator: ','           // Separador de columnas
    });
  });
}

function consultar() {
  let args = getFormData();
  let bridge = new Bridge(uu, cc, "System.Inventarios.Consultas.InventarioxEquipos.InventarioxEquiposService.consulta", args);
  let response = bridge.databriged();

  response
    .then(response => response.json())
    .then((data) => {
      if(data.event > 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.result,
        })
      } else {
        $('#download-grid').prop("disabled", false);
        arrItems = data.result;
        gridTotal(data.result, "#grid");
      }

      $("#crud_bt_add").prop("disabled", false);
      $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
    });
}

function getFormData() {
  let cve_alm = $("#select-almacen").val().trim();
  let f_ini = $("#f_ini").val();
  let f_fin = $("#f_fin").val();
  let status = $("#checkactive").prop("checked") ? 1 : 0;
  let formato = $("#btnSelect").val();
  let marca = $("#select-marca").val().trim();
  let clasif = $("#select-clasificacion").val().trim();
  let empleado = $("#select-empleado").val().trim();

  return [cve_alm, f_ini, f_fin, marca, clasif, empleado, status, formato];
}

function initCamp() {
  $("#usuario, #password, #descri, #cve_modulo").prop("disabled", true);
  $('#download-grid').prop("disabled", true);
  Componentes.almacenes(uu, cc, "div-almacenes");
  Componentes.marcas(uu, cc, "div-marcas");
  Componentes.clasificaciones(uu, cc, "div-clasificaciones");
  Componentes.empleados(uu, cc, "div-empleados");
}


function getResponsiva() {
  try {
    let args = arrItems;
    let bridge = new Bridge(uu, cc, "System.Inventarios.Consultas.InventarioxEquipos.InventarioxEquiposService.getResponsiva", [args]);
    let response = bridge.databriged();
  
    response
    .then(response => response.json())
    .then((data) => {
      if(data.event > 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.result,
        })
      } else {
        Funciones.insertarModal("responsiva", "Responsisiva Sistemas")
        createPDF(data.result);
      }
    });
  } catch (error) {
    Swal.showValidationMessage(`
      Error al generar: ${error}
    `);
  }
}

function createPDF(base64Data) {
  // Decodificar base64
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Crear un Blob con los datos del PDF
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  $(".contenido_modal").html("");
  $(".contenido_modal").append(`
    <iframe src="${url}" style="width: 100%; height: 100%;"></iframe>
  `);
}

function gridTotal(data, div = "#grid", pivote=false, data_total = false, single = false) {
  //function grid(data, div = "#grid", pivote=false, data_total = false) {
  $(div).html("")

  let totales = [];
  let rowSelect = single === true ? "single" : "multiple";
  if (data_total) totales = data.pop();

  const gridOptions = {
          columnDefs: data.pop(),
          defaultColDef: {
              sortable: true,
              filter: true,
              resizable: true
          },
          suppressMenuHide: true,
          rowSelection: rowSelect,
          enableRangeSelection: true,
          animateRows: false,
          pivotMode: pivote,
          statusBar: {
              statusPanels: [
                  {
                      statusPanel: 'agAggregationComponent',
                      statusPanelParams: {
                          aggFuncs: ['sum', 'count', 'avg']
                      }
                  }
              ]
          },
          columnTypes: {
              numero: {valueFormatter: Funciones.formatoNumero},
              digitos3: { valueFormatter: (params) => Funciones.formatoNumero(params, false, 3) },
              moneda: {valueFormatter: Funciones.moneda},
          },
          localeText: Funciones.localeText()
      },
      eGridDiv = Funciones._qs(div)

  new agGrid.Grid(eGridDiv, gridOptions)
  gridOptions.api.setRowData(data)
  ObjGrid = gridOptions;
}