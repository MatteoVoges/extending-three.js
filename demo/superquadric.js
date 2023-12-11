// three js
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import {VertexNormalsHelper} from 'three/addons/helpers/VertexNormalsHelper.js';

// geometry
import {SuperquadricGeometry} from "../src/superquadricGeometry.js";

// controls
import {initControls, parameters} from "./controls.js";

// Three.js variables
let scene, camera, renderer, canvas, stats;
export {superquadric};

main();

// intialize canvas, camera, scene, and renderer
function initCanvas() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
	camera.position.z = 3;
	camera.position.x = 1;
	camera.position.y = 1;
	camera.rotateZ(new THREE.Vector3(0, 10, 0));

	renderer = new THREE.WebGLRenderer();
	canvas = document.getElementById("canvas");
	canvas.appendChild(renderer.domElement);
	window.addEventListener("resize", resizeCanvas);
	
	stats = new Stats();
	stats.domElement.style.position = 'relative';
	stats.domElement.style.top = -canvas.clientHeight + 'px';
	canvas.appendChild(stats.domElement);
	resizeCanvas();
	
	// const hemissphereLight = new THREE.HemisphereLight(0x8d8c7c, 0x494966, 3);
	// scene.add(hemissphereLight);

	const ambientLight = new THREE.AmbientLight(0x404040, 2);
	scene.add(ambientLight);

	const pointLight = new THREE.PointLight(0xffffff, 2, 0, 2)
	pointLight.position.set(-2, 1, 1.5);
	scene.add(pointLight);

	scene.add(new THREE.PointLightHelper(scene.children[1], 0.1));

	const grid = new THREE.GridHelper( 100, 100, 0x550000, 0x555555 );
	grid.position.y = - 2;
	scene.add(grid);

	const cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.addEventListener("change", render);
}

// create superquadric
function superquadric() {

	// remove old objects
	scene.remove(scene.getObjectByName("superquadric"));
	scene.remove(scene.getObjectByName("normalHelper"));

	const geometry = new SuperquadricGeometry(parameters["epsilon_1"],  parameters["epsilon_2"], parameters["resolution_width"], parameters["resolution_height"], parameters["phi_start"]*Math.PI, parameters["phi_length"]*Math.PI, parameters["theta_start"]*Math.PI, parameters["theta_length"]*Math.PI);
	
	let material;
	if (parameters["shading"] == "wireframe") {
		material = new THREE.MeshBasicMaterial({color: 0xda610b, wireframe: true});
	} else if (parameters["shading"] == "flat") {
		material = new THREE.MeshBasicMaterial({color: 0xda610b});
	} else if (parameters["shading"] == "phong") {
		material = new THREE.MeshPhongMaterial({color: 0xda610b});
	}

	const mesh = new THREE.Mesh(geometry, material);
	mesh.scale.set(parameters["scale_x"], parameters["scale_y"], parameters["scale_z"]);
	mesh.name = "superquadric";

	scene.add(mesh);

	if (parameters["debug_normals"]) {
		const normalHelper = new VertexNormalsHelper(mesh, 0.1, 0xffffff, 1);
		normalHelper.name = "normalHelper";
		scene.add(normalHelper);
	}
}

// resize canvas on window resize
function resizeCanvas() {
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

// main render loop
function frame() {
	stats.update();
	requestAnimationFrame(frame);

	render();
}

function render() {
	renderer.render(scene, camera);
}

function main() {
	initCanvas();
	initControls();

	// initialize superquadric with default values
	superquadric();
	
	frame();
}
