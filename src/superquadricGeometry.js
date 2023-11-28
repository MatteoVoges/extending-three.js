import { BufferGeometry, Vector3, Float32BufferAttribute } from 'three';

class SuperquadricGeometry extends BufferGeometry {

	constructor(widthSegments = 32, heightSegments = 16) {

		super();

		this.type = 'SuperquadricGeometry';

		this.parameters = {
			widthSegments: widthSegments,
			heightSegments: heightSegments,
		};

		widthSegments = Math.max(3, Math.floor(widthSegments));
		heightSegments = Math.max(2, Math.floor(heightSegments));

		let index = 0;
		const grid = [];

		// buffers

		const indices = [];
		const vertices = [];

		const epsilon_1 = 1;
		const epsilon_2 = 1;

		const alpha = new Vector3(1.0, 1.0, 1.0);

		// generate vertices

		for (let iy = 0; iy <= heightSegments; iy++) {

			const verticesRow = [];

			const v = iy / heightSegments;
			const eta = - Math.PI/2 - v * Math.PI;

			for (let ix = 0; ix <= widthSegments; ix++) {

				const u = ix / widthSegments;
				const omega = u * 2 * Math.PI;

				// vertex
				let vertex = new Vector3();
				vertex.x = cos_epsilon(eta, epsilon_1) * cos_epsilon(omega, epsilon_2);
				vertex.y = sin_epsilon(eta, epsilon_1);
				vertex.z = cos_epsilon(eta, epsilon_1) * sin_epsilon(omega, epsilon_2);

				vertex.multiply(alpha);

				vertices.push(vertex.x, vertex.y, vertex.z);
				verticesRow.push(index++);
			}
			verticesRow.push(verticesRow.length - 1 - widthSegments);
			grid.push(verticesRow);
		}

		// indices

		for (let iy = 0; iy < heightSegments; iy++) {

			for (let ix = 0; ix < widthSegments; ix++) {

				const a = grid[iy][ix + 1];
				const b = grid[iy][ix];
				const c = grid[iy + 1][ix];
				const d = grid[iy + 1][ix + 1];

				if (iy !== 0)
					indices.push(a, b, d);
				if (iy !== heightSegments - 1)
					indices.push(b, c, d);
			}
		}

		// build geometry

		this.setIndex(indices);
		this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
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
