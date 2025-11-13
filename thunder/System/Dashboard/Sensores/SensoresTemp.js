
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
  getTermometerData();
  getDataChartLines();

  $("#formato").on("change", function() {
    let formato = $(this).val();
    if(formato == "1") {
      Funciones.setComboButtom(consultar,"#comboButtom",['SENSOR']);
      $(".consultas, .grid-dev").hide();
      $("#div-zonas, #dashboard-div").show();
    } else {
      Funciones.setComboButtom(consultar,"#comboButtom",['GRID']);
      $(".consultas, .grid-dev").show();
      $("#div-zonas, #dashboard-div").hide();
    }
  });

  /* $(".reload-thermometer").on("click", function() {
    setTimeout(() => {
      console.log("Le pico al rangeInput");
      getDataChartLines();
    }, 6500)
  }); */
  setTimeout(() => {
    $("#menuIN").click();
  }, 100);
}

function consultar() {
  let formato = $("#formato").val();
  if (formato == "1") {
    getInfoSensores();
  } else {
    getListado();
    getDataChartLines();
  }
}

function getInfoSensores() {
  let sensores = "ALL";
  sensores += "*web";
  $("body").css("cursor", "wait");
  let bridge = new Bridge(uu, cc, "Sockets.SocketConnection.socketHTTP", [sensores]);
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
      }
      setTimeout(() => {
        $("body").css("cursor", "default");
        getTermometerData();
        getDataChartLines();
      }, 6000);
    });
}

function getFormData() {
  let f_ini = $("#f_ini").val();
  let f_fin = $("#f_fin").val();
  let formato = $("#select-sensores").val();

  return [f_ini, f_fin, formato];
}

function initCamp() {
  Componentes.zonas(uu, cc, "div-zonas");
  $(".consultas, .grid-dev").hide();
  Componentes.sensores(uu, cc, "div-sensores");
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
        $("#dashboard").html("");
        data = data.result;
        data.forEach(item => {
          new Thermometer(".dashboard", item.nombre, item.alias, item.temp, (parseFloat(item.d_min)-13), (parseFloat(item.d_max)+13), false, "Celcius", true, item.socket_port);
        });
      
      }
    });
}

function getDataChartLines() {
  let args = $("#formato").val() == "2" ? getFormData() : [];
  let bridge = new Bridge(uu, cc, "System.Dashboard.Sensores.SensoresTempService.getDataLines", args);
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
        let data_limits = data.result.pop();
        chartLines([...data.result], "#chart-lines", data_limits[0], data_limits[1]);
        chartHumLines(data.result, "#chart-hum");
      }
    });
}

function chartLines (data, div = "", min_temp = 10, max_temp = 22) {
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
  
  const options = {
    container: $(div)[0],
    title: {
      text: "Registro de Temperaturas",
    },
    series: series,
    axes: [
      {
        type: "time",
        position: "bottom",
        label: {
          format: "%d/%m %H:%M min",
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          format: "#{.1f} °C",
        },
        min: parseFloat(min_temp)-10,
        max: parseFloat(max_temp)+10,
      },
    ],
  };
  
//  AgCharts.create(options);
  //const chart = agCharts.AgCharts.create(options);
  AgCharts.create(options);
}

function chartHumLines (data, div = "") {
  $(div).html("");
  equipos = data.pop();
  series = [];

  for(let key in equipos) {
    series.push({
      type: "line",
      data: sortData(data, equipos[key], "hum"),
      xKey: "time",
      yKey: "sensor",
      yName: equipos[key],
    });
  }
  
  const options = {
    container: $(div)[0],
    title: {
      text: "Registro de Humedad",
    },
    series: series,
    axes: [
      {
        type: "time",
        position: "bottom",
        label: {
          format: "%d/%m %H:%M min",
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          format: "#{.1f} %",
        },
        min: 0,
        max: 100,
      },
    ],
    legend: {
      enabled: false // 🚀 Esto oculta la lista de botones
    }
  };
  AgCharts.create(options);
}

function sortData(data, equipo, type = "temp") {
  let dataReturn = [];
  data.forEach(item => {
    if(item.alias === equipo) {
      dataReturn.push({
        time: new Date(item.fecha_hora),
        sensor: type == "temp" ? parseFloat(item.temp) : parseFloat(item.hum),
      });
    }
  })
  return dataReturn;
}

function getListado() {
  let bridge = new Bridge(uu, cc, "System.Dashboard.Sensores.SensoresTempService.getListados", getFormData());
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
        grid(data, "#grid");
      }
    });
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