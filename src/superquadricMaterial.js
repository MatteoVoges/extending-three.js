import * as THREE from "three";

export class ExtendedSuperquadricBufferGeometry extends THREE.BufferGeometry {
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
		const normals = [];

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
				normals.push(vertex.x, vertex.y, vertex.z);

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
		this.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
		this.setAttribute("eta", new THREE.Float32BufferAttribute(etaBuffer, 1));
		this.setAttribute("omega", new THREE.Float32BufferAttribute(omegaBuffer, 1));
		this.setAttribute("u", new THREE.Float32BufferAttribute(uBuffer, 1));
	}
}

const vertexShader = await fetch("/src/superquadricShader.glsl").then(response => response.text());

export class SuperquadricMaterial extends THREE.ShaderMaterial {
	constructor (parameters) {
		super(parameters);

		this.type = "SuperquadricMaterial";

		// fetch vertex shader
		this.vertexShader = vertexShader;
		this.fragmentShader = THREE.ShaderLib.phong.fragmentShader;

		this.lights = true;

		this.uniforms = THREE.UniformsUtils.merge([
			THREE.ShaderLib.phong.uniforms,
			{diffuse: { value: new THREE.Color(0xda610b)}},
			{epsilon1: { value: 1.0 }, epsilon2: { value: 1.0 }}
		]);
	}
}


const instancedVertexShader = await fetch("/src/superquadricInstanceShader.glsl").then(response => response.text()); 

export class SuperquadricInstanceMaterial extends THREE.ShaderMaterial {
	constructor (parameters) {
		super(parameters);

		this.type = "SuperquadricInstanceMaterial";

		// fetch vertex shader
		this.vertexShader = instancedVertexShader;
		this.fragmentShader = THREE.ShaderLib.phong.fragmentShader;
		this.lights = true;
		this.uniforms = THREE.ShaderLib.phong.uniforms;
	}
}
