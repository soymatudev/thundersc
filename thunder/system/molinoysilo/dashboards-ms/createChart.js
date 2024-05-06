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
function createCanva(idContainer, idCanva, title, idfull) {
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
    container.appendChild(iconScreen);
    container.appendChild(titleCanvas);
    container.appendChild(canva);
  }
  
  // Chart Tiempo Total por Semana
  function processTiempoTS(nombres, data) {
    const divId = "container-tablaTwo";
    const chartId = "ChartTiempo";
  
    // Manejamos los datos obtenidos y creamos el Chart
    const divElement = document.getElementById(divId);
    divElement.innerHTML = "";
    createCanva(divId, chartId, "Tiempo de Actividad Por Molino", "Char1");
    const ctx = document.getElementById(chartId);
  
    const tiempoPorcentual = [];
  //const value = parseFloat(data[nombre][0]["tiempo_trabajado_en_horas"]);
    nombres.forEach((nombre, index) => {
      const value = parseFloat(data[nombre][0]);
      const porcentajePHora = 100 / 168;
      tiempoPorcentual[index] = (value * porcentajePHora).toFixed(1);
    });
  
    // Cargamos los datos para el chart
    const dataset = {
      label: "Porcentaje por Semana",
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
    // Creamos el objeto Chart y le asignamos la configuracion
    Bar = new Chart(ctx, {
      type: "bar",
      data: barChartData,
      options: options,
    });
  }
  // Creamos el Chart Donut Activos
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
        labels: ["Activos: " + unable, "Inactivos: " + disable],
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
  // Creamos el Chart Volumen por Silo
  function donutSilo(unable, disable) {
    const divDonutSilo = document.getElementById("container-tablaFour");
    divDonutSilo.innerHTML = "";
    createCanva("container-tablaFour", "ChartDntS", "Silos Con Carga Baja", "Char3");
    const ctx = document.getElementById("ChartDntS");
  
    donut = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Mayor a 30%", "Menor a 30%"],
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
  // Creamos el Chart Volumen por Silo
  function volumenSilo(nombres, data) {
    const divId = "divVolumenS";
    const chartId = "ChartVolumen";
  
    // Manejamos los datos obtenidos y creamos el Chart
    const divElement = document.getElementById(divId);
    divElement.innerHTML = "";
    createCanva(divId, chartId, "Volumen Ocupado Por Silo", "Char4");
    const ctx = document.getElementById(chartId);
  
    const volumenOcupado = [];
  
    nombres.forEach((nombre, index) => {
      console.log(data[nombre]);
      console.log(nombre);
      volumenOcupado[index] = data[nombre];
    });
  
    console.log(volumenOcupado);
  
    const dataset = {
      label: "Porcentaje por Silo",
      data: volumenOcupado,
      backgroundColor: "rgba(0, 128, 0, 0.5)",
      borderColor: "rgb(0, 128, 0)",
      borderWidth: 1,
    };
  
    console.log(dataset);
  
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
    console.log(Bar.data);
  }
  // Generamos un Color Random para Ingresarlo en el Chart
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
  