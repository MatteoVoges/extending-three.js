import * as THREE from 'three';

import { SuperquadricGeometry } from '../../src/superquadricGeometry.js';

function initSuperquadric() { 
    
    const geometry = new SuperquadricGeometry(4, 1);
    geometry.epsilon_1 = 0.1;
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00}); 
    const mesh = new THREE.InstancedMesh( geometry, material, 10);

    const xLengths = [];
    const yLengths = [];
    const zLengths = [];
    for (let i = 0; i < 10; i++) {
        xLengths.push(Math.random() * 2 + 1);
        yLengths.push(Math.random() * 2 + 1);
        zLengths.push(Math.random() * 2 + 1);
    }
    const xLengthsAttribute = new THREE.InstancedBufferAttribute(new Float32Array(xLengths), 1);
    const yLengthsAttribute = new THREE.InstancedBufferAttribute(new Float32Array(yLengths), 1);
    const zLengthsAttribute = new THREE.InstancedBufferAttribute(new Float32Array(zLengths), 1);
    mesh.setAttribute('xLength', xLengthsAttribute);
    mesh.setAttribute('yLength', yLengthsAttribute);
    mesh.setAttribute('zLength', zLengthsAttribute);

    // Set instance scales
    const scale = new THREE.Vector3();
    for (let i = 0; i < 10; i++) {
        scale.set(
            xLengths[i],
            yLengths[i],
            zLengths[i]
        );
        mesh.setMatrixAt(i, scale);
    }
    
    return mesh;
}



function animate() {

}


export { animate, initSuperquadric };
