let tableOne = '';
let tableTwo = '';
document.addEventListener("DOMContentLoaded" , async function () {
  tableOne = new CustomDataTable("container-tablaOne",
  true, false, false, true, true, true);
  tableTwo = new CustomDataTable("container-tablaTwo",
  true, false, false, true, true, true);
  tableThree = new CustomDataTable("container-tablaThree",
  true, false, false, true, true, true);
  tableFour = new CustomDataTable("container-tablaFour",
  true, false, false, true, true, true);
  tableFive = new CustomDataTable("container-tablaFive",
  true, false, false, true, true, true);
  tableSix = new CustomDataTable("container-tablaSix",
  true, false, false, true, true, true);
  tableSeven = new CustomDataTable("container-tablaSeven",
  true, false, false, true, true, true);

  await setComboAsignatario();
  await setComboClasif();
  await setComboMarca();
  await setComboArea();
  await setComboZona();
  await setComboAlmacen();

  await init();

  $("#btn_Buscar").on("click", async function () {
    $("#CardPDF").hide();
    if ($("#comboFormato").val() === "0") {
      await showTable("equipo");
    } else if ($("#comboFormato").val() === "1") {
      await showTable("asignatario");

    } else if ($("#comboFormato").val() === "2") {
      await showTable("clasificacion");

    } else if ($("#comboFormato").val() === "3") {
      await showTable("marca");

    } else if ($("#comboFormato").val() === "4") {
      await showTable("area");

    } else if ($("#comboFormato").val() === "5") {
      await showTable("almacen");

    } else if ($("#comboFormato").val() === "6") {
      await showTable("zona");

    }
  });

  $("#btn_Descargar").on("click", async function () {
    if ($("#comboFormato").val() == "0") {
      await tableSeven.onBtnExport();
    } else if ($("#comboFormato").val() == "1") {
      await tableOne.onBtnExport();
    } else if ($("#comboFormato").val() == "2") {
      await tableTwo.onBtnExport();
    } else if ($("#comboFormato").val() == "3") {
      await tableThree.onBtnExport();
    } else if ($("#comboFormato").val() == "4") {
      await tableFour.onBtnExport();
    } else if ($("#comboFormato").val() == "5") {
      await tableFive.onBtnExport();
    } else if ($("#comboFormato").val() == "6") {
      await tableSix.onBtnExport();
    }
  });

  $("#btn_PDF").on("click", async function () {
    if ($("#comboFormato").val() == "0") {
      $("#CardPDF").show();
      await getPDF();
    } 
  });

});

async function init() {
  $("#comboFormato").select2({
    minimumResultsForSearch: Infinity
  });

  $("#comboClasif").select2();
  $("#comboMarca").select2();
  $("#comboArea").select2();
  $("#comboZona").select2();
  $("#comboAlmacen").select2();
  $("#comboAsignatario").select2();

  
  $("#divNombre").hide();
  $("#divApellidos").hide();
  $("#divComboZona").hide();
  $("#divCVE").hide();
  $("#CardPDF").hide();
  $("#CardEquipo").show();

  $("#comboFormato").on("change", async function () {
    $("#CardPDF").hide();
    if ($("#comboFormato").val() === "0") {
      $("#divFechaInicio").show();
      $("#divFechaFin").show();
      $("#divModelo").show();
      $("#divNumserie").show();
      $("#divComboArea").show();
      $("#divComboMarca").show();
      $("#divComboAlmacen").show();
      $("#divComboAsignatario").show();
      $("#divComboClasificacion").show();
      $("#CardEquipo").show();
      
      $("#divCVE").hide();
      $("#divNombre").hide();
      $("#divApellidos").hide();
      $("#divComboZona").hide();
    } else if ($("#comboFormato").val() === "1") {
      $("#divNombre").show();
      $("#divApellidos").show();

      $("#divCVE").hide();
      $("#divFechaInicio").hide();
      $("#divFechaFin").hide();
      $("#divModelo").hide();
      $("#divNumserie").hide();
      $("#divComboArea").hide();
      $("#divComboZona").hide();
      $("#divComboMarca").hide();
      $("#divComboAlmacen").hide();
      $("#divComboAsignatario").hide();
      $("#divComboClasificacion").hide();
      $("#CardEquipo").hide();
    } else if ($("#comboFormato").val() === "2" || $("#comboFormato").val() === "3" || $("#comboFormato").val() === "4" || $("#comboFormato").val() === "6" ){
      $("#divNombre").show();

      $("#divCVE").hide();
      $("#divFechaInicio").hide();
      $("#divFechaFin").hide();
      $("#divModelo").hide();
      $("#divNumserie").hide();
      $("#divComboArea").hide();
      $("#divApellidos").hide();
      $("#divComboZona").hide();
      $("#divComboMarca").hide();
      $("#divComboAlmacen").hide();
      $("#divComboAsignatario").hide();
      $("#divComboClasificacion").hide();
      $("#CardEquipo").hide();
    } else if ($("#comboFormato").val() === "5") {
      $("#divCVE").show();
      $("#divNombre").show();
      $("#divComboZona").show();

      $("#divFechaInicio").hide();
      $("#divFechaFin").hide();
      $("#divModelo").hide();
      $("#divNumserie").hide();
      $("#divComboArea").hide();
      $("#divApellidos").hide();
      $("#divComboMarca").hide();
      $("#divComboAlmacen").hide();
      $("#divComboAsignatario").hide();
      $("#divComboClasificacion").hide();
      $("#CardEquipo").hide();
    }

    /* if ($("#comboFormato").val() === "0") {
      await showTable("equipo");
    } else if ($("#comboFormato").val() === "1") {
      await showTable("asignatario");
    } else if ($("#comboFormato").val() === "2") {
      await showTable("clasificacion");
    } else if ($("#comboFormato").val() === "3") {
      await showTable("marca");
    } else if ($("#comboFormato").val() === "4") {
      await showTable("area");
    } else if ($("#comboFormato").val() === "5") {
      await showTable("almacen");
    }  */

  });

  await showTable("asignatario");
  await showTable("clasificacion");
  await showTable("marca");
  await showTable("area");
  await showTable("zona");
  await showTable("almacen");
  await showTable("equipo");

}

async function setAsignatario() {
  const dataF = new FormData();

  dataF.append("variablekey", "setAsignatario");
  dataF.append("nombre", $("#nombre").val().trim());
  dataF.append("apellidos", $("#apellidos").val().trim());

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF)
}

async function setClasificacion() {
  const dataF = new FormData();

  dataF.append("variablekey", "setClasificacion");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF)
}

async function setMarca() {
  const dataF = new FormData();

  dataF.append("variablekey", "setMarca");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF)
}

async function setArea() {
  const dataF = new FormData();

  dataF.append("variablekey", "setArea");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF)
}

async function setAlmacen() {
  const dataF = new FormData();

  dataF.append("variablekey", "setAlmacen");
  dataF.append("nombre", $("#nombre").val().trim());
  dataF.append("cve", $("#cve").val().trim());
  dataF.append("zona", $("#comboZona option:selected").text());

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF)
}

async function setZona() {
  const dataF = new FormData();

  dataF.append("variablekey", "setZona");
  dataF.append("nombre", $("#nombre").val().trim());

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF)
}

async function setEquipo() {
  const dataF = new FormData();

  dataF.append("variablekey", "setEquipo");
  dataF.append("numserie", $("#numserie").val().trim());
  dataF.append("modelo", $("#modelo").val().trim());
  dataF.append("clasificacion", $("#comboClasif option:selected").text());
  dataF.append("marca", $("#comboMarca option:selected").text());
  dataF.append("area", $("#comboArea option:selected").text());
  dataF.append("almacen", $("#comboAlmacen option:selected").text());
  dataF.append("asignatario", $("#comboAsignatario option:selected").text());
  dataF.append("f_registro", $("#f_registro").val().trim());

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF)
}

async function showTable (catalogo) {
  const dataF = new FormData();

  dataF.append("variablekey", "showTable");
  dataF.append("catalogo", catalogo);
  if (catalogo == "equipo") {
    dataF.append("numserie", $("#numserie").val().trim());
    dataF.append("modelo", $("#modelo").val().trim());
    dataF.append("clasificacion", $("#comboClasif option:selected").text());
    dataF.append("marca", $("#comboMarca option:selected").text());
    dataF.append("area", $("#comboArea option:selected").text());
    dataF.append("almacen", $("#comboAlmacen option:selected").text());
    dataF.append("asignatario", $("#comboAsignatario option:selected").text());
    dataF.append("f_Ini", $("#f_Ini").val().trim());
    dataF.append("f_Fin", $("#f_Fin").val().trim());
  } else if (catalogo == "asignatario") {
    dataF.append("nombre", $("#nombre").val().trim());
    dataF.append("apellidos", $("#apellidos").val().trim());
  } else if (catalogo == "almacen") {
    dataF.append("nombre", $("#nombre").val().trim());
    dataF.append("cve", $("#cve").val().trim());
    dataF.append("zona", $("#comboZona option:selected").text());
  } else {
    dataF.append("nombre", $("#nombre").val().trim());
  }

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);

  if (data === null || data === undefined) {data = [{"Datos": "Sin datos"}]}

  switch (catalogo) {
    case "asignatario":
      tableOne.initDataTable(data);
      break;
    case "clasificacion":
      tableTwo.initDataTable(data);
      break;
    case "marca":
      tableThree.initDataTable(data);
      break;
    case "area":
      tableFour.initDataTable(data);
      break;
    case "zona":
      tableFive.initDataTable(data);
      break;
    case "almacen":
      tableSix.initDataTable(data);
      break;
    case "equipo":
      tableSeven.initDataTable(data);
      break;
  }
}

async function getPDF() {
  const dataF = new FormData();
  let catalogo = '';

  if ($("#comboFormato").val() == "0") {
    catalogo = "equipo";
  } else if ($("#comboFormato").val() == "1") {
    catalogo = "asignatario";
  } else if ($("#comboFormato").val() == "2") {
    catalogo = "clasificacion";
  } else if ($("#comboFormato").val() == "3") {
    catalogo = "marca";
  } else if ($("#comboFormato").val() == "4") {
    catalogo = "area";
  } else if ($("#comboFormato").val() == "5") {
    catalogo = "almacen";
  } else if ($("#comboFormato").val() == "6") {
    catalogo = "zona";
  }

  dataF.append("variablekey", "getPDF");
  dataF.append("catalogo", catalogo);
  dataF.append("numserie", $("#numserie").val().trim());
  dataF.append("modelo", $("#modelo").val().trim());
  dataF.append("clasificacion", $("#comboClasif option:selected").text());
  dataF.append("marca", $("#comboMarca option:selected").text());
  dataF.append("area", $("#comboArea option:selected").text());
  dataF.append("almacen", $("#comboAlmacen option:selected").text());
  dataF.append("asignatario", $("#comboAsignatario option:selected").text());
  dataF.append("f_registro", $("#f_registro").val() ? $("#f_registro").val().trim() : null);

  const url = "../../../../thundercloud/system/inventariosistemas/historial/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);

  if(data){
    createPDF(data);
  }

}

function createPDF(base64Data) {
  // Decodificar base64
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Crear un Blob con los datos del PDF
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  $("#container-PDF").html("");

  $("#container-PDF").append(`
    <iframe src="${url}" style="width: 100%; height: 100%;"></iframe>
  `);
  
  // Crear un enlace para descargar el archivo o abrirlo en una nueva ventana
  /* const link = document.createElement('a');
  link.href = url;
  link.download = 'documento.pdf'; // Nombre del archivo PDF
  link.click(); */
}
