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
  await getTiempoTS();
  await getActivos();
  await getVolumen();
  await getSiloAlert();

});

// Creamos el Chart Tiempo Total por Semana para la pagina principal
async function getTiempoTS() {
  tiempoData = await getData("/thundercloud/system/dashboards-ms/call.php", "getTiempoTS");
  const nombres = Object.keys(tiempoData);
  console.log(tiempoData);
  processTiempoTS(nombres, tiempoData);
}
// Creamos el Chart Donut Activos para la pagina principal
async function getActivos() {
  activos = await getData("/thundercloud/system/dashboards-ms/call.php", "getActivos");
  unable = 0;
  disable = 0;

  activos.forEach((element) => {
    element == true ? unable++ : disable++;
  });

  donutActive(unable, disable);
}
// Creamos el Chart Volumen por Silos
async function getVolumen() {
  volumen = await getData("/thundercloud/system/dashboards-ms/call.php", "getVolumen");
  nombres = Object.keys(volumen);
  console.log(volumen);
  console.log(volumen["SILO-A"]);
  console.log(volumen["SILO-A"][0]);
  console.log(volumen["SILO-A"][0].porcentaje);
  console.log(volumen["SILO-A"][0].dato_1);
  createSilos(nombres, volumen);
}

function createSilos(nombres, volumen) {
  const divSilos = document.getElementById("container-tablaOne");
  nombres.forEach((nombre) => {
    const silo = document.createElement("div");
    silo.className = "silo col-12";
    silo.id = nombre;
    silo.innerHTML = `
    <h6>${nombre}</h6>
    <p>${volumen["SILO-A"][0].porcentaje}%</p>
    <p>${volumen["SILO-A"][0].dato_1} de ${volumen["SILO-A"][0].materia_prima}</p>
    <img src="/thunder/template/assets/images/silo1.png" alt="Silo" class="siloImg">
    <div class="container-progressbar">
            <input type="checkbox" id="water"/>
            <label for="water" class="label-progress">
              <div id="fill"></div>
            </label>
          </div>
        </div>
  `;
    divSilos.appendChild(silo);
  });

  changeWidthAnimation(volumen["SILO-A"][0].porcentaje);
}

function changeWidthAnimation(volumen) {
  const progressBar = document.querySelector('label div');
  const desiredWidth = volumen;

  if (desiredWidth) {
    progressBar.style.setProperty('--progress-width', desiredWidth + '%'); // Establece el ancho usando una variable CSS
  }
}

// Creamos el Chart Volumen por Silos debajo de X porcentaje
async function getSiloAlert() {
  volumen = await getData("/thundercloud/system/dashboards-ms/call.php", "getVolumen");
  nombres = Object.keys(volumen);

  unable = 0;
  disable = 0;
  nombres.forEach((nombre) => {
    volumen[nombre] >= 30 ? unable++ : disable++;
  });

  donutSilo(unable, disable);
}
// Obtenemos los datos con una Solicitud Fetch
async function getData(url, keyData) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `variablePHP=${keyData}`,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
