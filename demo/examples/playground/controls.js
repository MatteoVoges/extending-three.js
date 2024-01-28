import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {updateGeometry, updateMaterial, updateTexture, updateHelpers} from "./superquadric.js";

// SETTINGS
const settings = {
	geometry: {
		parameters: {
			"radius": 1.0,
			"epsilon 1": 1.0,
			"epsilon 2": 1.0,
		},

		scale: {
			"x": 1.0,
			"y": 1.0,
			"z": 1.0,
		},
		
		resolution: {
			"width": 32,
			"height": 16,
		},

		phi: {
			"start": 0,
			"length": 2,
		},

		theta: {
			"start": 0,
			"length": 1,
		},
	},

	material: {
		"wireframe": false,
		"shading": "phong",
		
		"material": "color",
        "color": "#da610b",
    },

    texture: {
        "mode": "legacy",
        "show debug texture": false,
        "upload texture": function() {alert("Not implemented yet!");},
    },

    debug: {
        "show normal helper": false,
    },
};


function createGUI() {

    const gui = new GUI();
    gui.title("Settings");
    
    // geometry
    const geometryFolder = gui.addFolder("Geometry");
    geometryFolder.onChange(updateGeometry);

    const parametersFolder = geometryFolder.addFolder("Parameters");
    parametersFolder.add(settings.geometry.parameters, "radius", 0.01, 5, 0.01)
    parametersFolder.add(settings.geometry.parameters, "epsilon 1", 0, 5, 0.01);
    parametersFolder.add(settings.geometry.parameters, "epsilon 2", 0, 5, 0.01);

    const scaleFolder = geometryFolder.addFolder("Scale");
    scaleFolder.add(settings.geometry.scale, "x", 0.01, 5.0, 0.1);
    scaleFolder.add(settings.geometry.scale, "y", 0.01, 5.0, 0.1);
    scaleFolder.add(settings.geometry.scale, "z", 0.01, 5.0, 0.1);

    const resolutionFolder = geometryFolder.addFolder("Resolution");
    resolutionFolder.add(settings.geometry.resolution, "width", 3, 256, 1);
    resolutionFolder.add(settings.geometry.resolution, "height", 2, 128, 1);

    const phiFolder = geometryFolder.addFolder("Phi");
    phiFolder.add(settings.geometry.phi, "start", 0, 2, 0.01);
    phiFolder.add(settings.geometry.phi, "length", 0, 2, 0.01);

    const thetaFolder = geometryFolder.addFolder("Theta");
    thetaFolder.add(settings.geometry.theta, "start", 0, 1, 0.01);
    thetaFolder.add(settings.geometry.theta, "length", 0, 1, 0.01);

    // material
    const material = gui.addFolder("Material");
    material.onChange(updateMaterial);

    material.add(settings.material, "wireframe");
    material.add(settings.material, "shading", ["phong", "flat"]);
    material.add(settings.material, "material", ["color", "texture"]);
    material.addColor(settings.material, "color");

    // texture
    const textureFolder = gui.addFolder("Texture");
    textureFolder.add(settings.texture, "mode", ["legacy", "sphere mapped"]).onChange(updateGeometry);
    textureFolder.add(settings.texture, "show debug texture").onChange(updateTexture);
    textureFolder.add(settings.texture, "upload texture").onFinishChange(updateTexture);

    // debug
    const debugFolder = gui.addFolder("Debug");
    debugFolder.add(settings.debug, "show normal helper").onChange(updateHelpers);

    // general
    gui.add({reset: function() {gui.reset();}}, "reset").name("Reset values");

}

export {createGUI};
