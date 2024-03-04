// three js
import * as THREE from "three";

import {SuperquadricGeometry} from "../../src/superquadricGeometry.js";

import {settings} from "./controls.js";

// shader
import {vertexShader} from "./shader.js";

export {initSuperquadric, updateUniforms};

const etaBuffer = [];
const omegaBuffer = [];


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
	}
}


let mesh;

function initSuperquadric () {
	mesh = new THREE.Mesh();

	const shader = "basic";

	const geometry = new DummyGeometry(16, 8);

	geometry.setAttribute("eta", new THREE.Float32BufferAttribute(etaBuffer, 1));
	geometry.setAttribute("omega", new THREE.Float32BufferAttribute(omegaBuffer, 1));

	const uniforms = {
		epsilon_1: { value: settings.epsilon_1 },
		epsilon_2: { value: settings.epsilon_2 }
	};

	const shaderMaterial = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: THREE.ShaderLib[shader].fragmentShader,
		uniforms: THREE.UniformsUtils.merge([THREE.ShaderLib[shader].uniforms, uniforms])
	});

	mesh = new THREE.Mesh(geometry, shaderMaterial);

	return mesh;
}

function updateUniforms () {
	mesh.material.uniforms.epsilon_1.value = settings.epsilon_1;
	mesh.material.uniforms.epsilon_2.value = settings.epsilon_2;
}
