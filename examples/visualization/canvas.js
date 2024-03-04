import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { animate } from "./superquadric.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


let scene, camera, renderer, stats;

// intialize canvas, camera, scene, and renderer
function initCanvas() {

    // scene
	scene = new THREE.Scene();

    // camera
	camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.001, 1000);
    camera.position.set(0, 30, 0);

    // renderer
	renderer = new THREE.WebGLRenderer();
	renderer.precision = "highp";
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setAnimationLoop(frame);
	document.body.appendChild(renderer.domElement);

    const cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.addEventListener("change", render);

    // lights
	const hemissphereLight = new THREE.HemisphereLight();
	scene.add(hemissphereLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    // stats
	stats = new Stats();
	document.body.appendChild(stats.dom);
    
    // resize canvas with window
    window.addEventListener("resize", resizeCanvas);
	resizeCanvas();

	return scene;

}

// resize canvas on window resize
function resizeCanvas() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

// render scene
function render() {
    renderer.render(scene, camera);
}

// main render loop
function frame() {
	stats.update();

    animate();

	render();
}


export {initCanvas, frame, scene};
