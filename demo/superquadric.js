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
let scene, camera, renderer, canvas, stats, mesh, helper;
export {scene, mesh, helper, superquadric};

main();

// intialize canvas, camera, scene, and renderer
function initCanvas() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
	camera.position.z = 3;
	camera.rotateZ(new THREE.Vector3(0, 10, 0));
	// camera.updateProjectionMatrix();


	renderer = new THREE.WebGLRenderer();
	canvas = document.getElementById("canvas");
	canvas.appendChild(renderer.domElement);
	window.addEventListener("resize", resizeCanvas);
	
	stats = new Stats();
	stats.domElement.style.position = 'relative';
	stats.domElement.style.top = -canvas.clientHeight + 'px';
	canvas.appendChild(stats.domElement);
	resizeCanvas();
	
	scene.add(new THREE.HemisphereLight(0x8d8c7c, 0x494966, 3));

	const grid = new THREE.GridHelper( 100, 100, 0x550000, 0x555555 );
	grid.position.y = - 2;
	scene.add(grid);

	const cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.addEventListener("change", render);
}

// create superquadric
function superquadric() {

	const epsilon_1 = parameters["epsilon_1"];
	const epsilon_2 = parameters["epsilon_2"];

	const scale_x = parameters["scale_x"];
	const scale_y = parameters["scale_y"];
	const scale_z = parameters["scale_z"];

	const geometry = new SuperquadricGeometry(64, 32, epsilon_1, epsilon_2);
	const material = new THREE.MeshBasicMaterial({
		color: 0xda610b,
		wireframe: true,
	});
	mesh = new THREE.Mesh(geometry, material);
	mesh.scale.set(scale_x, scale_y, scale_z);
	scene.add(mesh);
	
	helper = new VertexNormalsHelper(mesh, 0.1, 0xffffff, 1, false);
	scene.add(helper);
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

	superquadric(1.0, 1.0);
	
	frame();
}
