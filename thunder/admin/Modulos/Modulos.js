
/*===============================================================================
Autor: Juan Maturana
Fecha de Creación: 10/04/2023
ruta: thundersc/thunder/Admin/Modulos/Modulos.js
===============================================================================*/
//let tableOne = "";
//tableOne = new CustomDataTable("container-tablaOne");
let numPermi = 4;
init();

function init() {
  initPermi();
  initCamp();

  $("#crud_bt_add").off('click').on('click', function () { crudAdd(); });
  $("#crud_bt_save").off('click').on('click', function () { crudSave(); });
  $("#crud_bt_cancel").off('click').on('click', function () { crudCancel(); });
  $(".bt-add-component").off('click').on('click', function () { addCampoPermiso(); });

}

function initPermi() {
  $("#crud_bt_update, #crud_bt_save, #crud_bt_cancel").prop("disabled", true);
  $("#crud_bt_add").prop("disabled", false);
}

function initCamp() {
  $("#nombre, #ruta, #menu, #permiso1, #permiso2, #permiso3, #permiso4").prop("disabled", true);
}

function crudAdd() {
  $("#crud_bt_add").prop("disabled", true);
  $("#crud_bt_save, #crud_bt_cancel").prop("disabled", false);
  $("#nombre, #ruta, #menu").prop("disabled", false);
  for (let i = 1; i <= numPermi; i++) {
    $(`#permiso${i}`).prop("disabled", false);
  }
}

function crudCancel() {
  Swal.fire(
    Funciones.getConfigConfirmAlert("¿Realmente deseas cancelar los cambios?", "question")
  ).then(result => {
    if(result.value) {
      initPermi();
      $("#nombre, #ruta, #menu").prop("disabled", true);
      $("#nombre, #ruta, #menu").val("");
      for (let i = 1; i <= numPermi; i++) {
        $(`#permiso${i}`).prop("disabled", true);
        $(`#permiso${i}`).val("");
      }
    }
  })
}

function crudSave(user = '', company = '') {
  Swal.fire(
    Funciones.getConfigConfirmAlert("¿Realmente deseas guardar los cambios?", "question")
  ).then((result) => {
      if (result.value) {
        let uu = user;
        let cc = company;
        let nombre = $("#nombre").val().trim();
        let ruta = $("#ruta").val().trim();
        let menu = $("#menu").val().trim();
        let bridge = new Bridge(uu, cc, "Admin.Modulos.ModulosService.saveModu", [nombre, ruta, menu, getPermisos()]);
        let response = bridge.databriged();
      
        response
          .then(response => response.json())
          .then((data) => {
            if(data.event > 0) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Modulo no guardado',
              })
            } else {
              Swal.fire({
                icon: "success",
                title: "Exito",
                text: 'Modulo guardado con exito',
              })
            }
          });
      }
  });
}

function getPermisos() {
  let permisos = [];
  for (let i = 1; i <= numPermi; i++) {
    if($("#permiso" + i).val().trim().length > 0) permisos.push($("#permiso" + i).val().trim().replace(" ", ""));
  }
  return permisos;
}

function addCampoPermiso() {
  permisoFinal = numPermi;
  numPermi++;
  $(`#permiso${permisoFinal}`).after(`<input type="text" maxlength="15" class="form_input bordes_redondeados input-area mg-top-6" name="ruta" id="permiso${numPermi}" />`)
}