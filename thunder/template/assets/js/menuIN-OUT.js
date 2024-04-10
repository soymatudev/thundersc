document.addEventListener('DOMContentLoaded', async function() {
    $("#menuOUT").hide();

    await $("#menuIN").on("click", async function() {
        $("#menuIN").hide();
        $("#menuOUT").show();
    })

    await $("#menuOUT").on("click", async function() {
        $("#menuOUT").hide();
        $("#menuIN").show();
    })
});