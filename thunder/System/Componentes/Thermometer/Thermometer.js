class Thermometer {
    
	constructor(
		div = "#div-thermometer",
		nombre = "Thermometer",
		alias = "Thermometer",
		temperature = 50,
		minTemperature = -10,
		maxTemperature = 100,
		withInputs = false,
		unit = 'Fahrenheit',
		reload = false,
		height = 100,
		width = 20,
	) {
		this.div = div;
		this.temperature = temperature;
		this.minTemperature = minTemperature;
		this.maxTemperature = maxTemperature;
		this.withInputs = withInputs;
		this.height = height;
		this.width = width;
		this.unit = unit;
		this.nombre = nombre;
		this.alias = alias;
		this.reload = reload;

		this.config = {
			minTemp: this.minTemperature,
			maxTemp: this.maxTemperature,
			unit: this.unit
		};

		this.units = Thermometer.getUnits();
		this.setThermometer();
	}

	static getUnits() {
		return {
			Celcius: "°C",
			Fahrenheit: "°F"
		};
	}

	setTemperature() {
		const val = parseFloat(this.rangeInput.val());
		const percent = ((val - this.config.minTemp) / (this.config.maxTemp - this.config.minTemp)) * 100;

		this.temperatureDiv.css("height", percent + "%");
		this.temperatureDiv.attr("data-value", val + this.units[this.config.unit]);
	}

	setThermometer() {
		// Crear un ID único para cada instancia
		const uniqueID = 'thermo-' + Math.random().toString(36).substring(2, 9);

		const html = `
			<div class="thermometer-wrapper" id="${uniqueID}">
				<div class="termometer">
					<div class="temperature" style="height:0" data-value="0°C"></div>
					<div class="graduations"></div>
				</div>

				<div class="info-permi">
					<p class="unit" style="color: #000;">${this.alias}</p>
					<button class="icon-permi ${!this.reload ? 'd-none' : ''} reload-thermometer">
						<i class="bi bi-arrow-repeat"></i>
					</button>
				</div>
				<div class="playground">
					<div class="range">
						<input class="minTemp" type="text" value="${this.temperature}">
						<input class="rangeInput" type="range" min="${this.minTemperature}" max="${this.maxTemperature}" value="${this.temperature}">
						<input class="maxTemp" type="text" value="${this.maxTemperature}">
					</div>
				</div>
			</div>
		`;


		$(this.div).append(html);


		// Guardar referencias internas a los elementos
		const root = $(`#${uniqueID}`);
		this.temperatureDiv = root.find(".temperature");
		this.rangeInput = root.find(".rangeInput");
		this.unitDisplay = root.find(".unit");

		// Configurar eventos
		this.rangeInput.on("input", () => this.setTemperature());
        $(".playground").hide();

		// Inicializar temperatura
		this.setTemperature();
		this.reloadThermometer(uniqueID);
	}

	reloadThermometer(uniqueID) {
		$(`#${uniqueID} .reload-thermometer`).on("click", () => {
			$("body").css("cursor", "wait");
			//$(`#${uniqueID} .rangeInput`).val(5);
			this.updateSockets();

			setTimeout(() => {
				$(`#${uniqueID} .rangeInput`).val(this.temperature);
				$(`#${uniqueID} .rangeInput`).trigger("change");
				this.setTemperature();
				getDataChartLines();
				$("body").css("cursor", "default");
			}, 6500);
		})
	}

	updateSockets() {
		let sensores = this.nombre;
		sensores += "*web";
		let bridge = new Bridge(uu, cc, "Sockets.SocketConnection.socketHTTP", [sensores]);
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
				
			}
			setTimeout(() => {
				this.getUltTemp();
			}, 6000);
			});
	}

	getUltTemp() {
		let bridge = new Bridge(uu, cc, "System.Dashboard.Sensores.SensoresTempService.getUltTemp", [this.nombre]);
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
			  data = data.result;
			  data.forEach(item => {
				this.temperature = item.temp;
			  });
			
			}
		  });
	  }
}
