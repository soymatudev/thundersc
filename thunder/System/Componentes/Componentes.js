
class Componentes{

    static empresa(user = '', company = '', container = '') {
        let uu = user;
        let cc = company;
        let bridge = new Bridge(uu, cc, "System.Componentes.ComponenteService.getEmpresa");
        let response = bridge.databriged();
        let options = "";

        response
        .then(response => response.json())
        .then((data) => {
            data = data.result;
            for(let i = 0; i < data.length; i++) {
                options += `
                    <option value="${data[i]['clave']}">${data[i]['clave']}-${data[i]['descri']}</option>
                `;
            }
            $("#"+container).append(`
                <select id="select-empresa" class="select col-md-2" tabindex="-1" aria-hidden="true">
                    ${options}
                </select>
             `);
        });
        
    }

    static almacenes(uu, cc, container = '') {
        let bridge = new Bridge(uu, cc, "System.Componentes.ComponenteService.getAlmacenes");
        let response = bridge.databriged();
        let options = "";

        response
        .then(response => response.json())
        .then((data) => {
            data = data.result;
            for(let i = 0; i < data.length; i++) {
                options += `
                    <option value="${data[i]['clave']}">${data[i]['clave']}-${data[i]['descri']}</option>
                `;
            }
            $("#"+container).append(`
                <select id="select-almacen" class="select col-md-2" tabindex="-1" aria-hidden="true">
                    <option value=""></option>
                    ${options}
                </select>
             `);
            $("#select-almacen").select2();
        });
    }

    static empleados(uu, cc, container = '') {
        let bridge = new Bridge(uu, cc, "System.Componentes.ComponenteService.getEmpleados");
        let response = bridge.databriged();
        let options = "";

        response
        .then(response => response.json())
        .then((data) => {
            data = data.result;
            for(let i = 0; i < data.length; i++) {
                options += `
                    <option value="${data[i]['clave']}">${data[i]['clave']}-${data[i]['descri']}</option>
                `;
            }
            $("#"+container).append(`
                <select id="select-empleado" class="select col-md-2" tabindex="-1" aria-hidden="true">
                    <option value=""></option>
                    ${options}
                </select>
             `);
            $("#select-empleado").select2();
        });
    }

    static marcas(uu, cc, container = '') {
        let bridge = new Bridge(uu, cc, "System.Componentes.ComponenteService.getMarcas");
        let response = bridge.databriged();
        let options = "";

        response
        .then(response => response.json())
        .then((data) => {
            data = data.result;
            for(let i = 0; i < data.length; i++) {
                options += `
                    <option value="${data[i]['clave']}">${data[i]['clave']}-${data[i]['descri']}</option>
                `;
            }
            $("#"+container).append(`
                <select id="select-marca" class="select col col-md-2" tabindex="-1" aria-hidden="true">
                    <option value=""></option>
                    ${options}
                </select>
                `);
            $("#select-marca").select2();
        });
    }

    static departamentos(uu, cc, container = '') {
        let bridge = new Bridge(uu, cc, "System.Componentes.ComponenteService.getDepartamentos");
        let response = bridge.databriged();
        let options = "";

        response
        .then(response => response.json())
        .then((data) => {
            data = data.result;
            for(let i = 0; i < data.length; i++) {
                options += `
                    <option value="${data[i]['clave']}">${data[i]['clave']}-${data[i]['descri']}</option>
                `;
            }
            $("#"+container).append(`
                <select id="select-departamento" class="select col-md-2" tabindex="-1" aria-hidden="true">
                    <option value=""></option>
                    ${options}
                </select>
                `);
            $("#select-departamento").select2();
        });
    }

    static clasificaciones(uu, cc, container = '') {
        let bridge = new Bridge(uu, cc, "System.Componentes.ComponenteService.getClasificaciones");
        let response = bridge.databriged();
        let options = "";

        response
        .then(response => response.json())
        .then((data) => {
            data = data.result;
            for(let i = 0; i < data.length; i++) {
                options += `
                    <option value="${data[i]['clave']}">${data[i]['clave']}-${data[i]['descri']}</option>
                `;
            }
            $("#"+container).append(`
                <select id="select-clasificacion" class="select col-md-2" tabindex="-1" aria-hidden="true">
                    <option value=""></option>
                    ${options}
                </select>
                `);
            $("#select-clasificacion").select2();
        });
    }

}