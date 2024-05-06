document.addEventListener("DOMContentLoaded", async function () {

  $("#btn-login").on("click", async function () {
    await login();
  });

});

async function login() {
  let username = $("#input-username").val().trim();
  let password = $("#input-password").val().trim();

  const dataF = new FormData();

  dataF.append("variablekey", "login");
  dataF.append("username", username);
  dataF.append("password", password);
  const url =
    "../../../thundercloud/admin/login/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);
  
  if (data.Session == "Correct") {
    window.location.href = "../../system/index.php";
  }
}
