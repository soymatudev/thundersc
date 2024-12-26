
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 29/11/2024
ruta: thundersc/thunder/System/Inventario/Consultas/IngresoxEquipo.js
===============================================================================*/

let numPermi = 0; 
let arrModulos = [];
init();

function init() {
  initCamp();

  Funciones.setComboButtom(consultar,"#comboButtom",['GRID']);
  Funciones.FormatDate(["f_ini", "f_fin"]);
}

function consultar() {
  let args = getFormData();
  let bridge = new Bridge(uu, cc, "System.Inventarios.Consultas.IngresoxEquipo.IngresoxEquipoService.consulta", args);
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
        gridTotal(data.result, "#grid");
      }

      $("#crud_bt_add").prop("disabled", false);
      $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
    });
}

function getFormData() {
  let numero = $("#serie").val();
  let codinv = $("#codinv").val();
  let f_ini = $("#f_ini").val();
  let f_fin = $("#f_fin").val();
  let status = $("#checkactive").prop("checked") ? 1 : 0;
  let formato = $("#btnSelect").val();
  let marca = $("#select-marca").val().trim();
  let clasif = $("#select-clasificacion").val().trim();

  return [numero, codinv, f_ini, f_fin, marca, clasif, status, formato];
}

function initCamp() {
  $("#usuario, #password, #descri, #cve_modulo").prop("disabled", true);
  $('#download-grid').prop("disabled", true);
  Componentes.marcas(uu, cc, "div-marcas");
  Componentes.clasificaciones(uu, cc, "div-clasificaciones");
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

  $('#download-grid').on('click', function() {
    gridOptions.api.exportDataAsCsv({
      fileName: 'IngresoxEquipo.csv', // Nombre del archivo
      columnSeparator: ','           // Separador de columnas
    });
  });
}