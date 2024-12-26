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
  tab.innerHTML += `
  <button class="brn-tab-delete" onclick="deleteTab('${tabId}')">
    <i class="bi bi-x-circle-fill tab-delete"></i>
  </button>`;

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

function addTab(name) {
  tabCounter++;
  const urlTab = document.getElementById(name).getAttribute("data-url");
  const menuTab = document.getElementById("tab-bar");
  const containerTab = document.getElementById("tab-container");
  const dataEmpresa = document.getElementById(name).getAttribute("data-empresa");

  let tabId = "tab-" + name + "-" + tabCounter;
  let tabContentId = "tab-content-" + name + "-" + tabCounter;

  let tab = document.createElement("div");
  tab.id = tabId;
  tab.classList.add("col-2");
  tab.classList.add("body-tab");
  tab.innerHTML +=
  `
  <button class="brn-tab-delete" onclick="deleteTab('${tabId}', '${tabContentId}')">
    <i class="bi bi-x-circle-fill tab-delete"></i>
  </button>
  <a class="link-tab" href="#tab-content-${name + "-" + tabCounter}">${name} (${dataEmpresa})</a>
  `;

  let tabContent = document.createElement("div");
  tabContent.classList.add("tab");
  tabContent.id = tabContentId;
  tabContent.innerHTML = 
  `
  <div class="tab-content">
    <iframe src="${urlTab}" class="iframe"></iframe>
  </div>
  `;

  menuTab.appendChild(tab);
  containerTab.appendChild(tabContent);
  $("#bt-menubar").click();

}

function deleteTab(tabid, tabContentId){
  let tab = document.getElementById(tabid);
  let tabContent = document.getElementById(tabContentId);
  tab.remove();
  tabContent.remove();
}


/* ====================================================== */

//Add More Tab Functionality
var manageTabId = 1;
$(document).on('click', '[href="#addMoreTabs"]', function(e) {
	e.preventDefault();
	manageTabId+=1; //increament functionality to make unique id for tab and content
  $(this).parent().before('<li><a href="#round'+manageTabId+'" class="more-tab" role="tab" data-toggle="tab">Round '+manageTabId+'</a><span class="glyphicon glyphicon-remove" data-tabremove="#round'+manageTabId+'" data-toggle="tooltip" data-placement="top" title="Delete"></span></li>');
  $('#addTabContent').append('<div role="tabpanel" class="tab-pane fade" id="round'+manageTabId+'"><h4>Round '+manageTabId+'</h4><p>Lorem ipsum dolore...</p></div>');

  // Initialize tooltip after click
  $('[data-toggle="tooltip"]').tooltip({trigger : 'hover', delay: { "show": 100}});
});


// Remove Tab Functionality
$(document).on('click', '[data-tabremove]', function() {
	var getTargetId = $(this).data('tabremove');

	// check if this tab is active then previous tab will be active after delete this tab
	var CheckActive = $(this).parent().hasClass('active');
	if (CheckActive==true) {
		$(this).parent().prev().addClass('active');

		// Now add (in & active) class related to add active tab - for show content
		var getTabContentId = $(this).parent().prev().find('a').attr('href');
		$(getTabContentId).addClass('in active');		 
	}
	
	// Remove tab and related content
	$(this).parent().remove();
	$(getTargetId).remove();
});


// Initialize on page load
$(function () {
  let toggleFlag = true;
  $('[data-toggle="tooltip"]').tooltip({trigger : 'hover', delay: { "show": 100}})
  $("#bt-menubar").on("click", function() {
    toggleFlag ? $(".logo-menu-close").show() : $(".logo-menu-close").hide();
    toggleFlag ? $(".logo-menu").hide() : $(".logo-menu").show();
    toggleFlag = !toggleFlag;
  });
});



/* ========================== Menu x Empresa ============================ */

function menuXEmpresa(empresa) {
  if (Object.keys(menu).includes(empresa)) {
    let bridge = new Bridge("uu", "cc", "Admin.Menu.MenuService.getMenuxEmpresa", [empresa]);
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
        if ($("#menuxusuario").length) {
          $("#menuxusuario").remove();
          $("#sidebar").append(data.result);
        }
        $("#info-empre").text(empresa);
      }
    });
  }
}