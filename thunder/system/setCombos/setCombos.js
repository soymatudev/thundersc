async function setComboCedis() {
  const comboCedis = $("#comboCedis");

  const dataF = new FormData();
  dataF.append("variablekey", "setComboCedis");

  const url = "/thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  console.log(data);

  data.forEach((option, index) => {
    comboCedis.append(
      `<option value="${index}">${option.cedis}</option>`
    );
  });
}

async function setComboGrupoMS() {
  const comboEquipo = $("#comboGrupo");
  const cedis = $("#comboCedis option:selected").text();
console.log(cedis); 
  const dataF = new FormData();
  dataF.append("variablekey", "setComboGrupo");
  dataF.append("cedis", cedis);

  const url = "/thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  console.log(data);

  data.forEach((option, index) => {
    comboEquipo.append(
      `<option value="${index}">${option.zona}</option>`
    );
  });
}

async function setComboEquipoMS() {
  const comboEquipo = $("#comboEquipo");
  const cedis = $("#comboCedis option:selected").text();
  const grupo = $("#comboGrupo option:selected").text();

  const dataF = new FormData();
  dataF.append("variablekey", "setComboEquipo");
  dataF.append("cedis", cedis);
  dataF.append("grupo", grupo);

  const url = "/thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  console.log(data);

  data.forEach((option, index) => {
    comboEquipo.append(
      `<option value="${index}">${option.alias}</option>`
    );
  });
}