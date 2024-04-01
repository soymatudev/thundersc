document.addEventListener("DOMContentLoaded", async function () {
  const btn = document.getElementById("btnAdd");
  const tableTwo = new CustomDataTable("container-tablaTwo");
  await showEquipo();
  await showSubEquipo();
  await showCalendar();
  const data = await showTableCalendar();
  tableTwo.initDataTable(data);
  btn.addEventListener("click", async function () {
    /* tableOne.initDataTable([
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 },
    ]); */

    await addRecord();
    await addRecordCalendar();
    await showCalendar();
    const data = await showTableCalendar();
    tableTwo.initDataTable(data);
  });
});

async function addRecord() {
  const brigada = $("#comboBrigada option:selected").text();
  const area = $("#inputArea").val().trim();
  const equipo = $("#comboEquipo option:selected").text();
  const subEquipo = $("#comboSubEquipo option:selected").text();
  const frecuencia = $("#comboFrecuencia option:selected").text();
  const fDesde = $("#inputDesde").val();
  const actividad = $("#comboActividad option:selected").text();

  console.log(brigada, area, equipo, subEquipo, frecuencia, fDesde);

  const dataF = new FormData(); // Utilizamos FormData para manejar archivos

  dataF.append("variablekey", "addRecord");
  dataF.append("brigada", brigada);
  dataF.append("area", area);
  dataF.append("equipo", equipo);
  dataF.append("subEquipo", subEquipo);
  dataF.append("frecuencia", frecuencia);
  dataF.append("fDesde", fDesde);
  dataF.append("actividad", actividad);

  const url = "/thundercloud/system/nueva_ot/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  await dataFetch(url, dataF);
}

function calendar(data) {
  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    /* events: [
        {
          title: 'Tarea 1',
          start: '2024-03-19T10:00:00',
          end: '2024-03-19T12:00:00'
        },
        {
          title: 'Tarea 2',
          start: '2024-03-20T14:00:00',
          end: '2024-03-20T16:00:00'
        }
      ] */
    events: data,
  });

  calendar.render();
}

async function addRecordCalendar() {
  const dataF = new FormData(); // Utilizamos FormData para manejar archivos

  dataF.append("variablekey", "addRecordCalendar");

  const url = "/thundercloud/system/nueva_ot/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  await dataFetch(url, dataF);
}

async function showCalendar() {
  const dataF = new FormData(); // Utilizamos FormData para manejar archivos

  dataF.append("variablekey", "showCalendar");

  const url = "/thundercloud/system/nueva_ot/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  console.log(data);

  // Nuevo arreglo para almacenar los eventos en el formato requerido por FullCalendar
  var eventos = [];

  // Iterar sobre los elementos del JSON y agregarlos al nuevo arreglo
  for (var key in data) {
    if (key !== "length" && data.hasOwnProperty(key)) {
      eventos.push({
        title: data[key].title,
        start: data[key].start,
        end: data[key].end,
      });
    }
  }
  console.log(eventos);
  calendar(eventos);
}

async function showTableCalendar() {
  const dataF = new FormData(); // Utilizamos FormData para manejar archivos

  dataF.append("variablekey", "showTableCalendar");

  const url = "/thundercloud/system/nueva_ot/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  return await dataFetch(url, dataF);
}
