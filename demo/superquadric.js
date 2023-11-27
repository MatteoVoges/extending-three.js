import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { SuperquadricGeometry } from '../src/superquadricGeometry.js';

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}


// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHTS
const ambientLight = new THREE.AmbientLight(0x7c7c7c, 3.0);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 1);
scene.add(light);

// CONTROLS
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener('change', render);

// Define cube geometry and materials
const geometry = new SuperquadricGeometry();

const materials = {};
materials['wireframe'] = new THREE.MeshBasicMaterial({ wireframe: true });
materials['flat'] = new THREE.MeshPhongMaterial({flatShading: true, side: THREE.DoubleSide });
materials['smooth'] = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });

// Create a cube with the materials
const superquadric = new THREE.Mesh(geometry, materials['wireframe']);

// Add the cube to the scene
scene.add(superquadric);

renderer.render(scene, camera);
