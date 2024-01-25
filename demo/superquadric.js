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
let scene, camera, renderer, canvas, stats, debug_texture;
export {superquadric};

main();

// intialize canvas, camera, scene, and renderer
function initCanvas() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.001, 1000);
	camera.position.z = 3;
	camera.position.x = 1;
	camera.position.y = 1;
	camera.rotateZ(new THREE.Vector3(0, 10, 0));

	renderer = new THREE.WebGLRenderer();
	// renderer.setClearColor( 0xffffff, 1);
	canvas = document.getElementById("canvas");
	canvas.appendChild(renderer.domElement);
	window.addEventListener("resize", resizeCanvas);
	
	stats = new Stats();
	stats.domElement.style.position = 'relative';
	stats.domElement.style.top = -canvas.clientHeight + 'px';
	canvas.appendChild(stats.domElement);
	resizeCanvas();
	
	const hemissphereLight = new THREE.HemisphereLight();
	scene.add(hemissphereLight);

	const ambientLight = new THREE.AmbientLight(0x606060, 2);
	scene.add(ambientLight);

	const pointLight = new THREE.PointLight(0xffffff, 5)
	pointLight.position.set(-2, 1, 1.5);
	scene.add(pointLight);

	const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.01);
	scene.add(pointLightHelper);

	const grid = new THREE.GridHelper( 100, 100, 0x550000, 0x555555 );
	grid.position.y = - 2;
	scene.add(grid);

	const textureLoader = new THREE.TextureLoader();
	debug_texture = textureLoader.load("uv_grid_opengl.jpg");

	const cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.addEventListener("change", render);
}

// create superquadric
function superquadric() {

	// remove old objects
	scene.remove(scene.getObjectByName("superquadric"));
	scene.remove(scene.getObjectByName("normalHelper"));

	const geometry = new SuperquadricGeometry(
		1.0,
		parameters["epsilon_1"],  parameters["epsilon_2"], 
		parameters["resolution_width"], parameters["resolution_height"], 
		parameters["phi_start"]*Math.PI, parameters["phi_length"]*Math.PI, 
		parameters["theta_start"]*Math.PI, parameters["theta_length"]*Math.PI,
		parameters["debug_post_uv"]
	);
	
	let material = new THREE.MeshPhongMaterial({
		color: parameters["debug_uv"] || parameters["debug_post_uv"] ? 0xffffff : 0xda610b,
		side: THREE.DoubleSide,
		wireframe: parameters["debug_wireframe"],
		flatShading: parameters["shading"] == "flat" && !parameters["debug_wireframe"],
		map: parameters["debug_uv"] || parameters["debug_post_uv"] ? debug_texture : null,
	});

	const mesh = new THREE.Mesh(geometry, material);
	const points = new THREE.Points(geometry, new THREE.PointsMaterial({color: 0xfffffff, size: 0.05}));
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

	stats.domElement.style.top = -canvas.clientHeight + 'px';
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
