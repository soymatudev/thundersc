/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 2024
===============================================================================
*/

/* 

Parametros para la grid

id del contenedor para la grid - idTable
filtro visible - filterVisible
Varias paginas - pagination
Atopagination - autoPagination
cols. ordenables - sortable
filtro - filter
input filtro - floatFilter

*/

class CustomDataTable {
  constructor(
    idTable,
    filterVisible,
    pagination,
    autoPagination,
    sortable,
    filter,
    floatFilter
  ) {
    this.idTable = idTable;
    this.dataTable = null;
    this.dataTableIsInitialized = false;
    this.filterVisible = filterVisible;
    this.pagination = pagination;
    this.autoPagination = autoPagination;
    this.sortable = sortable;
    this.filter = filter;
    this.floatFilter = floatFilter;
  }

  async initDataTable(data) {
    const keys = Object.keys(data[0]);

    let columnDefs = [];
    keys.forEach((key, index) => {
      columnDefs[index] = { field: key, cellStyle: { textAlign: "center" } };
    });

    const rowData = data;

    const gridOptions = {
      columnDefs: columnDefs,

      rowData: rowData,

      rowSelection: "multiple",
      suppressMenuHide: this.filterVisible,

      suppressExcelExport: true,
      popupParent: document.body,

      pagination: this.pagination,
      paginationAutoPageSize: this.autoPagination, // Permite elegir de cuanto en cuanto si  es false

      defaultColDef: {
        sortable: this.sortable, // Hacer todas las columnas ordenables por defecto
        filter: this.filter, // Habilitar filtros por defecto
        editable: false,
        floatingFilter: this.floatFilter,
        flex: 1,
      },
    };

    if (this.dataTableIsInitialized) {
      this.dataTable.destroy();
    }

    //var gridDiv = document.querySelector("#myGrid");
    var gridDiv = document.querySelector("#" + this.idTable);
    this.dataTable = new agGrid.createGrid(gridDiv, gridOptions);
    this.dataTableIsInitialized = true;
  }

  async onBtnExport() {
    this.dataTable.exportDataAsCsv();
  }
}
