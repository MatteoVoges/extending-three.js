// three js
import * as THREE from "three";

import {SuperquadricGeometry} from "../../src/superquadricGeometry.js";

import {settings} from "./controls.js";

// shader
import {vertexShader} from "./shader.js";

export {initSuperquadric, updateUniforms};


class DummyGeometry extends THREE.BufferGeometry {
	constructor (widthSegments = 32, heightSegments = 16) {
		super();

		this.type = "DummyGeometry";

		this.parameters = {
			widthSegments: widthSegments,
			heightSegments: heightSegments
		};

		let index = 0;
		const grid = [];

		// buffers

		const indices = [];
		const vertices = [];

		const etaBuffer = [];
		const omegaBuffer = [];
		const uBuffer = [];

		// generate vertices, normals and uvs

		for (let iy = 0; iy <= heightSegments; iy++) {

			const verticesRow = [];

			const v = iy / heightSegments;
			const eta = v * Math.PI;
			
			for (let ix = 0; ix <= widthSegments; ix++) {
				
				const u = ix / widthSegments;
				const omega = u * 2 * Math.PI;

				const vertex = new THREE.Vector3();

				vertex.x = - Math.cos(omega) * Math.sin(eta);
				vertex.y = Math.cos(eta);
				vertex.z = Math.sin(omega) * Math.sin(eta);
				
				vertices.push(vertex.x, vertex.y, vertex.z);

				etaBuffer.push(eta);
				omegaBuffer.push(omega);

				uBuffer.push(u === 1 ? 1.0 : 0.0);
				
				verticesRow.push(index++);
			}

			grid.push(verticesRow);

		}

		for (let iy = 0; iy < heightSegments; iy++) {

			for (let ix = 0; ix < widthSegments; ix++) {

				const a = grid[iy][ix + 1];
				const b = grid[iy][ix];
				const c = grid[iy + 1][ix];
				const d = grid[iy + 1][ix + 1];

				if ( iy !== 0 ) indices.push( a, b, d );
				if ( iy !== heightSegments - 1 ) indices.push( b, c, d );
			}
		}
		this.setIndex(indices);
		this.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		this.setAttribute("eta", new THREE.Float32BufferAttribute(etaBuffer, 1));
		this.setAttribute("omega", new THREE.Float32BufferAttribute(omegaBuffer, 1));
		this.setAttribute("u", new THREE.Float32BufferAttribute(uBuffer, 1));
	}
}

class SuperquadricMaterial extends THREE.ShaderMaterial {
	constructor (parameters) {
		super(parameters);

		const baseShader = "basic";

		this.type = "SuperquadricMaterial";

		this.vertexShader = vertexShader;
		this.fragmentShader = THREE.ShaderLib[baseShader].fragmentShader;

		this.uniforms = THREE.UniformsUtils.merge([
			THREE.ShaderLib[baseShader].uniforms, 
			{epsilon_1: { value: 1.0 }, epsilon_2: { value: 1.0 }}
		]);
	}
}


let mesh;

function initSuperquadric () {

	const geometry = new DummyGeometry(1028, 512);
	const material = new SuperquadricMaterial();

	mesh = new THREE.Mesh(geometry, material);

	return mesh;
}

function updateUniforms () {
	mesh.material.uniforms.epsilon_1.value = settings.epsilon_1;
	mesh.material.uniforms.epsilon_2.value = settings.epsilon_2;
}
