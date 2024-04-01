let tabCounter = 0;
function createTab(id) {
  const urlTab = document.getElementById(id).getAttribute("data-url");

  var tabContainer = document.getElementById("tab-container");
  //var addTabButton = document.getElementById("add-tab-btn");
  tabCounter++;

  // Crear elementos de la pestaña
  var tabId = "tab" + tabCounter;
  var tab = document.createElement("div");
  tab.id = tabId;
  tab.classList.add("tab");

  var tabLink = document.createElement("a");
  tabLink.href = "#" + tabId;
  tabLink.textContent = id;

  var tabContent = document.createElement("div");
  tabContent.classList.add("tab-content");

  var iframe = document.createElement("iframe");
  iframe.src = urlTab; // Cambia la URL según tus necesidades
  iframe.classList.add("iframe");
  tabContent.appendChild(iframe);

  //lorem.textContent = '<iframe style="width: 100%; height: 100%;" src="http://localhost/corona/template/iframe.html" frameborder="0"></iframe>';

  tab.appendChild(tabLink);
  tab.appendChild(tabContent);

  tabContainer.appendChild(tab);
}
