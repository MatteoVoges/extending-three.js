import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { updateGeometry, updateMaterial, updateTexture, updateHelpers } from "./superquadric.js";

// SETTINGS
const settings = {
	epsilon_1: 1.0,
	epsilon_2: 1.0,

	scale_x: 1.0,
	scale_y: 1.0,
	scale_z: 1.0,

	widthSegments: 64,
	heightSegments: 32,

	phi_start: 0,
	phi_length: 2*Math.PI,

	theta_start: 0,
	theta_length: Math.PI,

	wireframe: false,
	shading: "phong",
	material: "color",
    color: "#da610b",

    uv_mode: "legacy",
    texture: "debug",
    upload_texture: selectTexture,

    normal_helper: false,
    tangent_helper: false,
};


function initGUI () {

    const gui = new GUI();
    gui.title("Settings");
    
    // geometry
    const geometryFolder = gui.addFolder("Geometry");
    geometryFolder.onChange(updateGeometry);

    const parametersFolder = geometryFolder.addFolder("Parameters");
    parametersFolder.add(settings, "epsilon_1", 0, 5, 0.01);
    parametersFolder.add(settings, "epsilon_2", 0, 5, 0.01);

    const scaleFolder = geometryFolder.addFolder("Scale");
    scaleFolder.add(settings, "scale_x", 0, 5, 0.1);
    scaleFolder.add(settings, "scale_y", 0, 5, 0.1);
    scaleFolder.add(settings, "scale_z", 0, 5, 0.1);

    const resolutionFolder = geometryFolder.addFolder("Resolution");
    resolutionFolder.add(settings, "widthSegments", 3, 256, 1);
    resolutionFolder.add(settings, "heightSegments", 2, 128, 1);

    const phiFolder = geometryFolder.addFolder("Phi");
    phiFolder.add(settings, "phi_start", 0, 2*Math.PI, 0.01);
    phiFolder.add(settings, "phi_length", 0, 2*Math.PI, 0.01);

    const thetaFolder = geometryFolder.addFolder("Theta");
    thetaFolder.add(settings, "theta_start", 0, Math.PI, 0.01);
    thetaFolder.add(settings, "theta_length", 0, Math.PI, 0.01);

    // material
    const material = gui.addFolder("Material");
    material.onChange(updateMaterial);

    material.add(settings, "wireframe");
    material.add(settings, "shading", ["phong", "flat"]);
    material.add(settings, "material", ["color", "normal", "texture"]);
    material.addColor(settings, "color");

    // texture
    const textureFolder = gui.addFolder("Texture");
    textureFolder.add(settings, "uv_mode", ["legacy", "sphere mapped"]).onChange(updateGeometry);
    textureFolder.add(settings, "texture", ["debug", "basketball", "wood", "brick", "aluminium", "white marble", "dark marble"]).onChange(updateMaterial);
    textureFolder.add(settings, "upload_texture").onFinishChange(updateTexture);

    // debug
    const debugFolder = gui.addFolder("Debug");
    debugFolder.add(settings, "normal_helper").onChange(updateHelpers);
    debugFolder.add(settings, "tangent_helper").onChange(updateHelpers);

    // general
    gui.add({reset: function() {gui.reset();}}, "reset").name("Reset values");

    // gui.close();
}

export {initGUI, settings};

function selectTexture () {
    alert("Not implemented yet!");

    // const input = document.createElement("input");
    // input.type = "file";
    // input.accept = "image/*";
    // input.onchange = e => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = readerEvent => {
    //         const content = readerEvent.target.result;
    //         settings.texture = content;
    //         updateTexture();
    //     }
    // }
    // input.click();
}
