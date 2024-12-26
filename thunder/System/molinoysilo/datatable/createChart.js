/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 14/12/2023
Descripción: En este caso se grafican los datos que se muestran en la tabla, al
  actualizar la tabla tambien se actualizaran las grafias.
  Son dos graficas:
  1- Muestra los datos de la columna Dato 1
  2- Muestra los datos despues de hacer los calculos para cada tipo de equipo.
===============================================================================
*/
async function getHistorialTable() {
  const cedis = $("#comboCedis option:selected").text();
  const grupo = $("#comboGrupo option:selected").text();
  const equipo = $("#comboEquipo option:selected").text();
  const f_ini = $("#f_inicial").val() + " 00:00:00";
  const f_fin = $("#f_final").val() + " 23:59:59";

  const dataF = new FormData();
  dataF.append("variablekey", "getDataHistorial");
  dataF.append("cedis", cedis);
  dataF.append("grupo", grupo);
  dataF.append("f_ini", f_ini);
  dataF.append("f_fin", f_fin);
  dataF.append("equipo", equipo);

  const url = "../../../../thundercloud/system/molinoysilo/datatable/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const historialData = await dataFetch(url, dataF);

  dataF.append("variablekey", "getHistorialTiempo");
  historialTiempo = await dataFetch(url, dataF);

  dataF.append("variablekey", "getHistorialExtra");
  const historialExtra = await dataFetch(url, dataF);

  let nombres = Object.keys(historialData);


  processHistorial(nombres, historialData, historialTiempo);
  processExtras(nombres, historialExtra, historialTiempo);
  /*   
    const chart1 = document.getElementById("Char1");
    const chart2 = document.getElementById("Char2");
  
    fullSChar(chart1, "container-tablaTwo");
    fullSChar(chart2, "container-tablaThree"); */
}

function processHistorial(nombres, data, tiempo) {
  // Manejamos los datos obtenidos y creamos el Chart con el historial de actividad
  const divHistorialL = document.getElementById("container-tablaTwo");
  divHistorialL.innerHTML = "";
  createCanva("container-tablaTwo", "ChartHis", "Datos 1", "Char1");
  const ctx = document.getElementById("ChartHis");
  const labels = [];
  const datasets = [];

  let data2 = [];
  let pivot = [];
  
  nombres.forEach((nombre, index) => {
    console.log(nombre);
    data[nombre].forEach((element, index) => {
      pivot[index] = element.dato_1;
    });
    data2[nombre] = pivot;
  });
  console.log(data2);

  nombres.forEach((nombre, index) => {
    const dataset = {
      label: nombre + "",
      data: data2[nombre],
      fill: false,
      borderColor: "rgb(0, 128, 0, .5)",
      tension: 0.1,
    };
    datasets.push(dataset);
    historialTiempo = tiempo[nombre];
    console.log(historialTiempo);
    for (let index = 0; index < historialTiempo.length; index++) {
      labels[index] = historialTiempo[index].hora_minutos;
    }
  });

  const Line = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
  });
}

function processExtras(nombres, data, tiempo) {
  const divId = "container-tablaThree";
  const chartId = "ChartExtra";

  // Manejamos los datos obtenidos y creamos el Chart
  const divElement = document.getElementById(divId);
  divElement.innerHTML = "";
  createCanva(divId, chartId, "Datos Extras", "Char2");

  const ctx = document.getElementById(chartId);
  const tiempoPorcentual = [];

  for (let index = 0; index < data[nombres[0]].length; index++) {
    const value = parseFloat(data[nombres[0]][index].Extra);
    tiempoPorcentual[index] = value.toFixed(1);
  }

  const dataset = {
    label: "Datos Extras",
    data: tiempoPorcentual,
    backgroundColor: "rgba(255, 205, 86, 0.5)",
    borderColor: "rgb(255, 205, 86)",
    borderWidth: 1,
  };

  const barChartData = {
    labels: tiempo,
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
