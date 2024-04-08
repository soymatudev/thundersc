async function setComboCedis() {
  const comboCedis = $("#comboCedis");

  const dataF = new FormData();
  dataF.append("variablekey", "setComboCedis");

  const url = "../../../../thundercloud/system/setCombos/call.php";
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

  const url = "../../../../thundercloud/system/setCombos/call.php";
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

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  console.log(data);

  data.forEach((option, index) => {
    comboEquipo.append(
      `<option value="${index}">${option.alias}</option>`
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

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  console.log(data);

  data.forEach((option, index) => {
    comboEquipo.append(
      `<option value="${index}">${option.alias}</option>`
    );
  });
}

async function setComboZona() {
  const dataF = new FormData();
  dataF.append("variablekey", "setComboZona");

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);

  if (data === null || data === undefined) {data = [{"nombre": "Sin Datos"}]}; 

  $("#comboZona").empty();

  data.forEach((option, index) => {
    $("#comboZona").append(
      `<option value="${index}">${option.nombre}</option>`
    );
  });
}

async function setComboArea() {
  const dataF = new FormData();
  dataF.append("variablekey", "setComboArea");

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);

  $("#comboArea").empty();

  data.forEach((option, index) => {
    $("#comboArea").append(
      `<option value="${index}">${option.nombre}</option>`
    );
  });
}

async function setComboUbicacion () {
  const dataF = new FormData();
  dataF.append("variablekey", "setComboUbicacion");

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);

  if (data === null || data === undefined) {data = [{"nombre": "Sin Datos"}]}; 


  $("#comboUbicacion").empty();

  $("#comboUbicacion").append(
    `<option value="${0}">${""}</option>`
  );

  data.forEach((option, index) => {
    $("#comboUbicacion").append(
      `<option value="${index+1}">${option.nombre}</option>`
    );
  });
}

async function setComboClasif() {
  const dataF = new FormData();
  dataF.append("variablekey", "setComboClasif");

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);

  if (data === null || data === undefined) {data = [{"nombre": "Sin Datos"}]}; 


  $("#comboClasif").empty();

  $("#comboClasif").append(
    `<option value="${0}">${""}</option>`
  );

  data.forEach((option, index) => {
    $("#comboClasif").append(
      `<option value="${index+1}">${option.nombre}</option>`
    );
  });
}

async function setComboComponente() {
  const dataF = new FormData();
  dataF.append("variablekey", "setComboComponente");

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);

  if (data === null || data === undefined) {data = [{"nombre": "Sin Datos"}]}; 

  $("#comboComponentes").empty();

  $("#comboComponentes").append(
    `<option value="${0}">${""}</option>`
  );

  data.forEach((option, index) => {
    $("#comboComponentes").append(
      `<option value="${index+1}">${option.nombre}</option>`
    );
  });
}

async function setComboEquipoMaq() {
  const dataF = new FormData();
  dataF.append("variablekey", "setComboEquipoMaq");

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);

  $("#comboEquipo").empty();

  /* $("#comboEquipo").append(
    `<option value="${0}">${""}</option>`
  ); */

  data.forEach((option, index) => {
    $("#comboEquipo").append(
      `<option value="${index+1}">${option.nombre}</option>`
    );
  });
}

async function setComboSubEquipoMaq() {
  const dataF = new FormData();
  dataF.append("variablekey", "setComboSubEquipoMaq");

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);

  $("#comboSubEquipo").empty();

  /* $("#comboSubEquipo").append(
    `<option value="${0}">${""}</option>`
  ); */

  data.forEach((option, index) => {
    $("#comboSubEquipo").append(
      `<option value="${index+1}">${option.nombre}</option>`
    );
  });
}

async function setComboEquiposTrabajo() {
  const dataF = new FormData();
  dataF.append("variablekey", "setComboEquiposTrabajo");

  const url = "../../../../thundercloud/system/setCombos/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);

  $("#comboEquipo").empty();

  data.forEach((option, index) => {
    $("#comboEquiposT").append(
      `<option value="${index+1}">${option.cve}</option>`
    );
  });
}