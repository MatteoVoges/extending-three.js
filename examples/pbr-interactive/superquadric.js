// three js
import * as THREE from "three";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// geometry
import {SuperquadricGeometry} from "../../src/superquadricGeometry.js";

import {settings} from "./controls.js";
import {cameraControls, scene} from "./canvas.js";

export {initSuperquadric, updateGeometry, updateMaterial, updateEnvironment, updateCamera};


let mesh;

function initSuperquadric () {

	mesh = new THREE.Mesh();
	mesh.name = "superquadric";

	updateGeometry();
	updateMaterial();

	return mesh;
}

function updateGeometry () {
	// build new geometry
	const geometry = new SuperquadricGeometry(
		settings.epsilon_1, settings.epsilon_2,
		128, 64, 0, 2*Math.PI, 0, Math.PI, true,
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
