
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thunder/System/Inventario/Catalogos/Departamento/Departamento.js
===============================================================================*/
let arrItems = [], cve_item_remove = ""; let action = "";
let estructura = [
    {"headerName": "Nombre", "field": "descri", "width": 300},
]

init();

function init() {
    initPermi();

    Componentes.departamentos(uu, cc, "div-departamento");
    initCamp();

    $("#crud_bt_add").off('click').on('click', function () { crudAdd(); });
    $("#crud_bt_save").off('click').on('click', function () { crudSave(); });
    $("#crud_bt_cancel").off('click').on('click', function () { crudCancel(); });
    $("#crud_bt_search").off('click').on('click', function () { crudSearch(); });
    $("#crud_bt_update").off('click').on('click', function () { crudUpdate(); });
    $("#crud_bt_delete").off('click').on('click', function () { crudDelete(); });

    $("#btn_add").off('click').on('click', function () { addItemToArr(); });
    $("#btn_remove").off('click').on('click', function () { removeItemToArr(); });
    $("#crud_bt_search").hide();
}

function initPermi() {
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
  $("#crud_bt_add").prop("disabled",  !Funciones.ThunderPermi("usrinsert"));
  $("#crud_bt_update").prop("disabled",  !Funciones.ThunderPermi("usrupdate"));
  $("#crud_bt_search, #crud_bt_delete").prop("disabled", true);
  $("#btn_add, #btn_remove").prop("disabled", true);
}

function initCamp() {
  $("#descri").prop("disabled", true);
  setTimeout(() => { $("#select-departamento").prop("disabled", true); }, 250);
}

function crudAdd() {
  $("#descri").prop("disabled", false);
  $("#crud_bt_add").prop("disabled", true);
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", false);
  $("#btn_add, #btn_remove").prop("disabled", false);
  $("#select-departamento").prop("disabled", true);
  $("#grid").html("");
  arrItems = [];
  action = "INSERT";
}

function crudSearch() {}

function addItemToArr() {
    let nombre = $("#descri").val().trim();
    
    if (nombre.length > 0) {
        arrItems.push({
            "id": Date.now(),
            "descri": nombre,
        });

        arrItems.push(estructura);
        gridTotal(arrItems, "#grid", false, false, false );
    } else {
        Swal.fire({
            icon: "warning",
            title: "Campos vacios",
            text: "Debes llenar todos los campos",
        });
    }
}

function removeItemToArr() {
    arrItems = arrItems.filter((equipo) => equipo.id !== cve_item_remove);
    arrItems.push(estructura);
    gridTotal(arrItems, "#grid", false, false, false );
}

function getEquipo() {
  let args = $("#codinv").val().trim();
  let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Departamentos.DepartamentosService.crudSearch", [args]);
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
        let datax = data.result;
        $("#serie").val(datax[0].serie);
        $("#select-marca").val(datax[0].cve_marca).trigger("change");
        $("#select-clasificacion").val(datax[0].cve_clasif).trigger("change");
        $("#f_ini").text(datax[0].f_registro);
        $("#select-status").val(datax[0].status);
      }
    });
}

function crudCancel() {
  Swal.fire(
    Funciones.getConfigConfirmAlert("¿Realmente deseas cancelar los cambios?", "question")
  ).then(result => {
    if(result.value) {
      initPermi();
      $("#descri").val("");
      $("#descri, #select-departamento").prop("disabled", true);
      $("#btn_add, #btn_remove").prop("disabled", true);
      $("#grid").html("");
      arrItems = [];
    }
  })
}

function crudSave() {
  if (action === "INSERT") {
    if (arrItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Listado vacio",
        text: "Debes agregar por lo menos un registro",
      });
    } else {
      Swal.fire(
        Funciones.getConfigConfirmAlert("¿Realmente deseas guardar los cambios?", "question")
      ).then((result) => {
          if (result.value) {
            
            let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Departamentos.DepartamentosService.crudSave", [arrItems]);
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
                    text: data.result,
                  })
                }
                initPermi();
                $("#descri").prop("disabled", true);
                action = "";
              });
          }
      });
    }
  } else if (action === "UPDATE") {
    let clave = $("#select-departamento option:selected").val();
    let nombre = $("#descri").val().trim();
    if (clave === "" || nombre === "") {
      Swal.fire({
        icon: "warning",
        title: "Campos vacios",
        text: "Debes seleccionar un departamento",
      });
    } else {
      Swal.fire(
        Funciones.getConfigConfirmAlert("¿Realmente deseas actualizar los cambios?", "question")
      ).then((result) => {
          if (result.value) {
            
            let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Departamentos.DepartamentosService.crudUpdate", [clave, nombre]);
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
                    title: "Exito al actualizar",
                    text: data.result,
                  })
                }
                initPermi();
                $("#descri").prop("disabled", true);
                action = "";
              });
          }
      });
    }
  } 
}


function crudUpdate() {
  $("#btn_add, #btn_remove").prop("disabled", true);
  $("#select-departamento, #descri").prop("disabled", false);
  $("#crud_bt_save, #crud_bt_cancel, #crud_bt_delete").prop("disabled", false);
  $("#crud_bt_add").prop("disabled", true);
  $("#crud_bt_delete").prop("disabled",  !Funciones.ThunderPermi("usrdelete"));
  action = "UPDATE";
}

function crudDelete() {
  let clave = $("#select-departamento option:selected").val();
  if (clave === "") {
    Swal.fire({
      icon: "warning",
      title: "Campos vacios",
      text: "Debes seleccionar un departamento",
    });
  } else {
    Swal.fire(
      Funciones.getConfigConfirmAlert(`¿Realmente deseas eliminar el departamento?`, "question")
    ).then((result) => {
        if (result.value) {
          let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Departamentos.DepartamentosService.crudDelete", [clave]);
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
                  title: "Exito al eliminar",
                  text: data.result,
                })
              }
              initPermi();
              $("#descri").prop("disabled", true);
              $("#select-departamento").prop("disabled", true);
              action = "";
            });
        }
    });
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

    gridOptions.onSelectionChanged = () => {
        const selectedRows = gridOptions.api.getSelectedRows();
        if (arrItems.length > 0) cve_item_remove = selectedRows[0].id;
    }

  new agGrid.Grid(eGridDiv, gridOptions)
  gridOptions.api.setRowData(data)
}