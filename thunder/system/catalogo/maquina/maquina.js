let init = 0;
document.addEventListener("DOMContentLoaded" , async function () {
  const tableOne = new CustomDataTable("container-tablaOne");
  
  await setComboCedis();
  $("#comboCedis").on("change", async function () {
    await setComboGrupoMS();
  });
  $("#comboGrupo").on("change", async function () {
    await setComboEquipoMS();
  });

  $("#btn_consult").on("click", async function () {
    const data = await setDataTable();
      
    if (data == undefined || data == null) {
      tableOne.initDataTable(data);
      await getHistorialTable();
    } else {
      tableOne.initDataTable(data);
      await getHistorialTable();
    }
  });

});

async function setDataTable() {
  const cedis = $("#comboCedis option:selected").text();
  const grupo = $("#comboGrupo option:selected").text();
  const equipo = $("#comboEquipo option:selected").text();
  const f_ini = $("#f_inicial").val()+" 00:00:00";
  const f_fin = $("#f_final").val()+" 23:59:59";

  console.log(cedis, grupo, equipo, f_ini, f_fin);

  const table = $("#tableData");

  const dataF = new FormData();

  dataF.append("variablekey", "setDataTable");
  dataF.append("cedis", cedis);
  dataF.append("grupo", grupo);
  dataF.append("equipo", equipo);
  dataF.append("f_ini", f_ini);
  dataF.append("f_fin", f_fin);

  const url = "/thundercloud/system/molinoysilo/datatable/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  return data;
}

