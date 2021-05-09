const formEl = document.querySelector("form");
const codeEl = document.querySelector("#code");
const clearCodeButtonEl = document.querySelector("#clear-code");

const turtlesEl = document.querySelector("#turtles");
const refreshButtonEl = document.querySelector("#refresh-turtles");

const presetListEl = document.querySelector("#presets");
const loadPresetButtonEl = document.querySelector("#load-preset");
const clearPresetsButtonEl = document.querySelector("#clear-presets");

const presetNameEl = document.querySelector("#preset-name");
const savePresetButtonEl = document.querySelector("#save-preset");

let turtles = [];
let presets = [];

function updateTurtles() {
	(async () => {
		const req = await fetch("/api/turtles");
		if (!req.ok) return new Error("brok");
		const data = await req.json();
		turtles = data;
		turtlesEl.innerHTML = "";
		if (turtles.length > 0) {
			turtles.map((turtle) => {
				const el = document.createElement("option");
				el.innerText = `${turtle.name} (#${turtle.id})`;
				el.setAttribute("value", turtle.id);
				turtlesEl.appendChild(el);
			});
		} else {
			alert("No connected turtles!");
		}
	})();
}

function handleFormSubmit(e) {
	e.preventDefault();
	const code = codeEl.value.trim();
	if (code.length > 0) {
		const turtleID = turtlesEl.value;
		(async () => {
			const res = await fetch("/api/eval", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: code, turtleID: turtleID })
			});
			if (res.ok) {
				const data = await res.json();
				console.log(data);
			}
		})();
	}
}

function updateCodePresets() {
	const rawPresets = localStorage.getItem("turtleCodePresets");
	if (rawPresets) {
		presets = JSON.parse(rawPresets);
		presetListEl.innerHTML = "";
		if (presets.length > 0) {
			for (preset of presets) {
				const el = document.createElement("option");
				el.value = preset.id;
				el.innerText = preset.name;
				presetListEl.appendChild(el);
			}
		}
	}
}

function loadPreset() {
	const preset = presets.find((p) => p.id == presetListEl.value);
	if (preset) codeEl.value = preset.code;
}

function savePreset() {
	const presetName = presetNameEl.value;
	const presetID = presetName.toLowerCase().replace(" ", "-");
	if (presets.find((p) => p.id == presetID)) return;
	presets.unshift({ id: presetID, name: presetName, code: codeEl.value });
	localStorage.setItem("turtleCodePresets", JSON.stringify(presets));
	presetNameEl.value = "";
	updateCodePresets();
}

function clearPresets() {
	presets = [];
	localStorage.removeItem("turtleCodePresets");
	presetListEl.innerHTML = "";
}

function clearCode() {
	codeEl.value = "";
}

async function run() {
	updateCodePresets();

	await updateTurtles();
	const form = document.querySelector("form");
	form.addEventListener("submit", handleFormSubmit);
	clearCodeButtonEl.addEventListener("click", clearCode);

	refreshButtonEl.addEventListener("click", updateTurtles);

	loadPresetButtonEl.addEventListener("click", loadPreset);
	savePresetButtonEl.addEventListener("click", savePreset);
	clearPresetsButtonEl.addEventListener("click", clearPresets);
}
run();
