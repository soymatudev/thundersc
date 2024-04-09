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
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill tab-delete" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
    </svg>
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

  let tabId = "tab-" + name + "-" + tabCounter;
  let tabContentId = "tab-content-" + name + "-" + tabCounter;

  let tab = document.createElement("div");
  tab.id = tabId;
  tab.classList.add("col-2");
  tab.classList.add("body-tab");
  tab.innerHTML +=
  `
  <button class="brn-tab-delete" onclick="deleteTab('${tabId}', '${tabContentId}')">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill tab-delete" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"></path>
    </svg>
  </button>
  <a class="link-tab" href="#tab-content-${name + "-" + tabCounter}">${name}</a>
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
  $('[data-toggle="tooltip"]').tooltip({trigger : 'hover', delay: { "show": 100}})
});