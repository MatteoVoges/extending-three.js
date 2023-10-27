import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';

let camera, scene, renderer;
let cameraControls;
let effectController;
const teapotSize = 300;
let ambientLight, light;

let tess = - 1;	// force initialization
let bBottom;
let bLid;
let bBody;
let bFitLid;
let bNonBlinn;
let shading;

let teapot;
const materials = {};

init();
render();

function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    // CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 80000);
    camera.position.set(- 600, 550, 1300);

    // LIGHTS
    ambientLight = new THREE.AmbientLight(0x7c7c7c, 3.0);
    
    light = new THREE.DirectionalLight(0xFFFFFF, 3.0);
    light.position.set(0.32, 0.39, 0.7);
    const lightHelper = new THREE.DirectionalLightHelper(light, 1);

    
    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidth, canvasHeight);
    container.appendChild(renderer.domElement);
    
    // EVENTS
    window.addEventListener('resize', onWindowResize);
    
    // CONTROLS
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.addEventListener('change', render);
    
    materials['wireframe'] = new THREE.MeshBasicMaterial({ wireframe: true });
    materials['flat'] = new THREE.MeshPhongMaterial({ specular: 0x000000, flatShading: true, side: THREE.DoubleSide });
    materials['smooth'] = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
    materials['glossy'] = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
    
    // scene itself
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA);
    
    scene.add(ambientLight);
    scene.add(light);
    scene.add(lightHelper); 
    
    // GUI
    setupGui();

}

// EVENT HANDLERS

function onWindowResize() {

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    renderer.setSize(canvasWidth, canvasHeight);

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    render();

}

function setupGui() {

    effectController = {
        newTess: 15,
        bottom: true,
        lid: true,
        body: true,
        fitLid: false,
        nonblinn: false,
        newShading: 'glossy'
    };

    const gui = new GUI();
    gui.add(effectController, 'newTess', [2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50]).name('Tessellation Level').onChange(render);
    gui.add(effectController, 'newShading', ['wireframe', 'flat', 'smooth', 'glossy']).name('Shading').onChange(render);

}

function render() {

    if (effectController.newTess !== tess ||
        effectController.newShading !== shading) {

        tess = effectController.newTess;
        bBottom = true;
        bLid = true;
        bBody = true;
        bFitLid = true;
        bNonBlinn = true;
        shading = effectController.newShading;

        createNewTeapot();

    }

    // skybox is rendered separately, so that it is always behind the teapot.
    if (shading === 'reflective') {

        scene.background = textureCube;

    } else {

        scene.background = null;

    }

    renderer.render(scene, camera);

}

// Whenever the teapot changes, the scene is rebuilt from scratch (not much to it).
function createNewTeapot() {

    if (teapot !== undefined) {

        teapot.geometry.dispose();
        scene.remove(teapot);

    }

    const geometry = new TeapotGeometry(teapotSize,
        tess,
        effectController.bottom,
        effectController.lid,
        effectController.body,
        effectController.fitLid,
        !effectController.nonblinn);

    teapot = new THREE.Mesh(geometry, materials[shading]);

    scene.add(teapot);

}