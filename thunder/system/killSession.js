document.addEventListener("DOMContentLoaded", async function () {
  $("#btn-killSession").click(async function () {
    await killSession();
  });
});

async function killSession() {
  const dataF = new FormData();

  dataF.append("variablekey", "killSession");

  const url = "../../thundercloud/system/killSession.php";
  const header = { "Content-Type": "multipart/form-data" };
  await dataFetch(url, dataF);

  window.location.reload();
}