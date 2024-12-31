document.addEventListener("DOMContentLoaded", async function () {
  $("#btn-killSession").click(async function () {
    await killSession();
  });
});

async function killSession() {
  let bridge = new Bridge(usuk, "cc", "System.killSession.killSession", []);
  let response = bridge.databriged();

  response
    .then(response => response.json())
    .then((data) => {
      if(data.event > 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.result,
        })
      } else {
        window.location.reload();
      }
    });
}