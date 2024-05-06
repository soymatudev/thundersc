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
  await getVolumen();
  await getSiloAlert();

  $("#desing-silo").change(async function () {
    await getVolumen();
    await getSiloAlert();
  });
});

// Creamos el Chart Tiempo Total por Semana para la pagina principal
async function getTiempoTS() {
  tiempoData = await getData("../../../../thundercloud/system/molinoysilo/dashboards-ms/call.php", "getTiempoTS");
  const nombres = Object.keys(tiempoData);
  console.log(tiempoData);
  processTiempoTS(nombres, tiempoData);
}
// Creamos el Chart Donut Activos para la pagina principal
async function getActivos() {
  activos = await getData("../../../../thundercloud/system/molinoysilo/dashboards-ms/call.php", "getActivos");
  console.log(activos);
  unable = 0;
  disable = 0;

  activos.forEach((element) => {
    element == true ? unable++ : disable++;
  });

  donutActive(unable, disable);
}
// Creamos el Chart Volumen por Silos
async function getVolumen() {
  volumen = await getData("../../../../thundercloud/system/molinoysilo/dashboards-ms/call.php", "getVolumen");
  nombres = Object.keys(volumen);
  createSilos(nombres, volumen);
}

function createSilos(nombres, volumen) {
  $("#container-tablaOne").empty();
  const divSilos = document.getElementById("container-tablaOne");
  nombres.forEach((nombre) => {
    let desing = $("#desing-silo option:selected").text();
    let url = getSiloDesing(desing, Math.round(volumen[nombre][0].porcentaje));
    const silo = document.createElement("div");
    // 
    silo.className = "silo col-2 col-md-2 col-lg-2 col-xl-2";
    silo.id = nombre;
    silo.innerHTML = `
    <h6>${nombre}</h6>
    <p>${volumen[nombre][0].porcentaje}%</p>
    <p>${volumen[nombre][0].dato_1} de ${volumen[nombre][0].materia_prima}</p>
    <img src="${url}" alt="Silo" class="siloImg">
  `;
    divSilos.appendChild(silo);
  //<progress id='p0' value='${volumen[nombre][0].porcentaje}' max='100'></progress>
   // changeWidthAnimation(volumen[nombre][0].porcentaje);
  });
}

function getSiloDesing(style, volumen) {
  let url = "";
  let path = "../../../template/assets/images/img-silos/";
  if (volumen >= 0 && volumen <= 5) {
    url = `${path}${style}_png/silo0.png`;
  } else if (volumen >= 5 && volumen <= 10) {
    url = `${path}${style}_png/silo10.png`;
  } else if (volumen >= 10 && volumen <= 20) {
    url = `${path}${style}_png/silo10.png`;
  } else if (volumen >= 20 && volumen <= 30) {
    url = `${path}${style}_png/silo20.png`;
  } else if (volumen >= 30 && volumen <= 40) {
    url = `${path}${style}_png/silo30.png`;
  } else if (volumen >= 40 && volumen <= 50) {
    url = `${path}${style}_png/silo40.png`;
  } else if (volumen >= 50 && volumen <= 60) {
    url = `${path}${style}_png/silo50.png`;
  } else if (volumen >= 60 && volumen <= 70) {
    url = `${path}${style}_png/silo60.png`;
  } else if (volumen >= 70 && volumen <= 80) {
    url = `${path}${style}_png/silo70.png`;
  } else if (volumen >= 80 && volumen <= 90) {
    url = `${path}${style}_png/silo80.png`;
  } else if (volumen >= 90 && volumen <= 97) {
    url = `${path}${style}_png/silo90.png`;
  } else if (volumen >= 98 && volumen <= 100) {
    url = `${path}${style}_png/silo100.png`;
  }
  return url;
}

// Creamos el Chart Volumen por Silos debajo de X porcentaje
async function getSiloAlert() {
  volumen = await getData("../../../../thundercloud/system/molinoysilo/dashboards-ms/call.php", "getVolumen");
  nombres = Object.keys(volumen);
  unable = 0;
  disable = 0;
  nombres.forEach((nombre) => {
    console.log( volumen[nombre][0].porcentaje);
    volumen[nombre][0].porcentaje >= 30 ? unable++ : disable++;
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
