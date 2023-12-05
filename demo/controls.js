import {scene, mesh, helper, points, superquadric} from "./superquadric.js";

// PARAMETERS
const parameters = {
	"epsilon_1": 1.0,
	"epsilon_2": 1.0,
	"scale_x": 1.0,
	"scale_y": 1.0,
	"scale_z": 1.0,
};

function initControls() {
	for (const parameter in parameters) {
		document.getElementById(parameter + "_field").addEventListener("change", function(event) {
            updateValue(parameter, "field");
        });
		document.getElementById(parameter + "_slider").addEventListener("input", function(event) {
            updateValue(parameter, "slider");
        });
	}
}

function updateValue(id, type) {
    const value = parseFloat(document.getElementById(id + "_" + type).value);

	if (type == "field") {
		document.getElementById(id + "_slider").value = (value * 100).toFixed(2);
		document.getElementById(id + "_field").value = value.toFixed(2);
		parameters[id] = value;
	}
	else if (type == "slider") {
		document.getElementById(id + "_field").value = (value / 100).toFixed(2);
		parameters[id] = value / 100;
	}

	updateGeometry();
}

function updateGeometry() {
    scene.remove(helper);
	scene.remove(mesh);
	scene.remove(points);
	superquadric();
}

export {initControls, parameters};
