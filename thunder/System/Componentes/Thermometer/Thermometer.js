class Thermometer {
    
	constructor(
		div = "#div-thermometer",
		nombre = "Thermometer",
		temperature = 50,
		minTemperature = -10,
		maxTemperature = 100,
		withInputs = false,
		height = 100,
		width = 20,
		unit = 'Fahrenheit'
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

                <p class="unit" style="color: #000;">${this.nombre}</p>
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
	}
}
