function alertError() {
  Swal.fire({
    icon: "error",
    title: "No se realizó la acción.",
    text: "Verifica los datos añadidos.",
    //footer: '<a href="#">Why do I have this issue?</a>'
    footer: false,
  });
}

function alertSucces() {
  Swal.fire({
    icon: "success",
    title: "Acción realizada con éxito.",
    text: " ¡Todo fue bien!",
    //footer: '<a href="#">Why do I have this issue?</a>'
    footer: false,
  });
}

function alertLogin() {
  Swal.fire({
    icon: "question",
    title: "Información",
    text: "El usuario o la contraseña son incorrectos.",
    //footer: "Error en la solicitud al servidor. Inténtalo nuevamente.",
    footer: false,
  });
}
