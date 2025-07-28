
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 29/11/2024
ruta: thundersc/thunder/System/Inventario/Consultas/IngresoxEquipo.js
===============================================================================*/

let ObjGrid = null;
init();

function init() {
  initCamp();

  Funciones.setComboButtom(consultar,"#comboButtom",['GRID']);
  Funciones.FormatDate(["f_ini", "f_fin"]);
  tabs();
  $("#tab1").trigger("click");

  $('#download-grid').on('click', function() {
    ObjGrid.api.exportDataAsCsv({
      fileName: 'VtaScorpion.csv', // Nombre del archivo
      columnSeparator: ','           // Separador de columnas
    });
  });
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
  $('#download-grid').prop("disabled", true);
}


function tabs() {
  let wrapper = $(".tab-wrapper"),
      tabMenu = wrapper.find(".tab-menu li"),
      line = $('<div class="line"></div>').appendTo(tabMenu);

  tabMenu.each(function (i) {
      $(this).attr("data-tab", "tab" + i);
  });

  tabMenu.on("click", function () {
      let dataTab = $(this).data("tab"),
          getWrapper = $(this).closest(wrapper),
          tab = $(this);
      if (true) {
          getWrapper.find(tabMenu).removeClass("active");
          $(this).addClass("active");
          getWrapper.find(".line").width(0);
          $(this).find(line).animate({width: "100%"}, "fast");
          $("#labelCXC").removeClass("label-disabled");
      }

      toggleConsult(dataTab);
  });
}

function toggleConsult(tab) {
  $(".div-tab").hide()
  if (tab === "tab0") {
      $("#server").show();
      $("#map").hide();
  } else if (tab === "tab1") {
      $("#map").show();
      $("#server").hide();
  } 
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