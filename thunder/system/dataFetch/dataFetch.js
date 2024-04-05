/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 2024
===============================================================================
*/
async function dataFetch(url, body, header) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: body,
    });

    if (response.status === 500) {
      throw new Error("Error interno del servidor");
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (response.status === 204) {
      alert("Operacion exitosa, no se resivio contenido");
      return;
    }

    const contentType = response.headers.get("Content-Type");

    if (
      contentType &&
      contentType.toLowerCase().includes("application/octet-stream")
    ) {
      // Si el contenido es un archivo descargable, descárgalo directamente
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = response.headers
        .get("Content-Disposition")
        .split("filename=")[1]
        .replace(/\"/g, "");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (
      contentType &&
      contentType.toLowerCase().includes("application/json")
    ) {
      // Si el contenido es JSON, analízalo
      const data = await response.json();
      if (response.status === 500) {
        throw new Error("Error interno del servidor");
      } else if (response.status === 400) {
        console.log("Error en la solicitud:", data.error);
        // Puedes mostrar un mensaje al usuario indicando el error específico
      } else {
        if (data["Execute"] == "Correct") {
          //console.log("Esto es Data: " + data);
          //alertSucces();
          return;
        } else if (data["Execute"] == "Incorrect") {
          //console.log("Esto es Data: " + data);
          //alertError();
          return;
        }
        //console.log("Respuesta JSON:", data);
        return data;
      }
    } else {
      //alert("La respuesta no tiene un tipo de contenido esperado.");
      //const data = await response.json();
      //console.log("Data esta vacia: " + data);
      //alertSucces();
      alert("ssssssssssss");
      return; // Otra opción podría ser lanzar un error
    }
  } catch (error) {
    //alert("Acción Realizada");
    //alertSucces();
    //alertError();
    console.log("Error: ", error);
  }
}

//const bodyFetchAdd = `variablekey=${encodeURIComponent("addNote")}&id=${encodeURIComponent(note.id)}&title=${encodeURIComponent(note.title)}&body=${encodeURIComponent(note.body)}`;
