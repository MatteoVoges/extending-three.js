import { BufferGeometry, Vector3, Float32BufferAttribute } from "three";

// avoid floating point precision errors
const tolerance = 1e-15;

function signed_pow(x, y) {
	// round to next integer
	if ( Math.abs(Math.round(x) - x) < tolerance ) x = Math.round(x);

	// avoid NaN (0 ** y if y < 0 )
	if (x === 0) return 0;

	return Math.sign(x) * Math.pow(Math.abs(x), y);
}

class SuperquadricGeometry extends BufferGeometry {
	constructor(
		radius = 1,
		epsilon_1 = 1.0,
		epsilon_2 = 1.0,
		widthSegments = 32,
		heightSegments = 16,
		phiStart = 0,
		phiLength = Math.PI * 2,
		thetaStart = 0,
		thetaLength = Math.PI,
		post_uv = false,
	) {

		super();

		this.type = "SuperquadricGeometry";

		this.parameters = {
			radius: radius,
			epsilon_1: epsilon_1,
			epsilon_2: epsilon_2,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength,
			post_uv: post_uv,
		};

		// round to the next power of 2
		widthSegments = Math.max( 3, Math.floor( widthSegments ) );
		heightSegments = Math.max( 2, Math.floor( heightSegments ) );


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
			const eta = thetaStart + v * thetaLength;

			for (let ix = 0; ix <= widthSegments; ix++) {

				const u = ix / widthSegments;
				const omega = phiStart + u * phiLength;

				// vertex

				vertex.x = - radius * signed_pow(Math.sin(eta), epsilon_1) * signed_pow(Math.cos(omega), epsilon_2);
				vertex.y = radius * signed_pow(Math.cos(eta), epsilon_1);
				vertex.z = radius * signed_pow(Math.sin(eta), epsilon_1) * signed_pow(Math.sin(omega), epsilon_2);

				vertices.push(vertex.x, vertex.y, vertex.z);

				// normal

				normal.x = - signed_pow(Math.sin(eta), 2 - epsilon_1) * signed_pow(Math.cos(omega), 2 - epsilon_2);
				normal.y = signed_pow(Math.cos(eta), 2 - epsilon_1);
				normal.z = signed_pow(Math.sin(eta), 2 - epsilon_1) * signed_pow(Math.sin(omega), 2 - epsilon_2);

				normal.normalize();
				normals.push(normal.x, normal.y, normal.z);

				// uv

				if (post_uv) {

					// calculate uv from coordinates / mapped sphere angles

					const latitude = Math.atan2(vertex.z, vertex.x);
					const longitude = Math.acos(vertex.y);

					let post_u = 1 - (latitude + Math.PI) / (2*Math.PI);
					let post_v = 1 - longitude / Math.PI;

					// edge cases (poles and dateline)
					if (v == 0.0 || v == 1.0 || u == 1.0) post_u = u * phiLength / (2*Math.PI);

					uvs.push(post_u, post_v);

				} else {
					// linear uv
					uvs.push(u, 1 - v);
				}

				verticesRow.push(index++);

			}

			grid.push(verticesRow);

		}

		indices

		for (let iy = 0; iy < heightSegments; iy++) {

			for (let ix = 0; ix < widthSegments; ix++) {

				const a = grid[iy][ix + 1];
				const b = grid[iy][ix];
				const c = grid[iy + 1][ix];
				const d = grid[iy + 1][ix + 1];

				if ( iy !== 0 || thetaStart > 0 ) indices.push( a, b, d );
				if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, c, d );
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
