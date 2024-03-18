import { initCanvas, renderer, scene, camera } from '../canvas.js';

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { ExtendedSuperquadricBufferGeometry, SuperquadricInstanceMaterial } from '../../src/superquadricMaterial.js';


let mesh, debug_sphere, epsilon1Attribute, epsilon2Attribute;

export function main() {

    initCanvas(animate);
    initGUI();

    camera.position.set(0, 30, 0);
    camera.lookAt(0, 0, 0);

    // lights
    const hemissphereLight = new THREE.HemisphereLight();
    scene.add(hemissphereLight);

    const ambientLight = new THREE.AmbientLight(0x606060, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
    
    // debug sphere
    debug_sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({color: 0xff0000})
    );
    debug_sphere.position.y = settings.height;
    debug_sphere.add(new THREE.PointLight(0xffffff, 50));
    scene.add(debug_sphere);
    

    // instances
    const geometry = new ExtendedSuperquadricBufferGeometry(64, 32);
    const material = new SuperquadricInstanceMaterial();
    mesh = new THREE.InstancedMesh( geometry, material, settings.size**2 );

    // position instances in a grid
    let i = 0;
    for (let z = 0; z < settings.size; z++) {
        for (let x = 0; x < settings.size; x++) {
            const translationMatrix = new THREE.Matrix4().makeTranslation((x - (settings.size-1)/2) * settings.spacing * 2, 0, (z - (settings.size-1)/2) * settings.spacing * 2);
            mesh.setMatrixAt(i++, translationMatrix);
        }
    }

    // epsilon1 and epsilon2
    const epsilon1ComputeBuffer = [];
    const epsilon2ComputeBuffer = [];
    
    for (let i = 0; i < settings.size**2; i++) {
        epsilon1ComputeBuffer.push(Math.random() * 5);
        epsilon2ComputeBuffer.push(Math.random() * 5);
    }
    epsilon1Attribute = new THREE.InstancedBufferAttribute(new Float32Array(epsilon1ComputeBuffer), 1);
    epsilon2Attribute = new THREE.InstancedBufferAttribute(new Float32Array(epsilon2ComputeBuffer), 1);
    mesh.geometry.setAttribute('epsilon1', epsilon1Attribute);
    mesh.geometry.setAttribute('epsilon2', epsilon2Attribute);

    scene.add(mesh);
}

// SETTINGS
const settings = {
    size: 10,
    range: 10,
    spacing: 1.5,
    height: 2,
    speed: 1,
};

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function inverseLerp(a, b, t) {
    return (t - a) / (b - a);
}

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}


function animate() {
    const time = performance.now() / 1000;

    debug_sphere.position.x = Math.sin(time * settings.speed) * settings.size/2 * settings.spacing;
    debug_sphere.position.z = Math.cos(time * settings.speed) * settings.size/2 * settings.spacing;

    
    for (let i = 0; i < settings.size**2; i++) {

        // distance to debug sphere
        const outputMatrix = new THREE.Matrix4();
        mesh.getMatrixAt(i, outputMatrix);
        const instancePosition = new THREE.Vector3().setFromMatrixPosition(outputMatrix);
        const spherePosition = debug_sphere.position;
        
        let distance = spherePosition.distanceTo(instancePosition);
        let effect = inverseLerp(settings.range, settings.height, clamp(distance, settings.height, settings.range));
        let epsilon = effect * 5;
        
        // rotate instances towards sphere
        const up = new THREE.Vector3(0, 1, 0);
        const direction = new THREE.Vector3(spherePosition.x, 0, spherePosition.z).normalize();
        const rotationMatrix = new THREE.Matrix4().lookAt(instancePosition, direction, up);
        const rotationQuaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);
        outputMatrix.makeRotationFromQuaternion(rotationQuaternion);
        outputMatrix.setPosition(instancePosition);
        
        // set matrix 
        mesh.setMatrixAt(i, outputMatrix);

        // epsilon1 and epsilon2
        epsilon1Attribute.setX(i, epsilon);
        epsilon2Attribute.setX(i, epsilon);
    }

    mesh.instanceMatrix.needsUpdate = true;
    epsilon1Attribute.needsUpdate = true;
    epsilon2Attribute.needsUpdate = true;
}

function initGUI() {
    const gui = new GUI();
    gui.title("Settings");
    gui.onChange(
        () => {
            document.body.removeChild(renderer.domElement);
            renderer.dispose();
            main();
        }
    );
    gui.add(settings, 'size', 1, 20, 1);
    gui.add(settings, 'range', 0, 20, 0.1);
    gui.add(settings, 'spacing', 0, 5, 0.1);
    gui.add(settings, 'height', 0, 5, 0.1);
    gui.add(settings, 'speed', 0, 5, 0.1);
}
