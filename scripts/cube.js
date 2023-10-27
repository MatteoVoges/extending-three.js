import * as THREE from 'three';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define cube geometry and materials
const geometry = new THREE.BoxGeometry(1, 1, 1);
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),  // Red
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),  // Green
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),  // Blue
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),  // Yellow
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),  // Magenta
    new THREE.MeshBasicMaterial({ color: 0x00ffff })   // Cyan
];

// Create a cube with the materials
const cube = new THREE.Mesh(geometry, materials);

// Add the cube to the scene
scene.add(cube);

// Set up animation
const animate = () => {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

animate();
