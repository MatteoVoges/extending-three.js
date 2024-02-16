import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { updateGeometry, updateMaterial, updateEnvironment, updateCamera } from "./superquadric.js";

// SETTINGS
const settings = {
	epsilon_1: 1.0,
	epsilon_2: 1.0,

    color: "#da610b",
    roughness: 0.0,
    metalness: 0.0,

    environment: "none",
    show_env: true,

    auto_rotate: true,
};


function initGUI () {

    const gui = new GUI();
    gui.title("Settings");
    
    // geometry
    const geometryFolder = gui.addFolder("Geometry");
    geometryFolder.onChange(updateGeometry);
    geometryFolder.add(settings, "epsilon_1", 0, 5, 0.01);
    geometryFolder.add(settings, "epsilon_2", 0, 5, 0.01);

    // material
    const materialFolder = gui.addFolder("Material");
    materialFolder.onChange(updateMaterial);
    materialFolder.addColor(settings, "color");
    materialFolder.add(settings, "roughness", 0, 1, 0.01);
    materialFolder.add(settings, "metalness", 0, 1, 0.01);

    // environment
    const environmentFolder = gui.addFolder("Environment");
    environmentFolder.onChange(updateEnvironment);
    environmentFolder.add(settings, "environment", ["none", "blouberg", "moonless", "pedestrian overpass", "quarry", "royal esplanade", "san giuseppe", "venice"]);
    environmentFolder.add(settings, "show_env").name("Show Background");

    // camera
    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.onChange(updateCamera);
    cameraFolder.add(settings, "auto_rotate");

    // general
    gui.add({reset: function () {gui.reset();}}, "reset").name("Reset values");

}

export {initGUI, settings};
