document.addEventListener('DOMContentLoaded', function() {
    $("#menuOUT").hide();
    $("#menuIN").on("click", function() {
        $("#menuIN").hide();
        $("#menuOUT").show();
    })
    $("#menuOUT").on("click", function() {
        $("#menuOUT").hide();
        $("#menuIN").show();
    })
});