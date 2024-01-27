// three js
import * as THREE from "three";
import {VertexNormalsHelper} from 'three/addons/helpers/VertexNormalsHelper.js';

// geometry
import {SuperquadricGeometry} from "../../src/superquadricGeometry.js";

import {scene} from "../canvas.js";

export {superquadric};

// PARAMETERS
const parameters = {
	"epsilon_1": 1.0,
	"epsilon_2": 1.0,
	"scale_x": 1.0,
	"scale_y": 1.0,
	"scale_z": 1.0,
	"resolution_width": 32,
	"resolution_height": 16,
	"phi_start": 0,
	"phi_length": 2,
	"theta_start": 0,
	"theta_length": 1,
	"shading": "wireframe",
	"debug_wireframe": false,
	"debug_normals": false,
	"debug_uv": false,
	"debug_post_uv": false,
};

const textureLoader = new THREE.TextureLoader();
const debug_texture = textureLoader.load("../resources/uv_grid_opengl.jpg");

// create superquadric
function superquadric() {

	// remove old objects
	scene.remove(scene.getObjectByName("superquadric"));
	scene.remove(scene.getObjectByName("normalHelper"));

	const geometry = new SuperquadricGeometry(
		1.0,
		parameters["epsilon_1"],  parameters["epsilon_2"], 
		parameters["resolution_width"], parameters["resolution_height"], 
		parameters["phi_start"]*Math.PI, parameters["phi_length"]*Math.PI, 
		parameters["theta_start"]*Math.PI, parameters["theta_length"]*Math.PI,
		parameters["debug_post_uv"]
	);
	
	let material = new THREE.MeshPhongMaterial({
		color: parameters["debug_uv"] || parameters["debug_post_uv"] ? 0xffffff : 0xda610b,
		side: THREE.DoubleSide,
		wireframe: parameters["debug_wireframe"],
		flatShading: parameters["shading"] == "flat" && !parameters["debug_wireframe"],
		map: parameters["debug_uv"] || parameters["debug_post_uv"] ? debug_texture : null,
	});

	const mesh = new THREE.Mesh(geometry, material);
	const points = new THREE.Points(geometry, new THREE.PointsMaterial({color: 0xfffffff, size: 0.05}));
	mesh.scale.set(parameters["scale_x"], parameters["scale_y"], parameters["scale_z"]);
	mesh.name = "superquadric";

	scene.add(mesh);

	if (parameters["debug_normals"]) {
		const normalHelper = new VertexNormalsHelper(mesh, 0.1, 0xffffff, 1);
		normalHelper.name = "normalHelper";
		scene.add(normalHelper);
	}
}
