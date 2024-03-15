import * as THREE from 'three';

import { DummyGeometry, SuperquadricMaterial } from './shader.js';

let mesh, debug_sphere, positionComputBuffer, epsilon1Attribute, epsilon2Attribute;
const size = 100;
const spacing = 1;

function initSuperquadric() {

    
    const geometry = new DummyGeometry(64, 32);
    const material = new SuperquadricMaterial();
    mesh = new THREE.InstancedMesh( geometry, material, size**2);

    // position instances in a grid
    positionComputBuffer = [];

    let i = 0;
    for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
            const instancePosition = new THREE.Vector3();
            instancePosition.x = (x - (size-1)/2) * spacing * 2;
            instancePosition.y = 0;
            instancePosition.z = (z - (size-1)/2) * spacing * 2;

            positionComputBuffer.push(instancePosition.x, instancePosition.y, instancePosition.z);
        }
    }

    const positionAttribute = new THREE.InstancedBufferAttribute(new Float32Array(positionComputBuffer), 3);
    mesh.geometry.setAttribute('position', positionAttribute);

    // epsilon1 and epsilon2
    const epsilon1ComputeBuffer = [];
    const epsilon2ComputeBuffer = [];
    
    for (let i = 0; i < size**2; i++) {
        epsilon1ComputeBuffer.push(Math.random() * 5);
        epsilon2ComputeBuffer.push(Math.random() * 5);
    }
    epsilon1Attribute = new THREE.InstancedBufferAttribute(new Float32Array(epsilon1ComputeBuffer), 1);
    epsilon2Attribute = new THREE.InstancedBufferAttribute(new Float32Array(epsilon2ComputeBuffer), 1);
    mesh.geometry.setAttribute('epsilon1', epsilon1Attribute);
    mesh.geometry.setAttribute('epsilon2', epsilon2Attribute);

    // debug sphere
    debug_sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({color: 0xff0000})
    );
    debug_sphere.position.y = 2;

    mesh.add(debug_sphere);
    
    
    return mesh;
}



function animate() {

    debug_sphere.position.x = Math.sin(performance.now() / 1000) * size/2 * spacing;
    debug_sphere.position.z = Math.cos(performance.now() / 1000) * size/2 * spacing;

    for (let i = 0; i < size**2; i++) {
        // distance to debug sphere
        const instancePosition = new THREE.Vector3().fromArray(positionComputBuffer, i*3);
        const spherePosition = debug_sphere.position;
        let distance = spherePosition.distanceTo(instancePosition);
        distance = 20 / distance;

        // epsilon1 and epsilon2
        epsilon1Attribute.setX(i, distance);
        epsilon2Attribute.setX(i, distance);
    }
    epsilon1Attribute.needsUpdate = true;
    epsilon2Attribute.needsUpdate = true;
}


export { animate, initSuperquadric };
