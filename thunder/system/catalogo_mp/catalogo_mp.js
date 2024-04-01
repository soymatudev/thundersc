var cont = 0;
document.addEventListener("DOMContentLoaded", async function () {
  const btn = document.getElementById("btnAdd");
  const tableOne = new CustomDataTable("container-tablaOne");
  const tableTwo = new CustomDataTable("container-tablaTwo");
  
  let data = [];

  data = await showCatalogo("Equipo");
  tableOne.initDataTable(data);
  data = await showCatalogo("SubEquipo");
  tableTwo.initDataTable(data);

  btn.addEventListener("click", async function () {
    const catalogo = $("#comboCatalogo option:selected").text();
    await addRecord();
    if (catalogo == "Equipo") {
      data = await showCatalogo("Equipo");
      tableOne.initDataTable(data);
    } else {
      data = await showCatalogo("SubEquipo");
      tableTwo.initDataTable(data);
    }

  });
});

async function addRecord() {
  const catalogo = $("#comboCatalogo option:selected").text();
  const nombre = $("#inputNombre").val().trim();
  const area = $("#inputArea").val();

  console.log(catalogo, nombre, area);

  const dataF = new FormData(); // Utilizamos FormData para manejar archivos

  dataF.append("variablekey", "addRecord");
  dataF.append("catalogo", catalogo);
  dataF.append("nombre", nombre);  
  dataF.append("area", area);

  const url = "/thundercloud/system/catalogo_mp/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  await dataFetch(url, dataF);
}

async function showCatalogo(catalogo) {
  if (cont == 0 || cont == 1 ) {
    catalogo = catalogo;
    cont ++;
  } else {
    catalogo = $("#comboCatalogo option:selected").text();
  }
  
  const dataF = new FormData(); // Utilizamos FormData para manejar archivos

  dataF.append("variablekey", "showCatalogo");
  dataF.append("catalogo", catalogo);

  const url = "/thundercloud/system/catalogo_mp/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  return await dataFetch(url, dataF);
}
