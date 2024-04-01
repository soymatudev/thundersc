document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btnAdd");
  const tableOne = new CustomDataTable("container-tablaOne");
  btn.addEventListener("click", function () {
    tableOne.initDataTable([
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 },
    ]);
  });
});
