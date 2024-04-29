function alertError(msError) {
  Swal.fire({
    icon: "error",
    title: "No se realizó la acción.",
    text: msError,
    //footer: '<a href="#">Why do I have this issue?</a>'
    footer: false,
  });
}

function alertSucces(msSuccess) {
  Swal.fire({
    icon: "success",
    title: "Acción realizada con éxito.",
    text: msSuccess,
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

function alertEmpty(msEmpty) {
  Swal.fire({
    icon: "warning",
    title: "Campo vacío.",
    text: msEmpty,
    //footer: '<a href="#">Why do I have this issue?</a>'
    footer: false,
  });
}