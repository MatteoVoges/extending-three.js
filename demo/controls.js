import {superquadric} from "./superquadric.js";

// PARAMETERS
const parameters = {
	"epsilon_1": 1.0,
	"epsilon_2": 1.0,
	"scale_x": 1.0,
	"scale_y": 1.0,
	"scale_z": 1.0,
	"resolution_width": 32,
	"resolution_height": 16,
	"phi_start": 0,
	"phi_length": 2,
	"theta_start": 0,
	"theta_length": 1,
	"shading": "wireframe",
	"debug_wireframe": false,
	"debug_normals": false,
	"debug_uv": false,
	"debug_bitangents": false,
};

function initControls() {

	// parameters + scale
	for (const id of ["epsilon_1", "epsilon_2", "scale_x", "scale_y", "scale_z", "phi_start", "phi_length", "theta_start", "theta_length"]) {
		document.getElementById(id + "_field").addEventListener("change", function(event) {
			const value = parseFloat(event.target.value);
            document.getElementById(id + "_slider").value = (value * 100).toFixed(2);
			document.getElementById(id + "_field").value = value.toFixed(2);
			parameters[id] = value;
			superquadric();
        });
		document.getElementById(id + "_slider").addEventListener("input", function(event) {
            document.getElementById(id + "_field").value = (event.target.value / 100).toFixed(2);
			parameters[id] = event.target.value / 100;
			superquadric();
        });
	}

	// resolution
	for (const id of ["resolution_width", "resolution_height"]) {
		document.getElementById(id + "_field").addEventListener("change", function(event) {
			const value = parseInt(event.target.value);
			document.getElementById(id + "_slider").value = value;
			document.getElementById(id + "_field").value = value.toFixed(0);
			parameters[id] = value;
			superquadric();
		});
		document.getElementById(id + "_slider").addEventListener("input", function(event) {
			document.getElementById(id + "_field").value = event.target.value;
			parameters[id] = event.target.value;
			superquadric();
		});
	}
	
	// shading
	document.getElementById("shading").addEventListener("change", function(event) {
		parameters["shading"] = event.target.value;
		superquadric();
	});
	
	// debug
	for (const id of ["debug_wireframe", "debug_normals", "debug_uv", "debug_bitangents"]) {
		document.getElementById(id).addEventListener("change", function(event) {
			parameters[id] = event.target.checked;
			superquadric();
		});
	}
}

export {initControls, parameters};
