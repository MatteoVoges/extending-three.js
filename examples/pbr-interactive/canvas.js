import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";


let renderer, scene, camera, cameraControls, stats;

// intialize canvas, camera, scene, and renderer
function initCanvas() {

    // renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setAnimationLoop(animate);
	document.body.appendChild(renderer.domElement);

    // scene
	scene = new THREE.Scene();

    // camera
	camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.001, 1000);
	camera.position.z = 3;

	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.addEventListener("change", render);
    cameraControls.autoRotate = true;
    cameraControls.autoRotateSpeed = 0.5;

    // lights
	const ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);

    const particleLight = new THREE.Mesh(
        new THREE.SphereGeometry( .05, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    particleLight.name = "particleLight";
    scene.add(particleLight);

    particleLight.add( new THREE.PointLight( 0xffffff, 30 ) );

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

    // update particle
    const timer = Date.now() * 0.00025;
    const particleLight = scene.getObjectByName("particleLight");
    particleLight.position.x = Math.sin( timer * 3 ) * 3;
    particleLight.position.y = Math.cos( timer * 5 ) * 3;
    particleLight.position.z = Math.cos( timer * 3 ) * 3;

    // update camera controls
    cameraControls.update();

	render();
}


export {initCanvas, frame, scene, cameraControls};
