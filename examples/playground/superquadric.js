// three js
import * as THREE from "three";
import {VertexNormalsHelper} from 'three/addons/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js';

// geometry
import {SuperquadricGeometry} from "../../src/superquadricGeometry.js";

import {settings} from "./controls.js";

export {updateGeometry, updateMaterial, updateTexture, updateHelpers, initSuperquadric};


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
