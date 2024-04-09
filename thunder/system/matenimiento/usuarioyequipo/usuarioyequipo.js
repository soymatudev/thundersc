let tableOne = '';
let tableTwo = '';
document.addEventListener("DOMContentLoaded" , async function () {
  tableOne = new CustomDataTable("container-tablaOne");
  tableTwo = new CustomDataTable("container-tablaTwo");

  await setComboEquiposTrabajo();
  await init();
  
  $("#btn_Add").on("click", async function () {
    if ($("#comboFormato").val() === "0") {
      await setUsuario();
      await showTable("usuarios");
      $("#nombre").val("");
      $("#cve").val("");
      $("#area").val("");
      $("#password").val("");
      $("#telefono").val("");
    } else if ($("#comboFormato").val() === "1") {
      await setEquipoTrabajo();
      await showTable("equipos");
      $("#nombre").val("");
      $("#cve").val("");
      $("#area").val("");
      $("#password").val("");
      $("#telefono").val("");
      await setComboEquiposTrabajo();
    }
  });

});

async function init() {
  $("#comboOperacion").select2({
    minimumResultsForSearch: Infinity
  });

  $("#comboFormato").select2({
    minimumResultsForSearch: Infinity
  });

  $("#comboEquiposT").select2({
    minimumResultsForSearch: Infinity,
    multiple: "multiple"
  });
  
  $("#divCVE").hide();
  $("#divArea").hide();
  $("#btn_Relacion").hide();
  $("#comboFormato").on("change", function () {
    if ($("#comboFormato").val() === "0") {
      $("#divCVE").hide();
      $("#divArea").hide();
      $("#divTelefono").show();
      $("#divEquiTrabajo").show();
      $("#divPassword").show();
      $("#divFile").show();
    } else if ($("#comboFormato").val() === "1") {
      $("#divCVE").show();
      $("#divArea").show();
      $("#divTelefono").hide();
      $("#divEquiTrabajo").hide();
      $("#divPassword").hide();
      $("#divFile").hide();
    }
  });

  await showTable("usuarios");
  await showTable("equipos");

}

async function setUsuario() {
  let equiposTrabajo = [];
  $("#comboEquiposT").select2('data').forEach(element => {
    equiposTrabajo.push(element.text);
  });

  const stringEquipos = equiposTrabajo.join(',');

  const dataF = new FormData();

  if ($("#file-2")[0].files[0]) {

  dataF.append("variablekey", "setUsuario");
  dataF.append("nombre", $("#nombre").val().trim());
  dataF.append("telefono", $("#telefono").val().trim());
  dataF.append("password", $("#password").val().trim());
  dataF.append("equipos", stringEquipos);
  dataF.append("file", $("#file-2")[0].files[0]);

  console.log($("#file-2")[0].files[0]);

  const url = "../../../../thundercloud/system/matenimiento/usuarioyequipo/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  } else {
    alert("Falta archivo");
  }
}

async function setEquipoTrabajo() {
  const dataF = new FormData();

  dataF.append("variablekey", "setEquipoTrabajo");
  dataF.append("nombre", $("#nombre").val().trim());
  dataF.append("cve", $("#cve").val().trim());
  dataF.append("area", $("#area").val().trim());

  const url = "../../../../thundercloud/system/matenimiento/usuarioyequipo/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
}

async function showTable (catalogo) {
  const dataF = new FormData();

  dataF.append("variablekey", "showTable");
  dataF.append("catalogo", catalogo);

  const url = "../../../../thundercloud/system/matenimiento/usuarioyequipo/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);

  console.log(data);

  if (data === null || data === undefined) {data = [{"Datos": "Sin datos"}]}

  switch (catalogo) {
    case "usuarios":
      tableOne.initDataTable(data);
      break;
    case "equipos":
      tableTwo.initDataTable(data);
      break;
  }
}