import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { SuperquadricGeometry } from "../src/superquadricGeometry.js";

let scene, camera, renderer, canvas;

function render() {
//   requestAnimationFrame(render);
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
}

function superquadric(epsilon_1, epsilon_2) {
	const geometry = new SuperquadricGeometry();
	const material = new THREE.MeshBasicMaterial({
		color: 0xda610b,
		wireframe: true,
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

init();
superquadric(0.5, 0.5);
render();
