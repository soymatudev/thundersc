
class Funciones {
    
    static getConfigConfirmAlert(title_msg, type_msg, txt_sec = "", reverse=false) {
        return {
            title: title_msg,
            color: "#545454",
            icon: type_msg,
            iconHtml: '?',
            text: txt_sec,
            type: type_msg,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            reverseButtons: reverse,
            focusCancel: reverse,
        }
    }

    static ThunderPermi(permi) {
        const params = new URLSearchParams(window.location.search);
        const tpmId = atob(params.get('tpmId'));
        return tpmId.includes(permi) ? true : false;
    }

    static setComboButtom(callback = consultar, tag = "#comboButtom", items = null) {
        let opts = ''
        if (items === null) items = ['PDF', 'GRID']
        items.map(x => opts += `<div><button class='btn combo-buttom' value='${x}'>${x}</button></div>`)

        $(tag).html(`<p class="bold label-c-g">Reporte En:</p>
        <div class="d-flex">
            <button class="combo-buttom" id='btnSelect' value="${items[0]}">${items[0]}</button>
            <button class="combo-buttom" id='btnPopUp'><i class="bi bi-chevron-compact-down"></i></button>
        </div>
        <div class="items" style="display: none;">${opts}</div>`)

        $("#btnPopUp").off().click(() => $(tag + " .items").toggle())
        $(tag + " .btn").off().click((e) => {
            let val = e.currentTarget.value
            $("#btnSelect").text(val).prop('value', val);
            $(tag + " .items").hide()
            callback(val)
        })

        $("#btnSelect").off().click((e) => callback(e.currentTarget.value))
    }

    static sidebarFechas(format = 'yyyy-mm-dd', tag = "#fechas", fini = "Fecha Inicial", ffin = "Fecha Final") {
        const applyDateFormat = (input) => {
            const separators = format.replace(/(dd|mm|yyyy)/g, '').split('')
            const parts = format.split(/[^a-zA-Z]/)
            let currentValue = input.value.replace(/\D/g, '')
            const cursorPosition = input.selectionStart

            if (currentValue.length > parts.join('').length) currentValue = currentValue.slice(0, parts.join('').length)

            let newValue = '',
                separatorIndex = 0,
                partLength = parts[0].length

            for (let i = 0; i < currentValue.length; i++) {
                if (i === partLength && separatorIndex < separators.length) {
                    newValue += separators[separatorIndex++]
                    partLength += parts[separatorIndex] ? parts[separatorIndex].length : 0
                }
                newValue += currentValue[i]
            }

            const prevLength = input.value.length
            input.value = newValue

            const diffLength = newValue.length - prevLength
            const newCursorPosition = cursorPosition + diffLength

            if (cursorPosition <= newValue.length) {
                input.setSelectionRange(newCursorPosition, newCursorPosition)
            } else {
                input.setSelectionRange(newValue.length, newValue.length)
            }
        }

        const isValidDate = (value) => {
            if (value.length >= 10) {
                const parts = value.split(/[^0-9]/)
                const formatParts = format.split(/[^a-zA-Z]/)
                let day, month, year

                for (let i = 0; i < formatParts.length; i++) {
                    if (formatParts[i] === 'dd') {
                        day = parseInt(parts[i], 10)
                    } else if (formatParts[i] === 'mm') {
                        month = parseInt(parts[i], 10)
                    } else if (formatParts[i] === 'yyyy') {
                        year = parseInt(parts[i], 10)
                    }
                }

                if (month < 1 || month > 12) {
                    return "Mes inválido"
                }

                const daysInMonth = new Date(year, month, 0).getDate()
                if (day < 1 || day > daysInMonth) {
                    return `Día inválido para el mes seleccionado (1-${daysInMonth})`
                }
                return ""
            } else {
                return "Fecha Incorrecta"
            }
        }

        $(tag).removeClass("form").html(`
        <div class="form_md">
            <input type="text" class="form_input bordes_redondeados" data-toggle="datepicker" id="f_inicial" autocomplete="off" required>
            <label for="f_inicial" class="form_label">${fini}</label>
        </div>
        <div class="form_md">
            <input type="text" class="form_input bordes_redondeados" data-toggle="datepicker" id="f_final" autocomplete="off" required>
            <label for="f_final" class="form_label">${ffin}</label>
        </div>
        <div id="errorDatePicker" class="c-red d-none"></div>`)

        $(tag + ' [data-toggle="datepicker"]').datepicker({
            autoHide: true,
            zIndex: 2048,
            autoPick: true,
            format: format
        })
        $(tag + ' [data-toggle="datepicker"]').on('input', function(event) {
            applyDateFormat(event.target)
            $(tag + ' #errorDatePicker').hide()
        })
        $(tag + ' [data-toggle="datepicker"]').on('blur', function(event) {
            const errorMessage = isValidDate(event.target.value)
            if (errorMessage) {
                $(tag + ' #errorDatePicker').text(errorMessage).show()
                event.target.value = ''
            } else {
                $(tag + ' #errorDatePicker').hide()
            }
        })
        $(tag + ' [data-toggle="datepicker"]').on('keydown', function(event) {
            if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
                event.preventDefault()
            }
        })
    }

    static formatoNumero(params, decimal = false, numDec = 2) {
        let val = params.value
        if (typeof val === "undefined") val = params
        if (typeof val !== "object"){
            if (val === "isempty") return ''
            let r = null
            if( decimal ) {
                r = parseFloat(val).toFixed(numDec)
            } else {
                r = Number.isInteger(val) ? val : parseFloat(val).toFixed(numDec)
            }
    
            let n = r.toString().split('.'),
                p1 = n[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                p2 = n[1]
    
            return typeof p2 !== "undefined"  ? p1.toString() + "." + p2.toString() : p1.toString()
        } else {
            return 0
        }
    }

    static moneda(params) {
        let val = params.value
        if (typeof val === "undefined") val = params
        if (typeof val !== "object"){
            if (val === "isempty") return ''
            let r = parseFloat(val).toFixed(2)
            return '$' + r.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        } else {
            return '$' + 0.00
        }
    }

    static localeText() {
        return {
            // for set filter
            selectAll: 'Seleccionar Todo',
            searchOoo: 'Buscar...',
            // for number filter and text filter
            filterOoo: 'Filtrar...',
            loadingOoo: 'Cargando...',
            equals: 'Igual a',
            notEqual: 'No es igual a',
            lessThan: 'Menor a',
            greaterThan: 'Mayor a',
            lessThanOrEqual: 'Menor o igual a',
            greaterThanOrEqual: 'Mayor o igual a',
            inRange: 'En el rango',
            inRangeStart: 'De',
            inRangeEnd: 'A',
            //Text Filter
            contains: 'Contiene',
            notContains: 'No contiene',
            startsWith: 'Inicia con',
            endsWith: 'Termina con',
            //Filter Buttons
            applyFilter: 'Aplicar',
            clearFilter: 'Limpiar',
            // Filter Conditions
            andCondition: 'Y',
            orCondition: 'O',
            // other
            noRowsToShow: 'No existen filas para mostrar',
            // enterprise menu
            autosizeThiscolumn: 'Ajustar esta columna',
            autosizeAllColumns: 'Ajustar todas las columnas',
            groupBy: 'Agrupar por',
            ungroupBy: 'Desagrupar por',
            resetColumns: 'Reiniciar columnas',
            export: 'Exportar',
            csvExport: 'Exportar CSV',
            excelExport: 'Exportar Excel (.xlsx)',
            excelXmlExport: 'Exportar Excel (.xml)',
            // enterprise menu aggregation and status bar
            sum: 'Suma',
            count: 'Total',
            average: 'Promedio',
            avg: 'Promedio',
            // standard menu
            copy: 'Copiar',
            copyWithHeaders: 'Copiar con encabezados',
            copyWithGroupHeaders: 'Copiar con encabezados de grupo',
            paste: 'Pegar',
            //tool panel
            rowGroupColumnsEmptyMessage: 'Arrastrar columna para agrupar',
            // Side Bar
            columns: 'Columnas',
            filters: 'Filtros',
        }
    }

    static _qs(tag) {
        return document.querySelector(tag)
    }

    static FormatDate(inputIds) {
        const fechaActual = new Date();
        const dd = fechaActual.getDate().toString().padStart(2, '0');
        const mm = (fechaActual.getMonth()   
        + 1).toString().padStart(2, '0');
        const yy = fechaActual.getFullYear();   

        inputIds.forEach(id => {
            $(`#${id}`).val(`${yy}-${mm}-${dd}`);
        });
    }

    static insertarModal(id, titulo, isLoader = true, fnClose = true, small = false) {
        let nameClass = small ? "modal-small" : ""
        $(`#${id}`).remove()
        $(".content").append(`<div class="modal modal-wrap" id="${id}" tabindex="0">
            <div class="modal-box bordes_redondeados ${nameClass}">
                <h3 class="titulo_modal">${titulo}</h3>
                <span class="modal-close"><i class="bi bi-x-circle-fill"></i></span>
                <div class="contenido_modal">${isLoader ? "" : ""}</div>
            </div>
        </div>`)
    
        if (fnClose) {
            let tag = `#${id}`
            $(tag + ' .modal-close').click(() => $(tag).remove())
            $(tag).focus().keydown((e) => {
                if (e.keyCode === 27) $(tag).remove()
            })
        }
    }

    static alertError(msError) {
        Swal.fire({
            icon: "error",
            title: "No se realizó la acción.",
            text: msError,
            //footer: '<a href="#">Why do I have this issue?</a>'
            footer: false,
        });
    }
      
    static alertSucces(msSuccess) {
        Swal.fire({
            icon: "success",
            title: "Acción realizada con éxito.",
            text: msSuccess,
            //footer: '<a href="#">Why do I have this issue?</a>'
            footer: false,
        });
    }
      
    static alertLogin() {
        Swal.fire({
            icon: "question",
            title: "Información",
            text: "El usuario o la contraseña son incorrectos.",
            //footer: "Error en la solicitud al servidor. Inténtalo nuevamente.",
            footer: false,
        });
    }
      
    static alertEmpty(msEmpty) {
        Swal.fire({
            icon: "warning",
            title: "Campo vacío.",
            text: msEmpty,
            //footer: '<a href="#">Why do I have this issue?</a>'
            footer: false,
        });
    }

    static dataFetch(url, body, msSuccess = "Todo fue bien!", msError1 = "Algo salio mal, intenta de nuevo o reportalo.", header) {
        try {
            
            const response = fetch(url, {
            method: "POST",
            headers: header,
            body: body,
            });
        
            if (response.status === 500) {
            throw new Error("Error interno del servidor");
            } else if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            if (response.status === 204) {
            alert("Operacion exitosa, no se resivio contenido");
            return;
            }
        
            const contentType = response.headers.get("Content-Type");
        
            if (
            contentType &&
            contentType.toLowerCase().includes("application/octet-stream")
            ) {
            // Si el contenido es un archivo descargable, descárgalo directamente
            const blob = response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = response.headers
                .get("Content-Disposition")
                .split("filename=")[1]
                .replace(/\"/g, "");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            } else if (
            contentType &&
            contentType.toLowerCase().includes("application/json")
            ) {
            // Si el contenido es JSON, analízalo
            const data = response.json();
            if (response.status === 500) {
                throw new Error("Error interno del servidor");
            } else if (response.status === 400) {
                console.log("Error en la solicitud:", data.error);
                // Puedes mostrar un mensaje al usuario indicando el error específico
            } else {
                if (data["Execute"] == "Correct") {
                //console.log("Esto es Data: " + data);
                alertSucces(msSuccess)
                return;
                } else if (data["Execute"] == "Incorrect") {
                //console.log("Esto es Data: " + data);
                alertError(msError1);
                return;
                }
                //console.log("Respuesta JSON:", data);
                return data;
            }
            } else {
            let data= null;
            return data; // Otra opción podría ser lanzar un error
            }
        } catch (error) {
            //alert("Acción Error");
            //alertSucces();
            alertError("Algo salio mal, intenta de nuevo");
            console.log("Error: ", error);
        }
    }
      
}