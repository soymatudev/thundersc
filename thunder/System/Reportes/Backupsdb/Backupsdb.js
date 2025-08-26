
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 26/08/2025
ruta: thundersc/thunder/System/Reportes/Backupsdb/Backupsdb.js
===============================================================================*/

let numPermi = 0; let ObjGrid = null;
let arrModulos = []; let count = 0;
init();

function init() {
  initCamp();

  Funciones.setComboButtom(consultar,"#comboButtom",['GRID']);
  Funciones.FormatDate(["f_ini", "f_fin"]);

  $('#download-grid').on('click', function() {
    ObjGrid.api.exportDataAsCsv({
      fileName: 'Backupsdb.csv', // Nombre del archivo
      columnSeparator: ','           // Separador de columnas
    });
  });

  setTimeout(() => {
    $("#menuIN").click();
  }, 200);
  consultar();
}

function consultar() {
  let args = count == 0 ? ['', ''] : getFormData();
  let bridge = new Bridge(uu, cc, "System.Reportes.Backupsdb.BackupsdbService.consulta", args);
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
        grid(data.result, "#grid");
        count ++;
        indicador();
      }
    });
}

function getFormData() {
  let f_ini = $("#f_ini").val();
  let f_fin = $("#f_fin").val();
  return [f_ini, f_fin];
}

function indicador() {
  $(`[col-id="status"]`).each((index, item) => {
    if(index == 0) return;
    $(item).text() == "Succes" ? $(item).css("background-color", "#28a745") : $(item).css("background-color", "#dc3545");
    $(item).css("color", "#fff");
  })

}

function initCamp() {
  $('#download-grid').prop("disabled", true);
}


function grid(data, div = "#grid", pivote=false, data_total = false, single = false) {
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