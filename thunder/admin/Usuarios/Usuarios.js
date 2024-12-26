
/*===============================================================================
Autor: Juan Maturana
Fecha de Creación: 10/04/2023
ruta: thundersc/thunder/Admin/Usuarios/Usuarios.js
===============================================================================*/
//let tableOne = "";
//tableOne = new CustomDataTable("container-tablaOne");
let numPermi = 0; var uu = "admin"; var cc = "thunder"; action = "";
let arrModulos = []; action = "";
init();

function init() {
  initPermi();
  initCamp();

  $("#crud_bt_add").off('click').on('click', function () { crudAdd(); });
  $("#crud_bt_save").off('click').on('click', function () { crudSave(); });
  $("#crud_bt_cancel").off('click').on('click', function () { crudCancel(); });
  $("#crud_bt_update").off('click').on('click', function () { crudUpdate(); });
  //$(".bt-add-component").off('click').on('click', function () { addCampoPermiso(); });
  getModulos();

  $("#cve_modulo").on("change keyup", function (e) {
    if(e.keyCode === 13 &&  $("#cve_modulo").val().trim().length > 0) {
      getPermisosxModulo();
    }
  });

  $("#clave").on("change keyup", function (e) {
    if(e.keyCode === 13) {
      getUsuarioxClave();
    }
  });

  $("#crud_bt_search").hide();
}

function initPermi() {
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
  $("#crud_bt_add").prop("disabled", false);
}

function initCamp() {
  $("#usuario, #password, #descri, #cve_modulo").prop("disabled", true);
  Componentes.empresa(uu, cc, "div-empresa");
}

function crudAdd() {
  $("#crud_bt_add").prop("disabled", true);
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", false);
  $("#usuario, #password, #descri, #cve_modulo, #select-empresa").prop("disabled", false);
  action = "INSERT";
}

function crudUpdate() {
  $("#crud_bt_update").prop("disabled", true);
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", false);
  $("#usuario, #password, #descri, #cve_modulo, #select-empresa").prop("disabled", false);
  action = "UPDATE";
}

function crudCancel() {
  Swal.fire(
    Funciones.getConfigConfirmAlert("¿Realmente deseas cancelar los cambios?", "question")
  ).then(result => {
    if(result.value) {
      initPermi();
      $("#usuario, #password, #descri, #cve_modulo, #select-empresa").prop("disabled", true);
      $("#usuario, #password, #descri, #cve_modulo").val("");
      $("#list-permisos").html("");
      arrModulos = [];
      action = "";
    }
  })
}

function crudSave(user = '', company = '') {
  if (action === "INSERT") {
    if ($("#usuario").val().trim().length === 0 || $("#password").val().trim().length === 0 || $("#descri").val().trim().length === 0) {
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
            let uu = user;
            let cc = company;
            let usuario = $("#usuario").val().trim();
            let descri = $("#descri").val().trim();
            let password = $("#password").val().trim();
            let bridge = new Bridge(uu, cc, "Admin.Usuarios.UsuariosService.saveUsuario", [usuario, descri, password, getPermisosSeleccionados()]);
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
                    title: "Clave generada: " + data.result['cve'],
                    text: "Usuario creado con exito",
                  })
                }
                $("#crud_bt_add").prop("disabled", false);
                $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
                action = "";
                arrModulos = [];
              });
          }
      });
    }
  } else if ("UPDATE") { 
    if ($("#usuario").val().trim().length === 0 || $("#descri").val().trim().length === 0) {
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
            let uu = user;
            let cc = company;
            let cve_usuario = $("#clave").val().trim();
            let usuario = $("#usuario").val().trim();
            let descri = $("#descri").val().trim();
            let password = $("#password").val().trim();
            let bridge = new Bridge(uu, cc, "Admin.Usuarios.UsuariosService.updateUsuario", [cve_usuario, usuario, descri, password, getPermisosSeleccionados()]);
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
                    title: "Usuario actualizado",
                    text: "Usuario actualizado con exito",
                  })
                }
                $("#crud_bt_add").prop("disabled", false);
                $("#crud_bt_save, #crud_bt_cancel").prop("disabled", true);
                action = "";
                arrModulos = [];
              });
          }
      });
    }
  }
}

function addCampoPermiso() {
  permisoFinal = numPermi;
  numPermi++;
  $(`#permiso${permisoFinal}`).after(`<input type="text" maxlength="15" class="form_input bordes_redondeados input-area mg-top-6" name="ruta" id="permiso${numPermi}" />`)
}

function getPermisosxModulo() {
  let cve_modulo = $("#cve_modulo").val().trim();
  
  if (arrModulos.includes(cve_modulo+'-'+$("#select-empresa").val().trim())) {
    Swal.fire({
      icon: "warning",
      title: "Modulo ya cargado",
      text: "No puedes cargar el mismo modulo dos veces",
    })
  } else {
    let bridge = new Bridge(uu, cc, "Admin.Usuarios.UsuariosService.getPermisosxModulo", [cve_modulo]);
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
        arrModulos.push(cve_modulo+'-'+$("#select-empresa").val().trim());
        setBlockPermisos(data.result);
      }
    });
  }
}

function setInfoUsuario(data) {
  $("#usuario").val(data['username']);
  $("#descri").val(data['descri']);
}

function setBlockPermisos(data) {
  let permisos = "";
  let empresa = $("#select-empresa").val().trim();

  for(let i = 0; i < data.length; i++) {
    permisoData = data[i];
    permisos += `
    <li>
      ${permisoData['permiso']}
      <input class="ms box-permiso" type="checkbox" id="${permisoData['cve_modu']+'-'+permisoData['cve_permi']+'-'+permisoData['permiso']}" 
      data-permiso="${permisoData['cve_modu']+'-'+permisoData['cve_permi']+'-'+empresa+'-'+permisoData['permiso']}" value="${permisoData['permiso']}" />
    </li>
    `;
  }

  let block = `
  <li class="block-permiso">
      <p class="label-c-g">${data[0]['descri']} - ${empresa}</p>    
      <ul class="block-singpermiso">
        ${permisos}
      </ul>  
  </li>
  `;

  $("#list-permisos").append(
    `
    ${block}
    `
  );
}

function getPermisosSeleccionados() {
  let permisos = [];
  $(".box-permiso").each(function() {
    if($(this).prop("checked")) {
      permisos.push($(this).attr("data-permiso"));
    }
  });

  return permisos;
}

function getUsuarioxClave() {
  let clave = $("#clave").val().trim();
  let bridge = new Bridge(uu, cc, "Admin.Usuarios.UsuariosService.getUsuarioxClave", [clave]);
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
      arrModulos = [];
      $("#list-permisos").html("");
      setInfoUsuario(data.result[0]);
      setBlockPermisosxUsuaro(data.result[1]);
    }
  });
}

function getModulos(user = '', company = '') {
  let uu = user;
  let cc = company;
  let bridge = new Bridge(uu, cc, "Admin.Usuarios.UsuariosService.getModulos");
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
      gridTotal(data.result, "#gridModulos", false, false);
    }
  });
}


function setBlockPermisosxUsuaro(data) {

  let keys = Object.keys(data);
  for(let i = 0; i < keys.length; i++) {
    let element = data[keys[i]]; let permisos = "";
    let empresa = element[0]['cve_empre'];
    let modulo = element[0]['modu'];

    for(let j = 0; j < element.length; j++) {
      permisoData = element[j];
      let checked = permisoData['checked'] == 1 ? "checked" : "";
      permisos += `
      <li>
        ${permisoData['permi']}
        <input ${checked} class="ms box-permiso" type="checkbox" id="${permisoData['cve_modu']+'-'+permisoData['cve_permi']+'-'+permisoData['permi']}" 
        data-permiso="${permisoData['cve_modu']+'-'+permisoData['cve_permi']+'-'+empresa+'-'+permisoData['permi']}" value="${permisoData['permi']}" />
      </li>
      `;
    }

    let block = `
    <li class="block-permiso">
        <p class="label-c-g">${modulo} - ${empresa}</p>    
        <ul class="block-singpermiso">
          ${permisos}
        </ul>  
    </li>
    `;
    console.log(block);
    $("#list-permisos").append(
      `
      ${block}
      `
    );

    arrModulos.push(element[0]['cve_modu'].trim()+'-'+empresa.trim());
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
}