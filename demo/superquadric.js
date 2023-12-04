import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { SuperquadricGeometry } from "../src/superquadricGeometry.js";

// Three.js variables
let scene, camera, renderer, canvas, mesh;

// Initialize Three.js
init();
superquadric(1.0, 1.0);
render();

// PARAMETERS
const parameters = {
	"epsilon_1": 1.0,
	"epsilon_2": 1.0,
	"scale_x": 1.0,
	"scale_y": 1.0,
	"scale_z": 1.0,
};
initValues();

// FUNCTIONS

function render() {
  renderer.render(scene, camera);
}

function init() {
	// Create a scene
	scene = new THREE.Scene();

	// Create a camera
	camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
	camera.position.z = 2;

	// Create a renderer
	renderer = new THREE.WebGLRenderer();
	canvas = document.getElementById("canvas");
	canvas.append(renderer.domElement);
	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);

	// LIGHTS
	const ambientLight = new THREE.AmbientLight(0x7c7c7c, 3.0);
	scene.add(ambientLight);

	const light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 0, 1);
	scene.add(light);

	// CONTROLS
	const cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.addEventListener("change", render);
}

function resizeCanvas() {
	let width, height;

	if (canvas.clientWidth / canvas.clientHeight > 16 / 9) {
		width = canvas.clientHeight * (16 / 9);
		height = canvas.clientHeight;
	} else {
		width = canvas.clientWidth;
		height = canvas.clientWidth * (9 / 16);
	}

	renderer.setSize(width, height, true);
	render();
}

function superquadric(epsilon_1, epsilon_2) {

	const geometry = new SuperquadricGeometry(32, 16, epsilon_1, epsilon_2);
	const material = new THREE.MeshBasicMaterial({
		color: 0xda610b,
		wireframe: true,
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

function initValues() {
	for (const parameter in parameters) {
		document.getElementById(parameter + "_field").addEventListener("change", function(event) {
            updateValue(parameter, "field");
        });
		document.getElementById(parameter + "_slider").addEventListener("input",  function(event) {
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

	if (id.startsWith("epsilon")) {
		updateGeometry();
	}

	if (id.startsWith("scale")) {
		updateScale();
	}
}

function updateScale() {
	const scale_x = parameters["scale_x"];
	const scale_y = parameters["scale_y"];
	const scale_z = parameters["scale_z"];

	console.log(mesh)
	mesh.scale.set(scale_x, scale_y, scale_z);
	render();
}

function updateGeometry() {
	const epsilon_1 = parameters["epsilon_1"];
	const epsilon_2 = parameters["epsilon_2"];

	scene.remove(mesh);
	superquadric(epsilon_1, epsilon_2);
	render();
}
