document.addEventListener('DOMContentLoaded', async function() {
    let username = true;

    await $("#menuIN").on("click", async function() {
        username ?  $("#title-user").hide() : $("#title-user").show();
        username = !username;
    })

});