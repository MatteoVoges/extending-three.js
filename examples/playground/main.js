import { initCanvas, scene } from "../canvas.js";

import * as THREE from "three";
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import {SuperquadricGeometry} from "../../src/superquadricGeometry.js";


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

    mesh = new THREE.Mesh();
	mesh.name = "superquadric";
    scene.add(mesh);

	updateGeometry();
	updateMaterial();
	tracePoint();
}

// SETTINGS
const settings = {
	epsilon_1: 1.0,
	epsilon_2: 1.0,

	scale_x: 1.0,
	scale_y: 1.0,
	scale_z: 1.0,

	widthSegments: 64,
	heightSegments: 32,

	phi_start: 0,
	phi_length: 2*Math.PI,

	theta_start: 0,
	theta_length: Math.PI,

	wireframe: false,
	shading: "phong",
	material: "color",
    color: "#da610b",

    texture: "debug",

    normal_helper: false,
    tangent_helper: false,
	trace_point: true,
};

function updateGeometry () {
	// build new geometry
	const geometry = new SuperquadricGeometry(
		settings.epsilon_1, settings.epsilon_2,
		settings.widthSegments, settings.heightSegments,
		settings.phi_start, settings.phi_length, 
		settings.theta_start, settings.theta_length,
		(settings.uv_mode == "sphere mapped"),
	);
	
	// apply scaling
	geometry.scale(settings.scale_x, settings.scale_y, settings.scale_z);
	
	// update mesh
	mesh.geometry.dispose();
	mesh.geometry = geometry;
	
	// update helpers
	updateHelpers();

	if (settings.trace_point) tracePoint();
}

function updateMaterial () {
	// build new material
	
	let material = new THREE.MeshPhongMaterial();
	
	// material
	if (settings.material == "color") {
		material.color.set(settings.color);
		material.side = THREE.DoubleSide;
	} else if (settings.material == "texture") {
		updateTexture(material);
	} else if (settings.material == "normal") {
		material = new THREE.MeshNormalMaterial();
	}

	// shading
	material.flatShading = (settings.shading == "flat");
	
	material.wireframe = settings.wireframe;

	// update mesh
	mesh.material.dispose();
	mesh.material = material;
}

const textureLoader = new THREE.TextureLoader();
const textureMap = new Map();

function updateTexture (material) {
	// TODO: material is updated mesh-material or string of settings.texture

	let texture;

	if (textureMap.has(settings.texture)) {
		texture = textureMap.get(settings.texture);
	} else {
		// load texture
		texture = textureLoader.load("./textures/" + settings.texture + ".jpg");
		textureMap.set(settings.texture, texture);
	}

	// update material
	if (material == null || material == settings.texture) {
		mesh.material.map = texture;
	} else {
		material.map = texture;
	}

}

function updateHelpers () {
	let normalHelper = mesh.getObjectByName("normalHelper");
	if (settings.normal_helper) {
		mesh.remove(normalHelper);
		normalHelper = new VertexNormalsHelper(mesh, 0.1);
		normalHelper.name = "normalHelper";
		mesh.add(normalHelper);
	} else {
		mesh.remove(normalHelper);
	}

	mesh.geometry.computeTangents();

	let tangentHelper = mesh.getObjectByName("tangentHelper");
	if (settings.tangent_helper) {
		mesh.remove(tangentHelper);
		tangentHelper = new VertexTangentsHelper(mesh, 0.1);
		tangentHelper.name = "tangentHelper";
		mesh.add(tangentHelper);
	} else {
		mesh.remove(tangentHelper);
	}
}

function tracePoint() {
	const positions = mesh.geometry.attributes.position.array;

	const row = 8;
	const col = 24;
	const index = (row * (settings.widthSegments + 1) + col) * 3;
	const position = new THREE.Vector3(positions[index], positions[index+1], positions[index+2]);

	const geometry = new THREE.SphereGeometry(0.01, 32, 32);
	const material = new THREE.MeshBasicMaterial({color: 0xff0000});
	const sphere = new THREE.Mesh(geometry, material);
	sphere.position.copy(position);

	scene.add(sphere);
}

function initGUI () {

    const gui = new GUI();
    gui.title("Settings");
    
    // geometry
    const geometryFolder = gui.addFolder("Geometry");
    geometryFolder.onChange(updateGeometry);

    const parametersFolder = geometryFolder.addFolder("Parameters");
    parametersFolder.add(settings, "epsilon_1", 0, 5, 0.01);
    parametersFolder.add(settings, "epsilon_2", 0, 5, 0.01);

    const scaleFolder = geometryFolder.addFolder("Scale");
    scaleFolder.add(settings, "scale_x", 0, 5, 0.1);
    scaleFolder.add(settings, "scale_y", 0, 5, 0.1);
    scaleFolder.add(settings, "scale_z", 0, 5, 0.1);

    const resolutionFolder = geometryFolder.addFolder("Resolution");
    resolutionFolder.add(settings, "widthSegments", 3, 256, 1);
    resolutionFolder.add(settings, "heightSegments", 2, 128, 1);

    const phiFolder = geometryFolder.addFolder("Phi");
    phiFolder.add(settings, "phi_start", 0, 2*Math.PI, 0.01);
    phiFolder.add(settings, "phi_length", 0, 2*Math.PI, 0.01);

    const thetaFolder = geometryFolder.addFolder("Theta");
    thetaFolder.add(settings, "theta_start", 0, Math.PI, 0.01);
    thetaFolder.add(settings, "theta_length", 0, Math.PI, 0.01);

    // material
    const material = gui.addFolder("Material");
    material.onChange(updateMaterial);

    material.add(settings, "wireframe");
    material.add(settings, "shading", ["phong", "flat"]);
    material.add(settings, "material", ["color", "normal", "texture"]);
    material.addColor(settings, "color");

    // texture
    const textureFolder = gui.addFolder("Texture");
    textureFolder.add(settings, "texture", ["debug", "basketball", "wood", "brick", "aluminium", "white marble", "dark marble"]).onChange(updateMaterial);

    // debug
    const debugFolder = gui.addFolder("Debug");
    debugFolder.add(settings, "normal_helper").onChange(updateHelpers);
    debugFolder.add(settings, "tangent_helper").onChange(updateHelpers);
	debugFolder.add(settings, "trace_point").onChange(tracePoint);

    // general
    gui.add({reset: function() {gui.reset();}}, "reset").name("Reset values");
}
