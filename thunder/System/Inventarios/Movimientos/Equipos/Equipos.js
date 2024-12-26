
/*===============================================================================
Autor: Juan Maturana - soymatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thunder/System/Almacenes/Almacenes.js
===============================================================================*/
let arrEquipos = [], cve_eqsis_remove = "";
let estructura = [
    {"headerName": "Alm", "field": "almac", "width": 80},
    {"headerName": "Cod.Inv", "field": "serie", "width": 100},
    {"headerName": "Serie", "field": "serie", "width": 100},
    {"headerName": "Marca", "field": "marca", "width": 100},
    {"headerName": "Tipo", "field": "clasificacion", "width": 100},
    {"headerName": "Modelo", "field": "modelo", "width": 100},
    {"headerName": "Empleado", "field": "empleado", "width": 100},
    {"headerName": "Departamento", "field": "departamento", "width": 100},
    {"headerName": "F. Movto", "field": "f_movto", "width": 100},
]

init();

function init() {
    initPermi();
    initCamp();

    $("#crud_bt_add").off('click').on('click', function () { crudAdd(); });
    $("#crud_bt_save").off('click').on('click', function () { crudSave(); });
    $("#crud_bt_cancel").off('click').on('click', function () { crudCancel(); });
    $("#crud_bt_search").off('click').on('click', function () { crudSearch(); });
    $("#crud_bt_responsiva").off('click').on('click', function () { getResponsiva(); });

    $("#codinv").on("change keyup", function (e) {
        if(e.keyCode === 13 &&  $("#codinv").val().trim().length > 0) {
            getEquipo();
        }
    });

    /* $(document).on("change keyup", function (e) {
        if(e.keyCode === 32) {
            addEquipoToArr();
        }
    }); */

    $("#btn_add").off('click').on('click', function () { addEquipoToArr(); });
    $("#btn_remove").off('click').on('click', function () { removeEquipoToArr(); });
    $("#crud_bt_search").hide();
}

function gridPrueba() {
    let estructura = [
        {"headerName": "Cve Alm", "field": "clave", "width": 80},
        {"headerName": "Almacen", "field": "almac", "width": 100},
        {"headerName": "serie", "field": "serie", "width": 100},
    ]

    const jsonResponse = [
        {"serie":"SER001","clave":"CLV123","almac":"ALM001"},
        {"serie":"SER002","clave":"CLV124","almac":"ALM002"},
        {"serie":"SER003","clave":"CLV125","almac":"ALM003"}
    ];

    const data = jsonResponse;
    data.push(estructura);
    gridTotal(data, "#grid", false, false, false);
}

function initPermi() {
  $("#crud_bt_update, #crud_bt_save, #crud_bt_cancel").prop("disabled", true);
  //$("#crud_bt_responsiva").prop("disabled", true);
  Funciones.ThunderPermi("usrinsert") ? $("#crud_bt_add").prop("disabled", false) : $("#crud_bt_add").prop("disabled", true);
}

function initCamp() {
  Componentes.almacenes(uu, cc, "div-almacen");
  Componentes.empleados(uu, cc, "div-empleado");
  Componentes.departamentos(uu, cc, "div-departamento");
  Componentes.marcas(uu, cc, "div-marcas");
  Componentes.clasificaciones(uu, cc, "div-clasificaciones");
  Funciones.FormatDate(["f_ini", "f_mov"]);
  setTimeout(() => {
    $("#codigo, #serie, #select-marca, #select-clasificacion, #select-status, #f_ini").prop("disabled", true);
    $("#select-almacen, #select-empleado, #select-departamento, #codinv").prop("disabled", true);
  }, 250);
}

function crudAdd() {
  $("#select-almacen, #select-empleado, #select-departamento, #codinv").prop("disabled", false);
    $("#crud_bt_add").prop("disabled", true);
    $("#crud_bt_save, #crud_bt_cancel").prop("disabled", false);
    $("#grid").html("");
    arrEquipos = [];
}

function crudSearch() {
  searchActive = true;
  $("#codinv").prop("disabled", false);
}

function addEquipoToArr() {
    let cve_alm = $("#select-almacen").val().trim();
    let almacen = $("#select-almacen option:selected").text().trim().split("-")[1];
    let cve_emple = $("#select-empleado").val().trim();
    let empleado = $("#select-empleado option:selected").text().trim().split("-")[1]; ;
    let cve_depar = $("#select-departamento").val().trim();
    let departamento = $("#select-departamento option:selected").text().trim().split("-")[1];
    let f_movto = $("#f_mov").val().trim();
    
    if (cve_alm.length > 0 && cve_emple.length > 0 && cve_depar.length > 0 && f_movto.length > 0 && $("#codinv").val().trim().length > 0) {
        let args = $("#codinv").val().trim();
        let bridge = new Bridge(uu, cc, "System.Inventarios.Movimientos.Equipos.EquiposService.crudSearch", [args]);
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
            arrEquipos.push({
                "id": Date.now(),
                "cve_alm": cve_alm,
                "almac": almacen,
                "codinv": datax[0].cod_inv,
                "serie": datax[0].serie,
                "cve_marca": datax[0].cve_marca,
                "marca": datax[0].marca,
                "cve_clasif": datax[0].cve_clasif,
                "clasificacion": datax[0].tipo,
                "modelo": datax[0].modelo,
                "cve_emple": cve_emple,
                "empleado": empleado,
                "cve_depar": cve_depar,
                "departamento": departamento,
                "f_movto": f_movto
            });
            arrEquipos.push(estructura);
            gridTotal(arrEquipos, "#grid", false, false, false );
        }
        });
    } else {
        Swal.fire({
            icon: "warning",
            title: "Campos vacios",
            text: "Debes llenar todos los campos",
        });
    }
}

function removeEquipoToArr() {
    arrEquipos = arrEquipos.filter((equipo) => equipo.id !== cve_eqsis_remove);
    arrEquipos.push(estructura);
    gridTotal(arrEquipos, "#grid", false, false, false );
}

function getEquipo() {
  let args = $("#codinv").val().trim();
  let bridge = new Bridge(uu, cc, "System.Inventarios.Movimientos.Equipos.EquiposService.crudSearch", [args]);
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
        $("#codigo, #serie").prop("disabled", true);
        $("#select-almacen, #select-empleado, #select-departamento, #codinv, #f_movto").prop("disabled", true);
        $("#grid").html("");
        arrEquipos = [];
    }
  })
}

function crudSave() {
  if (arrEquipos.length === 0) {
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
          
          let bridge = new Bridge(uu, cc, "System.Inventarios.Movimientos.Equipos.EquiposService.crudSave", [arrEquipos]);
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
              $("#crud_bt_add").prop("disabled", false);
              $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
              $("#select-almacen, #select-empleado, #select-departamento, #codinv, #f_movto").prop("disabled", true);
              $("#crud_bt_responsiva").prop("disabled", false);
            });
        }
    });
  }
}

function getResponsiva() {
  try {
    let args = arrEquipos;
    let bridge = new Bridge(uu, cc, "System.Inventarios.Movimientos.Equipos.EquiposService.getResponsiva", [args, "", "", ""]);
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
  
  // Crear un enlace para descargar el archivo o abrirlo en una nueva ventana
  /* const link = document.createElement('a');
  link.href = url;
  link.download = 'documento.pdf'; // Nombre del archivo PDF
  link.click(); */
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
        if (arrEquipos.length > 0) cve_eqsis_remove = selectedRows[0].id;
    }

  new agGrid.Grid(eGridDiv, gridOptions)
  gridOptions.api.setRowData(data)
}