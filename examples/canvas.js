import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";


export let scene, camera, cameraControls, renderer, stats;

// intialize canvas, camera, scene, and renderer
export function initCanvas(animate = () => {}) {

    // scene
	scene = new THREE.Scene();

    // camera
	camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.001, 1000);
	camera.position.z = 3;
	camera.position.x = 1;
	camera.position.y = 1;
	camera.rotateZ(new THREE.Vector3(0, 10, 0));

    // renderer
	renderer = new THREE.WebGLRenderer({ antialias: true, precision: "highp" });

	renderer.setAnimationLoop(() => {
		stats.update();
		animate()	// call the animate function;
		render();
	});

	setBackgroundColor();
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);

	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.addEventListener("change", render);

    // stats
	stats = new Stats();
	document.body.appendChild(stats.dom);
    
    // resize canvas with window
    window.addEventListener("resize", resizeCanvas);
	resizeCanvas();

	// register clean up callback
	window.addEventListener("beforeunload", cleanUp);

    render();
}

// resize canvas on window resize
function resizeCanvas() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

// set background color
function setBackgroundColor() {
	let backgroundColor = 0xffffff;

	let darkTheme = parent.document.getElementById("theme-switch");
	darkTheme = darkTheme != null ? darkTheme.checked : false;
	if (darkTheme) backgroundColor = 0x000000;

	renderer.setClearColor(new THREE.Color(backgroundColor), 1);
}
window.setBackgroundColorCallback = setBackgroundColor;

// render scene
function render() {
    renderer.render(scene, camera);
}

function cleanUp() {
	renderer.setAnimationLoop(null);
	renderer.dispose();
}