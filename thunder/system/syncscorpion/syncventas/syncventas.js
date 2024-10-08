let tableOne = '';
let tableTwo = '';
document.addEventListener("DOMContentLoaded" , async function () {
  tableOne = new CustomDataTable("container-tablaOne", 
  true, false, false, true, true, true);

  //await setComboAlmacen();
  await init();

  $("#btn_Add").on("click", async function () {
    $("#Content-loading").show();
    await setVentas();
  });

});

async function clearFields() {

}

async function init() {
  $("#Content-loading").hide();
}


async function setVentas() {
  const dataF = new FormData();
  dataF.append("variablekey", "sincronizarWeb");
  dataF.append("f_sinc", $("#f_registro").val());

  const url = "../../../../thundercloud/system/syncscorpion/syncventas/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  await dataFetch(url, dataF, "Ventas Sincronizadas con Exito!", "Error al sincronizar ventas con Scorpion, intenta de nuevo.").then(() => {
    $("#Content-loading").hide();
  });

  /* data.then((data) => {
    if (data === null || data === undefined) {data = [{"Datos": "Sin datos"}]}
    $("#Content-loading").hide();
  }); */

}
