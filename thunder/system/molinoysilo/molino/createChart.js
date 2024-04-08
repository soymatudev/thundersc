/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 14/12/2023
Descripción: Se encarga de crear el elemento Canva y los charts personalizados
  para cada grafica que sea necesaria, agrega todo lo que se ve dentro del canva
  titulo, flechas FullScreen, grafica, color y sus clases respectivas.
===============================================================================
*/
// Creamos un Canvas para cada Chart
function createCanva(idContainer, idCanva, title, idfull, heigth = 410) {
  const container = document.getElementById(idContainer);
  const canva = document.createElement("canvas");
  const titleCanvas = document.createElement("h3");
  const iconScreen = document.createElement("i");

  titleCanvas.textContent = title;
  titleCanvas.classList.add("title-canvas");
  iconScreen.classList.add("bi");
  iconScreen.classList.add("bi-arrows-fullscreen");
  iconScreen.setAttribute("id", idfull);
  canva.id = idCanva;
  canva.style.maxHeight = heigth + "px";
  container.appendChild(iconScreen);
  container.appendChild(titleCanvas);
  container.appendChild(canva);
}
// Chart Tiempo Total por Semana
function processTiempoT(nombres, data) {
  const divId = "container-tablaFour";
  const chartId = "ChartTiempo";

  // Manejamos los datos obtenidos y creamos el Chart
  const divElement = document.getElementById(divId);
  divElement.innerHTML = "";
  createCanva(divId, chartId, "Tiempo de Actividad Por Molino", "Char1");

  const ctx = document.getElementById(chartId);

  const tiempoPorcentual = [];

  nombres.forEach((nombre, index) => {
    const value = parseFloat(data[nombre][0]['tiempo_trabajado_en_horas']);
    const porcentajePHora = 100 / 168;
    tiempoPorcentual[index] = (value * porcentajePHora).toFixed(1);
  });

  const dataset = {
    label: " Porcentaje por Semana de H.t",
    data: tiempoPorcentual,
    backgroundColor: "rgba(255, 205, 86, 0.5)",
    borderColor: "rgb(255, 205, 86)",
    borderWidth: 1,
  };

  const barChartData = {
    labels: nombres,
    datasets: [dataset],
  };

  // Configuración del gráfico
  var options = {
    scales: {
      y: {
        suggestedMax: 100, // Establecer el valor máximo del eje y
        beginAtZero: true, // Comenzar desde cero
      },
    },
  };

  Bar = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: options,
  });
}

function donutActive(unable, disable) {
  const divDonutActive = document.getElementById("container-tablaThree");
  divDonutActive.innerHTML = "";
  createCanva(
    "container-tablaThree",
    "ChartUnbDsb",
    "Molinos Activos e Inactivos",
    "Char2"
  );
  const ctx = document.getElementById("ChartUnbDsb");

  donut = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Activos", "Inactivos"],
      datasets: [
        {
          label: "Molinos",
          data: [unable, disable],
          backgroundColor: ["rgb(50, 255, 50, .5)", "rgb(255, 0, 0, .5)"],
          hoverOffset: 4,
        },
      ],
    },
  });

  return donut;
}

function processHistorialData(nombres, data, tiempo) {
  // Manejamos los datos obtenidos y creamos el Chart con el historial de actividad
  let data2 = [];
  let pivot = [];
  nombres.forEach((nombre, index) => {
    data[nombre].forEach((element, index) => {
      pivot[index] = element.dato_1;
    });
    data2[nombre] = (pivot);
  });
  
  const divHistorialA = document.getElementById("container-tablaTwo");
  divHistorialA.innerHTML = "";
  createCanva(
    "container-tablaTwo",
    "ChartHis",
    "Historial de Actividad por Día",
    "Char3"
  );
  const ctx = document.getElementById("ChartHis");
  const labels = [];
  const datasets = [];

  nombres.forEach((nombre, index) => {
    const dataset = {
      label: nombre + " A",
      data: data2[nombre].reverse(),
      fill: false,
      backgroundColor: "rgba(255, 205, 86, 0.5)",
      borderColor: "rgb(255, 205, 86)",
      tension: 0.1,
    };
    datasets.push(dataset);
    historialTiempo = tiempo[nombre].reverse();
    for (let index = 0; index < historialTiempo.length; index++) {
      labels[index] = historialTiempo[index]['hora_minutos'];
    }
    console.log(labels);
  });

  console.log(datasets);
  Line = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
  });
}

function getRandomColor() {
  const color2 = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(255, 205, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(153, 102, 255, 0.5)",
  ];
  const randomIndex = Math.floor(Math.random() * color2.length);
  return color2[randomIndex];
}

function optionsChart() {
  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#000", // Cambia el color de las etiquetas en la leyenda
        },
      },
    },
  };

  return options;
}

async function getDataHistorial() {
  historialData = await getData(
    "../../../../thundercloud/system/molinoysilo/molino/call.php",
    "getDataHistorial"
  );

  historialTiempo = await getData(
    "../../../../thundercloud/system/molinoysilo/molino/call.php",
    "getHistorialTiempo"
  );

  const nombres = Object.keys(historialData);
  console.log(historialData);
  console.log(historialTiempo);
  processHistorialData(nombres, historialData, historialTiempo);
}

async function getTiempoT() {
  tiempoData = await getData("../../../../thundercloud/system/molinoysilo/molino/call.php", "getTiempoT");
  const nombres = Object.keys(tiempoData);
  processTiempoT(nombres, tiempoData);
}

async function getData(url, keyData) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `variableKey=${keyData}`,
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
