
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 12/06/2025
ruta: thundersc/thunder/System/Dashboard/Maizoro/sensores.js
===============================================================================*/

let ObjGrid = null;
const { AgCharts } = agCharts;
init();

function init() {
  initCamp();
  Funciones.setComboButtom(consultar,"#comboButtom",['SENSOR']);
  //getTermometerData();
  //getDataChartLines();
}

function consultar() {
  let bridge = new Bridge(uu, cc, "System.Utilerias.TiendasNext.TiendasNextService.consulta", []);
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
  let f_ini = $("#f_ini").val();
  let f_fin = $("#f_fin").val();
  let formato = $("#btnSelect").val();

  return [f_ini, f_fin, formato];
}

function initCamp() {
  Componentes.zonas(uu, cc, "div-zonas");
  $('#download-grid').prop("disabled", true);
}

function getTermometerData() {
  let bridge = new Bridge(uu, cc, "System.Dashboard.Sensores.SensoresTempService.getUltTemp", []);
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
        data = data.result;
        data.forEach(item => {
          new Thermometer(".dashboard", item.nombre, item.temp, -10, 20, false, 100, 20, "Fahrenheit");
        });
      
      }
    });
}

function getDataChartLines() {
  let bridge = new Bridge(uu, cc, "System.Dashboard.Sensores.SensoresTempService.getDataLines", []);
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
        data = data.result;
        chartLines(data, "#chart-lines");
      }
    });
}

function chartLines (data, div = "") {
  $(div).html("");
  equipos = data.pop();
  series = [];

  for(let key in equipos) {
    series.push({
      type: "line",
      data: sortData(data, equipos[key]),
      xKey: "time",
      yKey: "sensor",
      yName: equipos[key],
    });
  }

  console.log(series);
  
  const options = {
    container: $(div)[0],
    title: {
      text: "Registro de Temperaturas",
    },
    series: series,
    axes: [
      {
        type: "ordinal-time",
        position: "bottom",
      },
      {
        type: "number",
        position: "left",
        label: {
          format: "#{.1f} °F",
        },
      },
    ],
  };
  
//  AgCharts.create(options);
  //const chart = agCharts.AgCharts.create(options);
  AgCharts.create(options);
}

function sortData(data, equipo) {
  let dataReturn = [];
  let a = 1;
  data.forEach(item => {
    if(item.nombre === equipo) {
      a = a + 1;
      dataReturn.push({
        time: new Date(item.fecha_hora).toLocaleString(),
        sensor: parseFloat(item.temp),
      });
    }
  })
  return dataReturn;
}










function grid(data, div = "#grid", pivote=false, data_total = false, single = false) {
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