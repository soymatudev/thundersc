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

  $("#btn_Add").on("click", async function () {
    if ($("#comboFormato").val() === "0") {
      await setEquipo();
      await showTable("equipo");
      /* $("#nombre").val("");
      $("#cve").val("");
      $("#area").val("");*/
    } else if ($("#comboFormato").val() === "1") {
      await setAsignatario();
      await showTable("asignatario");
      await setComboAsignatario();
      await clearFields();
      //await setComboEquiposTrabajo();
    } else if ($("#comboFormato").val() === "2") {
      await setClasificacion();
      await showTable("clasificacion");
      await setComboClasif();
      await clearFields();
    } else if ($("#comboFormato").val() === "3") {
      await setMarca();
      await showTable("marca");
      await setComboMarca();
      await clearFields();
    } else if ($("#comboFormato").val() === "4") {
      await setArea();
      await showTable("area");
      await setComboArea();
      await clearFields();
    } else if ($("#comboFormato").val() === "5") {
      await setAlmacen();
      await showTable("almacen");
      await setComboAlmacen();
      await clearFields();
    } else if ($("#comboFormato").val() === "6") {
      await setZona();
      await showTable("zona");
      await setComboZona();
      await clearFields();
    } else if ($("#comboFormato").val() === "7") {
      let tbl = "";
      switch ($("#comboFormatoDelete").val()) {
        case "0":
          tbl = "equipo";
          break;
        case "1":
          tbl = "asignatario";
          break;
        case "2":
          tbl = "clasificacion";
          break;
        case "3":
          tbl = "marca";
          break;
        case "4":
          tbl = "area";
          break;
        case "5":
          tbl = "zona";
          break;
        case "6":
          tbl = "almacen";
          break;
      }
      await deleteElemento();
      await showTable(tbl);
    } 
  });

});

async function clearFields() {
  $("#nombre").val("");
  $("#apellidos").val("");
  $("#numserie").val("");
  //$("#modelo").val("");
  //$("#f_registro").val("");
  $("#cve").val("");
  //$("#area").val("");
}

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

  
  $("#divId").hide();
  $("#divCVE").hide();
  $("#divNombre").hide();
  $("#divApellidos").hide();
  $("#divComboZona").hide();
  $("#divFormatoDelete").hide();
  $("#CardEquipo").show();

  $("#comboFormato").on("change", function () {
    if ($("#comboFormato").val() === "0") {
      $("#divFechaR").show();
      $("#divModelo").show();
      $("#divNumserie").show();
      $("#divComboArea").show();
      $("#divComboMarca").show();
      $("#divComboAlmacen").show();
      $("#divComboAsignatario").show();
      $("#divComboClasificacion").show();
      $("#CardEquipo").show();
      
      $("#divId").hide();
      $("#divCVE").hide();
      $("#divNombre").hide();
      $("#divApellidos").hide();
      $("#divComboZona").hide();
      $("#divFormatoDelete").hide();
      $("#btn_Add").text("Agregar");
    } else if ($("#comboFormato").val() === "1") {
      $("#divNombre").show();
      $("#divApellidos").show();

      $("#divId").hide();
      $("#divCVE").hide();
      $("#divFechaR").hide();
      $("#divModelo").hide();
      $("#divNumserie").hide();
      $("#divComboArea").hide();
      $("#divComboZona").hide();
      $("#divComboMarca").hide();
      $("#divComboAlmacen").hide();
      $("#divFormatoDelete").hide();
      $("#divComboAsignatario").hide();
      $("#divComboClasificacion").hide();
      $("#CardEquipo").hide();
      $("#btn_Add").text("Agregar");
    } else if ($("#comboFormato").val() === "2" || $("#comboFormato").val() === "3" || $("#comboFormato").val() === "4" || $("#comboFormato").val() === "6" ){
      $("#divNombre").show();

      $("#divId").hide();
      $("#divCVE").hide();
      $("#divFechaR").hide();
      $("#divModelo").hide();
      $("#divNumserie").hide();
      $("#divComboArea").hide();
      $("#divApellidos").hide();
      $("#divComboZona").hide();
      $("#divComboMarca").hide();
      $("#divComboAlmacen").hide();
      $("#divFormatoDelete").hide();
      $("#divComboAsignatario").hide();
      $("#divComboClasificacion").hide();
      $("#CardEquipo").hide();
      $("#btn_Add").text("Agregar");
    } else if ($("#comboFormato").val() === "5") {
      $("#divCVE").show();
      $("#divNombre").show();
      $("#divComboZona").show();

      $("#divId").hide();
      $("#divFechaR").hide();
      $("#divModelo").hide();
      $("#divNumserie").hide();
      $("#divComboArea").hide();
      $("#divApellidos").hide();
      $("#divComboMarca").hide();
      $("#divComboAlmacen").hide();
      $("#divFormatoDelete").hide();
      $("#divComboAsignatario").hide();
      $("#divComboClasificacion").hide();
      $("#CardEquipo").hide();
      $("#btn_Add").text("Agregar");
    } else if ($("#comboFormato").val() === "7") {
      $("#divId").show();
      $("#CardEquipo").show();
      $("#divFormatoDelete").show();
      
      $("#divCVE").hide();
      $("#divNombre").hide();
      $("#divFechaR").hide();
      $("#divModelo").hide();
      $("#divNumserie").hide();
      $("#divComboZona").hide();
      $("#divComboArea").hide();
      $("#divApellidos").hide();
      $("#divComboMarca").hide();
      $("#divComboAlmacen").hide();
      $("#divComboAsignatario").hide();
      $("#divComboClasificacion").hide();
      $("#btn_Add").text("Eliminar");
    }
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

  if ($("#nombre").val().trim() === "" || $("#apellidos").val().trim() === "") {
    alertEmpty("El campo nombre o apellidos no puede estar vacío.");
  } else {
    dataF.append("variablekey", "setAsignatario");
    dataF.append("nombre", $("#nombre").val().trim());
    dataF.append("apellidos", $("#apellidos").val().trim());
  }

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Asignatario agregado con éxito!", "Error al agregar asignatario, intenta de nuevo.")
}

async function setClasificacion() {
  const dataF = new FormData();

  if ($("#nombre").val().trim() === "") { 
    alertEmpty("El campo nombre no puede estar vacío.");
  } else {
    dataF.append("variablekey", "setClasificacion");
    dataF.append("nombre", $("#nombre").val().trim()); 
  }

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Clasificación agregada con éxito!", "Error al agregar clasificación, intenta de nuevo.")
}

async function setMarca() {
  const dataF = new FormData();

  if ($("#nombre").val().trim() === "") { 
    alertEmpty("El campo nombre no puede estar vacío.");
  } else {
    dataF.append("variablekey", "setMarca");
    dataF.append("nombre", $("#nombre").val().trim());
  }

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Marca agregada con éxito!", "Error al agregar marca, intenta de nuevo.")
}

async function setArea() {
  const dataF = new FormData();

  if ($("#nombre").val().trim() === "") { 
    alertEmpty("El campo nombre no puede estar vacío.");
  } else {
    dataF.append("variablekey", "setArea");
    dataF.append("nombre", $("#nombre").val().trim());
  }

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Área agregada con éxito!", "Error al agregar área, intenta de nuevo.")
}

async function setAlmacen() {
  const dataF = new FormData();

  if ($("#nombre").val().trim() === "" || $("#cve").val().trim() === "" || $("#comboZona option:selected").text() === ""){ 
    alertEmpty("El campo nombre, clave o zona no puede estar vacío.");
  } else {
    dataF.append("variablekey", "setAlmacen");
    dataF.append("nombre", $("#nombre").val().trim());
    dataF.append("cve", $("#cve").val().trim());
    dataF.append("zona", $("#comboZona option:selected").text());
  }

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Almacén agregado con éxito!", "Error al agregar almacén, intenta de nuevo.")
}

async function setZona() {
  const dataF = new FormData();

  if ($("#nombre").val().trim() === "") { 
    alertEmpty("El campo nombre no puede estar vacío.");
  } else {
    dataF.append("variablekey", "setZona");
    dataF.append("nombre", $("#nombre").val().trim());
  }

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Zona agregada con éxito!", "Error al agregar zona, intenta de nuevo.")
}

async function setEquipo() {
  const dataF = new FormData();

  if ($("#modelo").val().trim() === "" || $("#f_registro").val().trim() === "" || $("#numserie").val().trim() === "" || $("#comboClasif option:selected").text() === "" || $("#comboMarca option:selected").text() === "" || $("#comboArea option:selected").text() === "" || $("#comboAlmacen option:selected").text() === "" || $("#comboAsignatario option:selected").text() === "") { 
    alertEmpty("Todos los campos son obligatorios.");
  } else {
    dataF.append("variablekey", "setEquipo");
    dataF.append("numserie", $("#numserie").val().trim());
    dataF.append("modelo", $("#modelo").val().trim());
    dataF.append("clasificacion", $("#comboClasif option:selected").text());
    dataF.append("marca", $("#comboMarca option:selected").text());
    dataF.append("area", $("#comboArea option:selected").text());
    dataF.append("almacen", $("#comboAlmacen option:selected").text());
    dataF.append("asignatario", $("#comboAsignatario option:selected").text());
    dataF.append("f_registro", $("#f_registro").val().trim());
  }

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Equipo agregado con éxito!", "Error al agregar equipo, intenta de nuevo.")
}

async function deleteElemento(){
  const dataF = new FormData();
  let elemento = $("#comboFormatoDelete option:selected").text();
  let id = $("#numid").val();

  dataF.append("variablekey", "deleteElemento");
  dataF.append("elemento", elemento);
  dataF.append("id", id);

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF, "Equipo agregado con éxito!", `Error al Eliminar ${elemento}, intenta de nuevo.`)
}

async function showTable (catalogo) {
  const dataF = new FormData();

  dataF.append("variablekey", "showTable");
  dataF.append("catalogo", catalogo);

  const url = "../../../../thundercloud/system/inventariosistemas/agregar/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);

  console.log(data);

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