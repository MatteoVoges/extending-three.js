import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { initCanvas, scene, cameraControls } from '../canvas.js';

import * as THREE from "three";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import {SuperquadricGeometry} from "../../src/superquadricGeometry.js";


let mesh;

export function main() {
    initCanvas(animate);
    initGUI();

    // lights
    const ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);
    
    const particleLight = new THREE.Mesh(
        new THREE.SphereGeometry( .05, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xdddddd } )
    );
    particleLight.name = "particleLight";
    particleLight.add( new THREE.PointLight( 0xffffff, 30 ) );
    scene.add(particleLight);
    
    // camera controls
    cameraControls.autoRotateSpeed = 0.5;

    mesh = new THREE.Mesh();
	mesh.name = "superquadric";

	updateGeometry();
	updateMaterial();
    updateCamera();

	scene.add(mesh);
}

// SETTINGS
const settings = {
	epsilon_1: 1.0,
	epsilon_2: 1.0,

    color: "#da610b",
    roughness: 0.0,
    metalness: 0.0,

    environment: "none",
    show_env: true,

    auto_rotate: true,
};

function updateGeometry () {
	// build new geometry
	const geometry = new SuperquadricGeometry(
		settings.epsilon_1, settings.epsilon_2,
		128, 64, 0, 2*Math.PI, 0, Math.PI,
	);
	
	// update mesh
	mesh.geometry.dispose();
	mesh.geometry = geometry;
}

function updateMaterial () {
	// build new material
	
	const material = new THREE.MeshStandardMaterial({
		color: settings.color,
		roughness: settings.roughness,
		metalness: settings.metalness,
	});

	// update mesh
	mesh.material.dispose();
	mesh.material = material;
}

const rgbeLoader = new RGBELoader().setPath( './environments/' );
const environmentMap = new Map();

function updateEnvironment () {
	// load environment
	if (settings.environment === "none") {
		scene.background = null;
		scene.environment = null;
		return;
	}

	if (environmentMap.has(settings.environment)) {
		const texture = environmentMap.get(settings.environment);
		scene.background = settings.show_env ? texture : null;
		scene.environment = texture;
		return;
	}

	rgbeLoader.load(settings.environment + ".hdr", function (texture) {
		texture.mapping = THREE.EquirectangularReflectionMapping;

		scene.background = settings.show_env ? texture : null;
		scene.environment = texture;

		environmentMap.set(settings.environment, texture);
	});
}

function updateCamera () {
	cameraControls.autoRotate = settings.auto_rotate;
}

function initGUI () {

    const gui = new GUI();
    gui.title("Settings");
    
    // geometry
    const geometryFolder = gui.addFolder("Geometry");
    geometryFolder.onChange(updateGeometry);
    geometryFolder.add(settings, "epsilon_1", 0, 5, 0.01);
    geometryFolder.add(settings, "epsilon_2", 0, 5, 0.01);

    // material
    const materialFolder = gui.addFolder("Material");
    materialFolder.onChange(updateMaterial);
    materialFolder.addColor(settings, "color");
    materialFolder.add(settings, "roughness", 0, 1, 0.01);
    materialFolder.add(settings, "metalness", 0, 1, 0.01);

    // environment
    const environmentFolder = gui.addFolder("Environment");
    environmentFolder.onChange(updateEnvironment);
    environmentFolder.add(settings, "environment", ["none", "blouberg", "moonless", "pedestrian overpass", "quarry", "royal esplanade", "san giuseppe", "venice"]);
    environmentFolder.add(settings, "show_env").name("Show Background");

    // camera
    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.onChange(updateCamera);
    cameraFolder.add(settings, "auto_rotate");

    // general
    gui.add({reset: function () {gui.reset();}}, "reset").name("Reset values");

}

function animate () {

    cameraControls.update();

    // update particle
    const timer = Date.now() * 0.00025;
    const particleLight = scene.getObjectByName("particleLight");
    particleLight.position.x = Math.sin( timer * 3 ) * 3;
    particleLight.position.y = Math.cos( timer * 5 ) * 3;
    particleLight.position.z = Math.cos( timer * 3 ) * 3;
}
