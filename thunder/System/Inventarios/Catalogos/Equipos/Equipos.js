
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 05/12/2024
ruta: thundersc/thunder/System/Inventarios/Catalogos/Equipos/Equipos.js
===============================================================================*/
let arrItems = [], cve_item_remove = ""; let action = ""; let ObjGrid = null;
let estructura = [
  {"headerName": "Cod. Inv", "field": "codgen", "width": 100},
  {"headerName": "Codigo", "field": "codigo", "width": 100},
  {"headerName": "Serie", "field": "serie", "width": 120},
  {"headerName": "Marca", "field": "marca", "width": 120},
  {"headerName": "Tipo", "field": "clasificacion", "width": 120},
  {"headerName": "Modelo", "field": "modelo", "width": 120},
  {"headerName": "F. Ingreso", "field": "fini", "width": 120},
  {"headerName": "Estatus", "field": "status", "width": 120},
]
init();

function init() {
  initPermi();
  initCamp();

  $("#crud_bt_add").off('click').on('click', function () { crudAdd(); });
  $("#crud_bt_save").off('click').on('click', function () { crudSave(); });
  $("#crud_bt_cancel").off('click').on('click', function () { crudCancel(); });
  $("#crud_bt_search").off('click').on('click', function () { crudSearch(); });
  $("#crud_bt_update").off('click').on('click', function () { crudUpdate(); });
  $("#crud_bt_delete").off('click').on('click', function () { crudDelete(); });
  $("#upload-file").off('click').on('click', function () { fileUp(); });

  $("#codexis").on("change keyup", function (e) {
    if(e.keyCode === 13 &&  $("#codexis").val().trim().length > 0) {
      getEquipo();
    }
  });

  $('#download-grid').on('click', function() {
    ObjGrid.api.exportDataAsCsv({
      fileName: `Equipos.csv`, // Nombre del archivo
      columnSeparator: ','           // Separador de columnas
    });
  });

  $("#btn_add").off('click').on('click', function () { addItemToArr(); });
  $("#btn_remove").off('click').on('click', function () { removeItemToArr(); });
  $("#crud_bt_search").hide();
  $("#upload-file").hide();
}

function initPermi() {
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
  $("#crud_bt_add").prop("disabled",  !Funciones.ThunderPermi("usrinsert"));
  $("#crud_bt_update").prop("disabled",  !Funciones.ThunderPermi("usrupdate"));
  $("#crud_bt_delete").prop("disabled", true);
  $("#btn_add, #btn_remove").prop("disabled", true);
}

function initCamp() {
  Componentes.marcas(uu, cc, "div-marcas");
  Componentes.clasificaciones(uu, cc, "div-clasificaciones");
  Funciones.FormatDate(["f_ini"]);
  setTimeout(() => {
    $("#codigo, #codexis, #serie, #select-marca, #select-clasificacion, #select-status, #f_ini, #modelo").prop("disabled", true);
  }, 250);
}

function crudAdd() {
  $("#crud_bt_add, #crud_bt_search, #crud_bt_update, #codexis").prop("disabled", true);
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", false);
  $("#codigo, #serie, #select-marca, #select-clasificacion, #select-status, #f_ini, #modelo").prop("disabled", false);
  $("#btn_add, #btn_remove").prop("disabled", false);
  $("#grid").html("");
  arrItems = [];
  action = "INSERT";
}

function crudSearch() {
  $("#codexis").prop("disabled", false);
}

function getEquipo() {
  let args = $("#codexis").val().trim();
  let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Equipos.EquiposService.crudSearch", [args]);
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
        $("#f_ini").val(datax[0].f_regis);
        $("#select-status").val(datax[0].status).trigger("change");
        $("#modelo").val(datax[0].modelo);
      }
    });
}

function crudCancel() {
  Swal.fire(
    Funciones.getConfigConfirmAlert("¿Realmente deseas cancelar los cambios?", "question")
  ).then(result => {
    if(result.value) {
      initPermi();
      $("#codigo, #serie").prop("disabled", true);
      $("#select-marca, #select-clasificacion, #select-status, #f_ini, #modelo, #codexis").prop("disabled", true);
    }
  })
}

function crudUpdate() {
  $("#codigo, #serie, #select-marca, #select-clasificacion, #select-status, #f_ini, #modelo, #codexis").prop("disabled", false);
  $("#crud_bt_save, #crud_bt_cancel, #crud_bt_delete").prop("disabled", false);
  $("#crud_bt_add, #crud_bt_update, #crud_bt_search").prop("disabled", true);
  $("#crud_bt_delete").prop("disabled",  !Funciones.ThunderPermi("usrdelete"));

  $("#grid").html("");
  action = "UPDATE";
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
            let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Equipos.EquiposService.crudSave", [arrItems]);
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
                    text: "Equipo(s) creado con exito.",
                  })
                }
                initPermi();
                $("#codigo, #serie, #modelo").prop("disabled", true);
                $("#select-marca, #select-clasificacion, #select-status, #f_ini").prop("disabled", true);
                action = "";
              });
          }
      });
    }
  } else if (action === "UPDATE") {
    let codigoExist = $("#codexis").val().trim();
    let serie = $("#serie").val().trim();
    let marca = $("#select-marca option:selected").text().trim();
    let cve_marca = $("#select-marca").val().trim();
    let clasificacion = $("#select-clasificacion option:selected").text().trim();
    let cve_clasificacion = $("#select-clasificacion").val().trim();
    let f_ini = $("#f_ini").val().trim();
    let status = $("#select-status").val().trim();
    let fecha = f_ini.split("-");
    let modelo = $("#modelo").val().trim();
    let codigoGen = $("#select-marca option:selected").text().split("-")[1].slice(0,2) 
    + $("#select-clasificacion option:selected").text().split("-")[1].slice(0,2)
    + $("#serie").val().trim().slice(0,5) + fecha[2] + fecha[1] + fecha[0].slice(2,4) 
    + $("#codigo").val().trim();
    //let codigoGen = $("#codigo").val().trim();
    if (codigoExist.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Campos vacios",
        text: "Debes seleccionar un equipo",
      });
    } else {
      Swal.fire(
        Funciones.getConfigConfirmAlert("¿Realmente deseas actualizar los cambios?", "question")
      ).then((result) => {
          if (result.value) {
            
            let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Equipos.EquiposService.crudUpdate", [codigoExist, serie, codigoGen, cve_marca, cve_clasificacion, f_ini, status, modelo]);
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
                    title: "Exito al actualizar: " + codigoGen,
                    text: data.result,
                  })
                }
                initPermi();
                $("#codigo, #serie, #modelo").prop("disabled", true);
                $("#select-marca, #select-clasificacion, #select-status, #f_ini").prop("disabled", true);
                action = "";
              });
          }
      });
    }
  }
}

function crudDelete() {
  let codigo = $("#codigo").val().trim();
  if (codigo === "") {
    Swal.fire({
      icon: "warning",
      title: "Campos vacios",
      text: "Debes seleccionar un equipo",
    });
  } else {
    Swal.fire(
      Funciones.getConfigConfirmAlert("¿Realmente deseas eliminar el equipo?", "question")
    ).then((result) => {
        if (result.value) {
          let bridge = new Bridge(uu, cc, "System.Inventarios.Catalogos.Equipos.EquiposService.crudDelete", [codigo]);
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
              $("#codigo, #serie, #modelo").prop("disabled", true);
              $("#select-marca, #select-clasificacion, #select-status, #f_ini").prop("disabled", true);
              action = "";
            });
        }
    });
  }
}

function addItemToArr() {
  let codigoInv = $("#codigo").val().trim();
  let serie = $("#serie").val().trim();
  let marca = $("#select-marca option:selected").text().trim();
  let cve_marca = $("#select-marca").val().trim();
  let clasificacion = $("#select-clasificacion option:selected").text().trim();
  let cve_clasificacion = $("#select-clasificacion").val().trim();
  let f_ini = $("#f_ini").val().trim();
  let fecha = f_ini.split("-");
  let status = $("#select-status").val().trim();
  let modelo = $("#modelo").val().trim();
  let codigoGen = $("#select-marca option:selected").text().split("-")[1].slice(0,2) 
  + $("#select-clasificacion option:selected").text().split("-")[1].slice(0,2)
  + $("#serie").val().trim().slice(0,5) + fecha[2] + fecha[1] + fecha[0].slice(2,4) 
  + $("#codigo").val().trim();
  
  if (codigoInv.length > 0 && serie.length > 0 && cve_marca.length > 0 && cve_clasificacion.length > 0 && f_ini.length > 0 && status.length > 0) {
    let codigoExis = 0;
    arrItems.forEach((item) => { if (item.codigo.toUpperCase() == codigoInv.toUpperCase()) codigoExis++; });

    if (codigoExis > 0) {
     Swal.fire({
        icon: "warning",
        title: "Codigo duplicado",
        text: "El codigo ya existe en la lista",
      });
    } else {
      arrItems.push({
        "id": Date.now(),
        "codgen": codigoGen,
        "codigo": codigoInv,
        "serie": serie,
        "marca": marca,
        "cve_marca": cve_marca,
        "clasificacion": clasificacion,
        "cve_clasificacion": cve_clasificacion,
        "fini": f_ini,
        "status": status,
        "modelo": modelo
      });

      arrItems.push(estructura);
      gridTotal(arrItems, "#grid", false, false, false );
    } 

  } else {
      Swal.fire({
          icon: "warning",
          title: "Campos vacios",
          text: "Debes llenar todos los campos",
      });
  }
}

function removeItemToArr() {
  arrItems = arrItems.filter((item) => item.id !== cve_item_remove);
  arrItems.push(estructura);
  gridTotal(arrItems, "#grid", false, false, false );
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
  ObjGrid = gridOptions;
}


// Subir con Archivo XSLX o CSV

function fileUp() {
  Funciones.insertarModal("modalExcel", "Subir Excel")
  $("#modalExcel .contenido_modal").html(`
      <div class="sec-info m-tb-05">
          <li class="list-style-none">- Realiza el ingreso de los equipos especificados</li>
          <li class="list-style-none">- Formato de columnas del archivo a subir : | Cod. Inv | Num. Serie | Modelo | Cve. Marca | Cve. Tipo | Fecha (AnoMesDias -> 20241201) | Estatus (A / N) |</li>
      </div>
      <div class="d-flex g-gap-05 align-center flex-wrap">
          <input class="input-file" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" id="fileArts"/>  
          <div class="btn_consultar btns-file">
              <button class="bordes_redondeados shadow" id="btnUpFile">Subir archivo</button>
          </div>
          <div class="sec-btn-aplicar"></div>
      </div>
      <div id="gridItemsExcel" class="ag-theme-balham"></div>
  `)

  $("#btnUpFile").off().click(() => {
      let file = _id("fileArts").files
      if (file.length > 0) {
          $("#gridItemsExcel").html("").hide().before(loader)
          let url = URL.createObjectURL(file[0])
          makeRequest('GET', url,
              (data) => {
                  $(".spinner").remove()
                  let workbook = convertDataToWorkbook(data)
                  populateGrid(workbook)
                  $("#gridItemsExcel").show()
              },
              (error) => msg("info", "Error al cargar archivo")
          )
      }
  })
}

function makeRequest(method, url, success, error) {
  let httpRequest = new XMLHttpRequest()
  httpRequest.open("GET", url, true)
  httpRequest.responseType = "arraybuffer"
  httpRequest.open(method, url)
  httpRequest.onload = () => success(httpRequest.response)
  httpRequest.onerror = () => error(httpRequest.response)
  httpRequest.send()
}

function convertDataToWorkbook(dataFile) {
  let data = new Uint8Array(dataFile),
      arr = []

  for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i])

  let bstr = arr.join("")
  return XLSX.read(bstr, {type: "binary"})
}

function populateGrid(workbook) {
  let firstSheetName = workbook.SheetNames[0],
      worksheet = workbook.Sheets[firstSheetName],
      rowData = [],
      rowIndex = 1,
      columns = {
          'A': 'cod_inv',
          'B': 'serie',
          'C': 'modelo',
          'D': 'cve_marca',
          'E': 'cve_clasif',
          'F': 'f_regis',
          'G': 'status'
      }

  try {
      while (worksheet['A' + rowIndex]) {
          let row = {}
          Object.keys(columns).forEach((column) => {
              if (typeof worksheet[column + rowIndex] !== "undefined") {
                  row[columns[column]] = worksheet[column + rowIndex].w
              } else {
                  throw new Exception("Error")
              }
          })
          rowData.push(row)
          rowIndex++
      }
  } catch (e) {
      msg("info", "Las columnas del archivo no tienen el orden correcto")
      $("#gridItemsExcel").html("")
  }

  if (rowData.length > 0) {
      rowData.push([
          {headerName: "Cod. Inv", field: "cod_inv", width: 81},
          {headerName: "Serie", field: "serie", width: 81},
          {headerName: "Modelo", field: "modelo", width: 81},
          {headerName: "Cve. Marca", field: "cve_marca", width: 81},
          {headerName: "Cve. Tipo", field: "cve_clasif", width: 81},
          {headerName: "Fecha", field: "f_regis", width: 81},
          {headerName: "Estatus", field: "status", width: 81}
      ])
      //console.log(rowData);
      gridTotal(rowData, "#gridItemsExcel", false, false, false)

      $(".sec-btn-aplicar").html(`<div class="btn_consultar">
          <button class="bordes_redondeados shadow" id="btnAplicaArtic">Añadior artículos</button>
      </div>`)

      const applyCantid = () => {
          rowData.forEach(x => {
              let node = _this.goArts.api.getRowNode(x.cve_art)
              if (typeof node !== "undefined") {
                  if (node.data.clasif !== "X") {
                      node.data.isFromExcel = true
                      node.data[x.cve_alm] = x.cantidad
                      node.gridApi.startEditingCell({
                          rowIndex: node.rowIndex,
                          colKey: x.cve_alm,
                          keyPress: null,
                          charPress: x.cantidad
                      })
                      node.gridApi.stopEditing()
                      $("#cve_" + x.cve_art).css("border-right", ".3rem solid red")
                  }
              }

          })
          $("#modalExcel").remove()
      }

      $("#btnAplicaArtic").off().click(() => {
          /*swal(getConfigSwalAlert('Actualmete tiene activada la configuración Tarimas Completas, ¿Desea mantener la configuración?', 'warning')).then((result) => {
              if (typeof result.value === "undefined") $("#cbxTC").prop("checked", false)
              applyCantid()
          })*/
          getXArch(rowData);
      })
  }
}