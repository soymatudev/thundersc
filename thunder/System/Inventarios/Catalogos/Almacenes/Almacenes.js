
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thunder/System/Inventarios/Catalogos/Almacenes/Almacenes.js
===============================================================================*/
let searchActive = false;
init();

function init() {
  initPermi();
  initCamp();

  $("#crud_bt_add").off('click').on('click', function () { crudAdd(); });
  $("#crud_bt_save").off('click').on('click', function () { crudSave(); });
  $("#crud_bt_cancel").off('click').on('click', function () { crudCancel(); });
  $("#crud_bt_search").off('click').on('click', function () { crudSearch(); });

  $("#clave").on("change keyup", function (e) {
    if(e.keyCode === 13 &&  $("#clave").val().trim().length > 0) {
      getAlmacen();
    }
  });
}

function initPermi() {
  $("#crud_bt_update, #crud_bt_save, #crud_bt_cancel").prop("disabled", true);
  Funciones.ThunderPermi("usrinsert") ? $("#crud_bt_add").prop("disabled", false) : $("#crud_bt_add").prop("disabled", true);
}

function initCamp() {
  $("#clave, #descri, #coloni, #domici, #ciudad, #munici, #estado, #pais, #codpos, #telef1").prop("disabled", true);
}

function crudAdd() {
  $("#crud_bt_add").prop("disabled", true);
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", false);
  $("#clave, #descri, #coloni, #domici, #ciudad, #munici, #estado, #pais, #codpos, #telef1").prop("disabled", false);
  searchActive = false;
}

function crudSearch() {
  searchActive = true;
  $("#clave").prop("disabled", false);
}

function getAlmacen() {
  let args = $("#clave").val().trim();
  let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Almacenes.AlmacenesService.crudSearch", [args]);
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
        let dataxalm = data.result;
        $("#clave").val(dataxalm[0].clave);
        $("#descri").val(dataxalm[0].descri);
        $("#coloni").val(dataxalm[0].coloni);
        $("#domici").val(dataxalm[0].domici);
        $("#ciudad").val(dataxalm[0].ciudad);
        $("#munici").val(dataxalm[0].munici);
        $("#estado").val(dataxalm[0].estado);
        $("#pais").val(dataxalm[0].pais);
        $("#codpos").val(dataxalm[0].codpos);
        $("#telef1").val(dataxalm[0].telef1);
      }
    });
}

function crudCancel() {
  Swal.fire(
    Funciones.getConfigConfirmAlert("¿Realmente deseas cancelar los cambios?", "question")
  ).then(result => {
    if(result.value) {
      initPermi();
      $("#clave, #descri, #coloni, #domici, #ciudad, #munici, #estado, #pais, #codpos, #telef1").prop("disabled", true);
      $("#clave, #descri, #coloni, #domici, #ciudad, #munici, #estado, #pais, #codpos, #telef1").val("");
      searchActive = false;
    }
  })
}

function crudSave() {
  if (getDataForm().includes("")) {
    Swal.fire({
      icon: "warning",
      title: "Campos vacios",
      text: "Debes llenar todos los campos",
    });
  } else {
    Swal.fire(
      Funciones.getConfigConfirmAlert("¿Realmente deseas guardar los cambios?", "question")
    ).then((result) => {
        if (result.value) {
          let args = getDataForm();
          let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Almacenes.AlmacenesService.crudSave", args);
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
                Swal.fire({
                  icon: "success",
                  title: "Exito al guardar",
                  text: "Almacen creado con exito",
                })
              }
              $("#crud_bt_add").prop("disabled", false);
              $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
            });
        }
    });
  }
}

function getDataForm() {
  let clave = $("#clave").val().trim();
  let descri = $("#descri").val().trim();
  let coloni = $("#coloni").val().trim();
  let domici = $("#domici").val().trim();
  let ciudad = $("#ciudad").val().trim();
  let munici = $("#munici").val().trim();
  let estado = $("#estado").val().trim();
  let pais = $("#pais").val().trim();
  let codpos = $("#codpos").val().trim();
  let telef1 = $("#telef1").val().trim();

  return [clave, descri, coloni, domici, ciudad, munici, estado, pais, codpos, telef1];
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
}