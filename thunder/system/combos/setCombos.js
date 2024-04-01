async function showEquipo() {
  const comboEquipo = $("#comboEquipo");

  const dataF = new FormData(); // Utilizamos FormData para manejar archivos

  dataF.append("variablekey", "showEquipo");

  const url = "/thundercloud/system/combos/setCombos.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  console.log(data);

  data.forEach((option, index) => {
    comboEquipo.append(
      `<option value="${index}">${option}</option>`
    );
  });
}

async function showSubEquipo() {
  const comboEquipo = $("#comboSubEquipo");

  const dataF = new FormData(); // Utilizamos FormData para manejar archivos

  dataF.append("variablekey", "showSubEquipo");

  const url = "/thundercloud/system/combos/setCombos.php";
  const header = { "Content-Type": "multipart/form-data" };
  const data = await dataFetch(url, dataF);
  console.log(data);

  data.forEach((option, index) => {
    comboEquipo.append(
      `<option value="${index}">${option}</option>`
    );
  });
}