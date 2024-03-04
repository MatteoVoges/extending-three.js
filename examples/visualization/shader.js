// three js
import * as THREE from "three";

export {DummyGeometry, SuperquadricMaterial};

const vertexShader = `
precision highp float;

attribute float epsilon1;
attribute float epsilon2;

attribute float eta;
attribute float omega;
attribute float u;

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;


const float tolerance = 1e-15;

float signed_pow(float x, float y) {
    if ( abs(round(x) - x) < tolerance ) x = round(x);

    if (x == 0.0) return 0.0;

    return sign(x) * pow(abs(x), y);
}

void main() {

    // updated position
    
    vec3 superquadricPosition;
    superquadricPosition.x = -signed_pow(sin(eta), epsilon1) * signed_pow(cos(omega), epsilon2);
    superquadricPosition.y = signed_pow(cos(eta), epsilon1);
    superquadricPosition.z = signed_pow(sin(eta), epsilon1) * signed_pow(sin(omega), epsilon2);
    if (u == 1.0) superquadricPosition.z = 0.0;

    superquadricPosition += position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(superquadricPosition, 1.0);


    // updated normal

    vec3 superquadricNormal;
    superquadricNormal.x = - signed_pow(sin(eta), 2.0 - epsilon1) * signed_pow(cos(omega), 2.0 - epsilon2);
    superquadricNormal.y = signed_pow(cos(eta), 2.0 - epsilon1);
    superquadricNormal.z = signed_pow(sin(eta), 2.0 - epsilon1) * signed_pow(sin(omega), 2.0 - epsilon2);

    vNormal = normalMatrix * superquadricNormal;

    
    // fragment shader variables

    vec4 mvPosition = modelViewMatrix * vec4(superquadricPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(superquadricPosition, 1.0)).xyz;
}
`;


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

		this.uniforms = THREE.ShaderLib[baseShader].uniforms;
	}
}
