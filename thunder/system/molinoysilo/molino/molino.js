/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 14/12/2023
Descripción: Fichero para la pagina principal donde se obtienen los datos de
  las solicitudes para crear las charts y otros elementos.
===============================================================================
*/
let idSilo = 0;
document.addEventListener("DOMContentLoaded", async function () {
  $("#menuIN").hide();
  await getNameMol();
  await count();
  await getDataHistorial();
  await getTiempoT();

  // Obtenemos los Charts Creados para utilizarlos
/*   const char1 = document.getElementById("Char1");
  const char2 = document.getElementById("Char2");
  const char3 = document.getElementById("Char3");

  fullSChar(char1, "divHistorialA");
  fullSChar(char2, "divDonutActive");
  fullSChar(char3, "divTiempoT"); */
});
// Obtenemos el nombre de los elementos
async function getNameMol() {
  const tbody = document.getElementById("container-tablaOne");
  tbody.innerHTML = "";
  let keyData = "getMol";
  let body = `variableKey=${keyData}`;
  let nombres = await getDataFetch("../../../../thundercloud/system/molinoysilo/molino/call.php", body);
  console.log(nombres);
  setNameMol(nombres);
  await Promise.all(
    nombres.map((name, index) => dataMol(index, name).then(() => {}))
  );
}
// Generamos las celdas y filas de la tabla
function setNameMol(data) {
  let p = -1;
  let numRow = Math.ceil(data.length / 2);
  for (let j = 0; j < numRow; j++) {
    let idRow = "FilaCell-" + j;
    createFila(idRow);

    for (let i = 0; i < 2 && i < data.length ; i++) {
      p++;
      let element = data[p].alias;
      createData(p, idRow, element);
    }
  }
}
// Creamos las filas de la tabla
function createFila(idRow) {
  const tbody = document.getElementById("container-tablaOne");
  const newRowCell = document.createElement("tr");
  newRowCell.classList.add("row-data");
  newRowCell.id = idRow;
  tbody.appendChild(newRowCell);
}
// Creamos las celdas de la tabla
function createData(index, idRow, element) {
  const newDataCell = document.createElement("td");
  const e = element;
  console.log(e);
  newDataCell.classList.add("col-data");
  newDataCell.id = "Cell-" + index;
  newDataCell.textContent = element;
  const row = document.getElementById(idRow);
  row.appendChild(newDataCell);
}
// Obtenemos los datos para la tabla
async function dataMol(idContainer, nameMol) {
  let keyData = "getAmpere";
  let body = `variableKey=${keyData}&variablePHP=${nameMol}`;
  let data = await getDataFetch("../../../../thundercloud/system/molinoysilo/molino/call.php", body);
  createImg(idContainer, data);
}

let unable = 0;
let disable = 0;
// Generamos las imagenes de los molinos
function createImg(idContainer, element) {
  const img = document.createElement("img");
  img.classList = element ? "Activo" : "Inactivo";
  img.classList.add("gif-aviso");
  img.src = element ? "../../../template/assets/images/propellerGif.gif" : "/thunder/template/assets/images/alertR.gif";

  const div = document.getElementById("Cell-" + idContainer);
  div.appendChild(img);

  element ? unable++ : disable++;
}
// Obtenemos el numero de Molinos Activos e Inactivos
function count() {
  let molinosActivos = 0;
  let molinosInactivos = 0;
  molinosActivos = document.getElementsByClassName("Activo");
  molinosInactivos = document.getElementsByClassName("Inactivo");

  const cantidadActiva = molinosActivos.length;
  const cantidadInactiva = molinosInactivos.length;

  donutActive(cantidadActiva, cantidadInactiva);
}

// Realizamos la solicitud Fetch para traer los datos necesarios en cada caso, por ello el cuerpo de la solicitud es un parametro
async function getDataFetch(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}