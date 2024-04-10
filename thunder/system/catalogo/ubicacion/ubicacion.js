let tableOne = '';
let tableTwo = '';
let tableThree = '';
document.addEventListener("DOMContentLoaded" , async function () {
  tableOne = new CustomDataTable("container-tablaOne");
  tableTwo = new CustomDataTable("container-tablaTwo");
  tableThree = new CustomDataTable("container-tablaThree");

  await setComboZona();
  await setComboArea();
  await init();
  
  $("#btn_ZA").on("click", async function () {
    if ($("#comboFormato").val() === "0") {
      await setZona();
      await showTable("zona");
      await setComboZona();
    } else if ($("#comboFormato").val() === "1") {
      await setArea();
      await showTable("area");
      await setComboArea();
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

  $("#comboZona").select2();
  $("#comboArea").select2();
  
  $("#divZona").hide();
  $("#divArea").hide();
  $("#btn_Relacion").hide();
  $("#comboOperacion").on("change", function () {
    if ($("#comboOperacion").val() === "0") {
      $("#btn_ZA").show();
      $("#btn_Relacion").hide();
      $("#divTipo").show();
      $("#divZona").hide();
      $("#divArea").hide();
      $("#divNombre").show();
    } else if ($("#comboOperacion").val() === "1") {
      $("#btn_ZA").hide();
      $("#btn_Relacion").show();
      $("#divTipo").hide();
      $("#divZona").show();
      $("#divArea").show();
      $("#divNombre").hide(); 
    }
  });

  await showTable("zona");
  await showTable("area");
  await showTable("ubicacion");

}

async function setZona() {
  const dataF = new FormData();

  dataF.append("variablekey", "addZona");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "../../../../thundercloud/system/catalogo/ubicacion/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  
  tableThree.initDataTable(data);
}

async function setArea () {
  const dataF = new FormData();

  dataF.append("variablekey", "addArea");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "../../../../thundercloud/system/catalogo/ubicacion/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  
  tableTwo.initDataTable(data);
}

async function addRelacion() {
  const zona = $("#comboZona").select2('data')[0].text;
  const area = $("#comboArea").select2('data')[0].text;

  const dataF = new FormData();

  dataF.append("variablekey", "addRelacion");
  dataF.append("zona", zona);
  dataF.append("area", area);

  console.log(zona);
  console.log(area);

  const url = "../../../../thundercloud/system/catalogo/ubicacion/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  
  tableOne.initDataTable(data);
}

async function showTable (catalogo) {
  const dataF = new FormData();

  dataF.append("variablekey", "showTable");
  dataF.append("catalogo", catalogo);

  const url = "../../../../thundercloud/system/catalogo/ubicacion/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);

  if (data === null || data === undefined) {data = [{"Datos": "Sin datos"}]}

  console.log(data);

  switch (catalogo) {
    case "zona":
      tableThree.initDataTable(data);
      break;
    case "area":
      tableTwo.initDataTable(data);
      break;
    case "ubicacion":
      tableOne.initDataTable(data);
      break;
  }
}