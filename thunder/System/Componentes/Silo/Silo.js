class Silo {
  constructor(
    div = "#div-silo-level",
    nombre = "SiloSensor",
    alias = "Nivel del Silo",
    distance = 10, // Distancia inicial (ej. 10m, vacío)
    siloHeight = 10, // Altura total del silo (ej. 10m)
    unit = "m",
    withInputs = true, // Activamos inputs para prueba
    reload = true,
    socket_port = 3000
  ) {
    this.div = div;
    this.distance = distance;
    this.siloHeight = siloHeight;
    this.unit = unit;
    this.nombre = nombre;
    this.alias = alias;
    this.reload = reload;
    this.socket_port = socket_port;
    this.withInputs = withInputs;

    this.setSiloComponent();
  }

  setSiloLevel(currentDistance = this.distance) {
    this.distance = currentDistance;

    // 1. Cálculo del Porcentaje (La lógica de llenado es la misma)
    const filledLevel = this.siloHeight - this.distance;
    const clampedLevel = Math.max(0, Math.min(this.siloHeight, filledLevel));
    const percent = (clampedLevel / this.siloHeight) * 100;

    // 2. Aplicar la altura con animación
    this.niveauDiv.css("height", percent + "%");

    // 3. Actualizar la etiqueta del porcentaje
    this.pourcentDiv.text(percent.toFixed(1) + "%");
    this.pourcentDiv.attr("data-value", percent.toFixed(1) + "%");
    this.distanceDisplay.text(
      `Distancia: ${this.distance.toFixed(2)} ${this.unit}`
    );

    // 4. Lógica de COLORES DINÁMICOS y clases del CSS:
    this.contenuDiv.removeClass("plein intermediaire vide");

    if (percent >= 60) {
      this.contenuDiv.addClass("plein");
    } else if (percent > 15) {
      this.contenuDiv.addClass("intermediaire");
    } else {
      this.contenuDiv.addClass("vide");
    }
  }
  setSiloComponent() {
    const uniqueID = "silo-" + Math.random().toString(36).substring(2, 9);
    const rangeMax = this.siloHeight;
    const rangeMin = 0;

    const html = `
        <div class="silo-wrapper" id="${uniqueID}">
            <div class="silo">
                <div class="silo-chapeau"></div>
                
                <div class="silo-bordure-ext">
                    <div class="silo-bordure-int">
                        <div class="silo-contenu">
                            <div class="niveau"></div>
                            <div class="pourcent" data-value="0%">0%</div>
                        </div>
                    </div>
                </div>

                <div class="silo-pied"></div>
            </div>

            <div class="info-permi" style="color: #000;">
                <p class="unit">${this.alias}</p>
                <button class="icon-permi ${
                  !this.reload ? "d-none" : ""
                } reload-silo">
                    <i class="bi bi-arrow-repeat"></i>
                </button>
            </div>
            <p class="distance-display" style="display: none;" id="distance-${uniqueID}">Distancia: ${
      this.distance
    } ${this.unit}</p>
            
            <div class="playground ${!this.withInputs ? "d-none" : ""}">
                <label for="rangeInput-${uniqueID}">Simular Distancia (${rangeMin} a ${rangeMax} ${
      this.unit
    })</label>
                <input class="rangeInput" id="rangeInput-${uniqueID}" type="range" 
                    min="${rangeMin}" max="${rangeMax}" step="0.1" 
                    value="${this.distance}">
            </div>
        </div>
        `;

    $(this.div).append(html);

    const root = $(`#${uniqueID}`);
    this.niveauDiv = root.find(".niveau"); 
    this.pourcentDiv = root.find(".pourcent"); 
    this.contenuDiv = root.find(".silo-contenu");

    this.rangeInput = root.find(".rangeInput");
    this.distanceDisplay = root.find(`#distance-${uniqueID}`);

    this.rangeInput.on("input", (e) =>
      this.setSiloLevel(parseFloat($(e.target).val()))
    );

    this.setSiloLevel(this.distance);
    this.reloadSilo(uniqueID);
  }

  // Simulación de recarga (sustituye a tu lógica de sockets/API)
  reloadSilo(uniqueID) {
    $(`#${uniqueID} .reload-silo`).on("click", () => {
      $("body").css("cursor", "wait");
      
      const newDistance = Math.random() * this.siloHeight;

      // En un proyecto real, aquí llamarías a this.updateSockets() y luego a this.getUltDistance()

      setTimeout(() => {
        this.distance = newDistance; 
        this.rangeInput.val(newDistance); 
        this.setSiloLevel(newDistance); 
        $("body").css("cursor", "default");
      }, 1500);
    });
  }

  // Aquí irían tus métodos updateSockets y getUltDistance modificados
  // para obtener la distancia en lugar de la temperatura

  // getUltDistance() { ... }
  // updateSockets() { ... }

  updateSockets() {
    let sensores = this.nombre;
    sensores += "*web";
    let bridge = new Bridge(uu, cc, "Sockets.SocketConnection.socketHTTP", [
      sensores,
      this.socket_port,
    ]);
    let response = bridge.databriged();

    response
      .then((response) => response.json())
      .then((data) => {
        if (data.event > 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.result,
          });
        } else {
        }
        setTimeout(() => {
          this.getUltTemp();
        }, 6000);
      });
  }

  getUltTemp() {
    let bridge = new Bridge(
      uu,
      cc,
      "System.Dashboard.Sensores.SensoresTempService.getUltTemp",
      [this.nombre]
    );
    let response = bridge.databriged();

    response
      .then((response) => response.json())
      .then((data) => {
        if (data.event > 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.result,
          });
        } else {
          data = data.result;
          data.forEach((item) => {
            this.temperature = item.temp;
          });
        }
      });
  }
}
