let tableOne = '';
let tableTwo = '';
let tableThree = '';
let tableFour = '';
let tableFive = '';
document.addEventListener("DOMContentLoaded" , async function () {
  tableOne = new CustomDataTable("container-tablaOne");
  tableTwo = new CustomDataTable("container-tablaTwo");
  tableThree = new CustomDataTable("container-tablaThree");
  tableFour = new CustomDataTable("container-tablaFour");
  tableFive = new CustomDataTable("container-tablaFive");

  await setComboUbicacion();
  await setComboComponente();
  await setComboClasif();
  await setComboEquipoMaq();
  await setComboSubEquipoMaq();
  await init();
  
  $("#btn_Add").on("click", async function () {
    if ($("#comboFormato").val() === "0") {
      await setEquipo("0");
      await showTable("equipo");
    } else if ($("#comboFormato").val() === "1") {
      await setEquipo("1");
      await showTable("subequipo");
    } else if ($("#comboFormato").val() === "2") {
      await setComponente();
      await showTable("componente");
    } else if ($("#comboFormato").val() === "3") {
      await setClasif();
      await showTable("clasificacion");
    }
  });

  $("#btn_Relacion").on("click", async function () {
    await addRelacion();
    await showTable("ubicacion");
  });

});

async function init() {
  $("#comboOperacion").select2({
    minimumResultsForSearch: Infinity
  });

  $("#comboFormato").select2({
    minimumResultsForSearch: Infinity
  });

  $("#comboComponentes").select2({
    minimumResultsForSearch: Infinity,
    multiple: "multiple"
  });

  $("#comboUbicacion").select2();
  $("#comboEquipo").select2();
  $("#comboSubEquipo").select2();
  $("#comboClasif").select2();
  $("#comboComponentes").select2();

  
  $("#divEquipo").hide();
  $("#divSubEquipo").hide();
  $("#btn_Relacion").hide();
  $("#comboFormato").on("change", function () {
    if ($("#comboFormato").val() === "2" || $("#comboFormato").val() === "3") {
/*       $("#btn_Add").show();
      $("#btn_Relacion").hide();
      $("#divTipo").show();
      $("#divZona").hide();
      $("#divArea").hide();
      $("#divNombre").show();
 */
      $("#divNumSerie").hide();
      $("#divClasif").hide();
      $("#divUbicacion").hide();
      $("#divComponentes").hide();
    } else {
      $("#divNumSerie").show();
      $("#divClasif").show();
      $("#divUbicacion").show();
      $("#divComponentes").show();
    }
  });

  $("#comboOperacion").on("change", function () {
    if ($("#comboOperacion").val() === "0") {
      $("#divNumSerie").show();
      $("#divClasif").show();
      $("#divUbicacion").show();
      $("#divComponentes").show();
      $("#divFormato").show();
      $("#btn_Add").show();
      $("#divNombre").show();
      $("#container-componente").show();
      $("#container-clasif").show();
      $("#container-relacion").hide();
      $("#divEquipo").hide();
      $("#divSubEquipo").hide();
      $("#btn_Relacion").hide();
    } else if ($("#comboOperacion").val() === "1") {
      $("#divNumSerie").hide();
      $("#divClasif").hide();
      $("#divUbicacion").hide();
      $("#divComponentes").hide();
      $("#divFormato").hide();
      $("#btn_Add").hide();
      $("#divNombre").hide();
      $("#container-componente").hide();
      $("#container-clasif").hide();
      $("#container-relacion").show();
      $("#divEquipo").show();
      $("#divSubEquipo").show();
      $("#btn_Relacion").show();
    }
  });

  await showTable("equipo");
  await showTable("subequipo");
  await showTable("componente");
  await showTable("clasificacion");
  await showTable("relacion");

}

async function setEquipo(formato) {
  let componentes = [];
  $("#comboComponentes").select2('data').forEach(element => {
    componentes.push(element.text);
  });

  const stringComponentes = componentes.join(',');

  const dataF = new FormData();

  dataF.append("variablekey", "setEquipo");
  dataF.append("nombre", $("#nombre").val().trim());
  dataF.append("numSerie", $("#numSerie").val().trim());
  dataF.append("clasif", $("#comboClasif").select2('data')[0].text);
  dataF.append("ubicacion", $("#comboUbicacion").select2('data')[0].text);
  dataF.append("componentes", stringComponentes);
  formato === "0" ? dataF.append("formato", "Equipo") : dataF.append("formato", "SubEquipo");

  const url = "/thundercloud/system/catalogo/maquina/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
}

async function setComponente() {
  const dataF = new FormData();

  dataF.append("variablekey", "setComponente");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "/thundercloud/system/catalogo/maquina/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
}

async function setClasif() {
  const dataF = new FormData();

  dataF.append("variablekey", "setClasif");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "/thundercloud/system/catalogo/maquina/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
}

async function addRelacion() {
  const equipo = $("#comboEquipo").select2('data')[0].text;
  const subequipo = $("#comboSubEquipo").select2('data')[0].text;

  const dataF = new FormData();

  dataF.append("variablekey", "addRelacion");
  dataF.append("equipo", equipo);
  dataF.append("subequipo", subequipo);

  console.log(equipo);
  console.log(subequipo);

  const url = "/thundercloud/system/catalogo/maquina/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  
  tableOne.initDataTable(data);
}

async function showTable (catalogo) {
  const dataF = new FormData();

  dataF.append("variablekey", "showTable");
  dataF.append("catalogo", catalogo);

  const url = "/thundercloud/system/catalogo/maquina/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);

  console.log(data);

  if (data === null || data === undefined) {data = [{"Datos": "Sin datos"}]}

  switch (catalogo) {
    case "equipo":
      tableOne.initDataTable(data);
      break;
    case "subequipo":
      tableTwo.initDataTable(data);
      break;
    case "componente":
      tableThree.initDataTable(data);
      break;
    case "clasificacion":
      tableFour.initDataTable(data);
      break;
    case "relacion":
      tableFive.initDataTable(data);
      break;
  }
}