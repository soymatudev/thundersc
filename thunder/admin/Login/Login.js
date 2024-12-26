/* document.addEventListener("DOMContentLoaded", async function () {

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
    "../../../thundercloud/Admin/login/call.php";
  const header = { "Content-Type": "multipart/form-data" };
  let data = await dataFetch(url, dataF);
  
  if (data.Session == "Correct") {
    window.location.href = "../../system/index.php";
  }
}

 */
init();

function init() {
  $("#btn-login").off("click").on("click", async function () {
    login();
  });
}

function login(user = '', company = '') {
  let uu = user;
  let cc = company;
  let username = $("#input-username").val().trim();
  let password = $("#input-password").val().trim();
  let bridge = new Bridge(uu, cc, "Admin.Login.LoginService.getUsuarioxClave", [username, password]);
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
      window.location.href = "../../System/index.php";
    }
  });
}