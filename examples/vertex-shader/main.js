import { initCanvas, scene } from "../canvas.js";

import * as THREE from "three";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { ExtendedSuperquadricBufferGeometry, SuperquadricMaterial } from "../../src/superquadricMaterial.js";


let mesh;

export function main() {

	initCanvas();
    initGUI();

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

	const geometry = new ExtendedSuperquadricBufferGeometry(1028, 512);
	const material = new SuperquadricMaterial();

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

// SETTINGS
const settings = {
	epsilon_1: 1.0,
	epsilon_2: 1.0,
};

function updateUniforms () {
	mesh.material.uniforms.epsilon1.value = settings.epsilon_1;
	mesh.material.uniforms.epsilon2.value = settings.epsilon_2;
}

function initGUI () {

    const gui = new GUI();
    gui.title("Settings");
    
    // geometry
    const geometryFolder = gui.addFolder("Geometry");
    geometryFolder.onChange(updateUniforms);
    geometryFolder.add(settings, "epsilon_1", 0, 5, 0.01);
    geometryFolder.add(settings, "epsilon_2", 0, 5, 0.01);

    // general
    gui.add({reset: function() {gui.reset();}}, "reset").name("Reset values");

}
