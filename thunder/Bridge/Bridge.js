/*
===============================================================================
Autor: Juan Maturana
Fecha de Creación: 15/11/2024
===============================================================================
*/

/* 
uu = usuario
cc = compania
url = url de la funcion
pp = parametros
hh = header
*/
class Bridge{
    #usu; #com; #url; #param; #header; #ff;

    constructor(uu, cc, url, pp = [''], hh = {'Content-Type': 'application/json'}){
        this.#usu = uu;
        this.#com = cc;
        this.#url = url;
        this.#param = pp;
        this.#header = hh;
        this.urlFormat();
    }

    async databriged(){
        try {
            const response = await fetch(this.#url, {
                method: "POST",
                headers: this.#header,
                body: this.paramsFormat(),
            });

            if (response.status === 500) {
                throw new Error("Error interno del servidor");
            } else if (response.status === 400) {
                console.log("Error en la solicitud:", data.error);
            } else if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            //const contentType = response.headers.get("Content-Type");
            return response;
            /* if (
                contentType &&
                contentType.toLowerCase().includes("application/octet-stream")
            ) {
                await downloadEvent(response);
            } else if (
                contentType &&
                contentType.toLowerCase().includes("application/json")
            ) {
                // Si el contenido es JSON, analízalo
                const data = await response.json();
                
                if (data["Execute"] == "Correct") {
                    alertSucces(this.#com)
                    return;
                } else if (data["Execute"] == "Incorrect") {
                    alertError("Algo salio mal, intenta de nuevo");
                    return;
                }
                return data;
            } else {
                let data = null;
                return data; // Otra opción podría ser lanzar un error
            } */
        } catch (error) {
            console.log(error);
        }
    } 

    paramsFormat(){
        let param = JSON.stringify({
            function: this.#ff,
            args: this.#param,
            uu: this.#usu,
            cc: this.#com
        });      

        return param;
    }

    urlFormat(){
        // Ejemplo: System.Inventario.Catalogos.Articulos.getArticulos
        let url = this.#url.split(".");
        this.#ff = url.pop();
        this.#url = "http://nexthwd.pcz.com.mx:4480/thundersc/thundercloud/" + url.join("/") + ".php"; //201.149.14.230
    }

    async downloadEvent(response) {
        // Si el contenido es un archivo descargable, descárgalo directamente
        const blob = await response.blob();
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
    }
}