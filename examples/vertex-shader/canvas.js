import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";


let scene, camera, renderer, stats;

// intialize canvas, camera, scene, and renderer
function initCanvas() {

    // scene
	scene = new THREE.Scene();

    // camera
	camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.001, 1000);
	camera.position.z = 3;
	camera.position.x = 1;
	camera.position.y = 1;
	camera.rotateZ(new THREE.Vector3(0, 10, 0));

    // renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setAnimationLoop(animate);
	document.body.appendChild(renderer.domElement);

    // lights
	const hemissphereLight = new THREE.HemisphereLight();
	scene.add(hemissphereLight);

	const ambientLight = new THREE.AmbientLight(0x606060, 2);
	scene.add(ambientLight);

	const pointLight = new THREE.PointLight(0xffffff, 5)
	pointLight.position.set(-2, 1, 1.5);
	scene.add(pointLight);

    // grid / background
	const grid = new THREE.GridHelper( 100, 100, 0x550000, 0x555555 );
    grid.position.y = -2;
	scene.add(grid);

	const cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.addEventListener("change", render);

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

	render();
}


export {initCanvas, frame};
