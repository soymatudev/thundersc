let tableOne = '';
let tableTwo = '';
let tableThree = '';
document.addEventListener("DOMContentLoaded" , async function () {
  tableOne = new CustomDataTable("container-tableOne");
  tableTwo = new CustomDataTable("container-tableTwo");
  tableThree = new CustomDataTable("container-tableThree");

  await init();
  
  $("#btn_ZA").on("click", async function () {
    if ($("#comboFormato").val() === "0") {
      await setZona();
      await showTable("zona");
    } else if ($("#comboFormato").val() === "1") {
      await setArea();
      await showTable("area");
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
    } else if ($("#comboOperacion").val() === "1") {
      $("#btn_ZA").hide();
      $("#btn_Relacion").show();
      $("#divTipo").hide();
      $("#divZona").show();
      $("#divArea").show();
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

  const url = "/thundercloud/system/catalogo/ubicacion/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  
  tableThree.initDataTable(data);
}

async function setArea () {
  const dataF = new FormData();

  dataF.append("variablekey", "addArea");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "/thundercloud/system/catalogo/ubicacion/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  
  tableTwo.initDataTable(data);
}

async function addRelacion() {
  const dataF = new FormData();

  dataF.append("variablekey", "addRelacion");
  dataF.append("zona", $("#comboZona").value().trim());
  dataF.append("area", $("#comboArea").value().trim());

  const url = "/thundercloud/system/catalogo/ubicacion/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  
  tableOne.initDataTable(data);
}

async function showTable (catalogo) {
  const dataF = new FormData();

  dataF.append("variablekey", "showTable");
  dataF.append("catalogo", catalogo);
console.log(catalogo);
  const url = "/thundercloud/system/catalogo/ubicacion/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, header);

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