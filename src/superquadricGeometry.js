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

		widthSegments = Math.max(4, Math.floor(widthSegments));
		heightSegments = Math.max(3, Math.floor(heightSegments));

		const thetaEnd = Math.min( thetaStart + thetaLength, Math.PI );
		
		let index = 0;
		const grid = [];

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];

		// generate vertices

		for (let iy = 0; iy <= heightSegments; iy++) {
			const verticesRow = [];

			const v = iy / heightSegments;
			const eta = thetaStart - Math.PI/2 + v * thetaLength;

			for (let ix = 0; ix <= widthSegments; ix++) {
				const u = (ix+1) / widthSegments;
				const omega = phiStart + u * phiLength;

				// handle poles correctly
				if (v == 0 || v == 1) {
					vertices.push(0, -1 + v * 2, 0);
					normals.push(0, -1 + v * 2, 0);
					verticesRow.push(index++);
					continue;
				}

				// vertex
				let vertex = new Vector3();
				vertex.x = cos_epsilon(eta, epsilon_1) * cos_epsilon(omega, epsilon_2);
				vertex.y = sin_epsilon(eta, epsilon_1);
				vertex.z = cos_epsilon(eta, epsilon_1) * sin_epsilon(omega, epsilon_2);

				vertices.push(vertex.x, vertex.y, vertex.z);
				
				// normal
				let normal = new Vector3();
				normal.x = cos_epsilon(eta, 2 - epsilon_1) * cos_epsilon(omega, 2 - epsilon_2);
				normal.y = sin_epsilon(eta, 2 - epsilon_1);
				normal.z = cos_epsilon(eta, 2 - epsilon_1) * sin_epsilon(omega, 2 - epsilon_2);
				
				normals.push(normal.x, normal.y, normal.z);

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
		this.setAttribute("position", new Float32BufferAttribute(vertices.flat(), 3));
		this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
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

function sin_epsilon(angle, epsilon) {
	const sin_value = Math.sin(angle);
	return Math.sign(sin_value) * Math.pow(Math.abs(sin_value), epsilon);
}

function cos_epsilon(angle, epsilon) {
	const cos_value = Math.cos(angle);
	return Math.sign(cos_value) * Math.pow(Math.abs(cos_value), epsilon);
}
