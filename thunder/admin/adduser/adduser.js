
/*===============================================================================
Autor: Juan Maturana
Fecha de Creación: 10/04/2023
ruta: thundersc/thunder/admin/adduser/adduser.js
===============================================================================*/
let tableOne = "";
//let tableTwo = "";
document.addEventListener("DOMContentLoaded", async function () {
  tableOne = new CustomDataTable("container-tablaOne");
  //tableTwo = new CustomDataTable("container-tablaTwo");

  await init();

  $("#btn_Add").on("click", async function () {
    if ($("#comboOperacion").val() === "0") {
      await setUsuario();
      await showTable("usuarios");
    } else if ($("#comboOperacion").val() === "1") {
      // Aquiva ir la logica cuando actulicemos los usuarios - este comentario si lo puse yo
    }
  });
});

async function init() {
  $("#comboOperacion").select2({
    minimumResultsForSearch: Infinity,
  });

  $("#btn_Update").hide();
  $("#comboOperacion").on("change", function () {
    if ($("#comboOperacion").val() === "0") {
      $("#btn_Add").show();
      $("#btn_Update").hide();
    } else if ($("#comboOperacion").val() === "1") {
      $("#btn_Update").show();
      $("#btn_Add").hide();
    }
  });

  await showTable("usuarios");
  //await showTable("equipos");
}

async function setUsuario() {
  const permisos = await getPermisos();

  const dataF = new FormData();

  dataF.append("variablekey", "setUsuario");
  dataF.append("nombre", $("#nombre").val().trim());
  dataF.append("password", $("#password").val().trim());
  dataF.append("permisos", permisos);

  const url =
    "../../../thundercloud/admin/user/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Usuario Agregado", "Error al agregar usuario");
}

async function getPermisos() {
  let permisos = [];
  $("input[type=checkbox]:checked").each(function () {
    permisos.push($(this).val());
  });
  return permisos;
}

async function setEquipoTrabajo() {
  const dataF = new FormData();

  dataF.append("variablekey", "setEquipoTrabajo");
  dataF.append("nombre", $("#nombre").val().trim());
  dataF.append("cve", $("#cve").val().trim());
  dataF.append("area", $("#area").val().trim());

  const url =
    "../../../thundercloud/log/user/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
}

async function showTable(catalogo) {
  const dataF = new FormData();

  dataF.append("variablekey", "showTable");
  dataF.append("catalogo", catalogo);

  const url =
    "../../../thundercloud/admin/user/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);

  console.log(data);

  if (data === null || data === undefined) {
    data = [{ Datos: "Sin datos" }];
  }

  switch (catalogo) {
    case "usuarios":
      tableOne.initDataTable(data);
      break;
  }
}
