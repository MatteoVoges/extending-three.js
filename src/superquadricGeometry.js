import { BufferGeometry, Vector3, Float32BufferAttribute } from "three";

class SuperquadricGeometry extends BufferGeometry {
	constructor(
		epsilon_1 = 1.0,
		epsilon_2 = 1.0,
		widthSegments = 32,
		heightSegments = 16,
		phiStart = 0,
		phiLength = Math.PI * 2,
		thetaStart = 0,
		thetaLength = Math.PI
	) {
		super();

		this.type = "SuperquadricGeometry";

		this.parameters = {
			epsilon_1: epsilon_1,
			epsilon_2: epsilon_2,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: 0,
			phiLength: Math.PI * 2,
			thetaStart: 0,
			thetaLength: Math.PI,
		};

		widthSegments = Math.max(4, Math.pow(2, Math.floor(Math.log2(widthSegments))));
		heightSegments = Math.max(2, Math.pow(2, Math.floor(Math.log2(heightSegments))));


		const thetaEnd = Math.min( thetaStart + thetaLength, Math.PI );
		
		let index = 0;
		const grid = [];

		const vertex = new Vector3();
		const normal = new Vector3();

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// generate vertices, normals and uvs

		for (let iy = 0; iy <= heightSegments; iy++) {

			const verticesRow = [];

			const v = iy / heightSegments;
			const eta = - Math.PI/2 + thetaStart + v * thetaLength;

			// uv: special case for the poles
			let uOffset = 0;
			if ( iy === 0 && thetaStart === 0 ) {
				uOffset = 0.5 / widthSegments;
			} else if ( iy === heightSegments && thetaEnd === Math.PI ) {
				uOffset = - 0.5 / widthSegments;
			}

			for (let ix = 0; ix <= widthSegments; ix++) {
				const u = (ix+1) / widthSegments;
				const omega = phiStart + u * phiLength;

				// handle edge cases correctly
				if (v == 0 || v == 1) {
					vertices.push(0, -1 + v * 2, 0);
					normals.push(0, -1 + v * 2, 0);
					verticesRow.push(index++);
					uvs.push( u + uOffset, v );
					continue;
				}
				// else if (v == 0.5 && u % 0.25 === 0) {
				// 	let x = Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength )
				// 	let z = Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength )
				// 	vertices.push(x, 0, z);
				// 	normals.push(x, 0, z);
				// 	verticesRow.push(index++);
				// 	uvs.push( u + uOffset, v );
				// 	continue;
				// }

				// vertex

				vertex.x = cos_pow(eta, epsilon_1) * cos_pow(omega, epsilon_2);
				vertex.y = sin_pow(eta, epsilon_1);
				vertex.z = cos_pow(eta, epsilon_1) * sin_pow(omega, epsilon_2);

				vertices.push(vertex.x, vertex.y, vertex.z);
				
				// normal

				normal.x = cos_pow(eta, 2 - epsilon_1) * cos_pow(omega, 2 - epsilon_2);
				normal.y = sin_pow(eta, 2 - epsilon_1);
				normal.z = cos_pow(eta, 2 - epsilon_1) * sin_pow(omega, 2 - epsilon_2);

				normal.normalize();
				normals.push(normal.x, normal.y, normal.z);

				// uv

				uvs.push( u + uOffset, v);

				verticesRow.push(index++);

			}

			grid.push(verticesRow);

		}

		// indices

		for (let iy = 0; iy < heightSegments; iy++) {

			for (let ix = 0; ix < widthSegments; ix++) {

				const a = grid[iy][ix + 1];
				const b = grid[iy][ix];
				const c = grid[iy + 1][ix];
				const d = grid[iy + 1][ix + 1];

				if ( iy == heightSegments - 1 ) {
					if (thetaEnd == Math.PI)
						indices.push( a, b, d );
				} else if ( iy == 0) {
					if (thetaStart == 0)
						indices.push( b, c, d );
				} else {
					indices.push( a, b, d );
					indices.push( b, c, d );
				}
			}
		}

		// build geometry

		this.setIndex(indices);
		this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
		this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
		this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
	}

	copy(source) {
		super.copy(source);

		this.parameters = Object.assign({}, source.parameters);

		return this;
	}

	static fromJSON(data) {
		return new SuperquadricGeometry(
			data.epsilon_1,
			data.epsilon_2,
			data.widthSegments,
			data.heightSegments,
			data.phiStart,
			data.phiLength,
			data.thetaStart,
			data.thetaLength
		);
	}
}

export { SuperquadricGeometry };

function sin_pow(angle, epsilon) {
	const sin_value = Math.sin(angle);
	return sin_value === 0 ? 0 : Math.sign(sin_value) * Math.pow(Math.abs(sin_value), epsilon);
}

function cos_pow(angle, epsilon) {
	const cos_value = Math.cos(angle);
	return cos_value === 0 ? 0 : Math.sign(cos_value) * Math.pow(Math.abs(cos_value), epsilon);
}
