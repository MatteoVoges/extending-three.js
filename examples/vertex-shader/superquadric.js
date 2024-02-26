// three js
import * as THREE from "three";
import {VertexNormalsHelper} from 'three/addons/helpers/VertexNormalsHelper.js';

import {SuperquadricGeometry} from "../../../src/superquadricGeometry.js";


// shaders
import {fragmentShader, vertexShader} from "./shaders.js";

import {settings} from "./controls.js";

export {initSuperquadric, updateUniforms, updateHelpers};


let mesh, normalHelper;

function initSuperquadric () {
	mesh = new THREE.Mesh();
	mesh.name = "superquadric";

	const geometry = new SuperquadricGeometry(1, 1, 32, 32);

	const shaderMaterial = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: {
			epsilon_1: { value: settings.epsilon_1 },
			epsilon_2: { value: settings.epsilon_2 }
		}
	});

	mesh = new THREE.Mesh(geometry, shaderMaterial);

	return mesh;
}

function updateUniforms () {
	mesh.material.uniforms.epsilon_1.value = settings.epsilon_1;
	mesh.material.uniforms.epsilon_2.value = settings.epsilon_2;
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
}
