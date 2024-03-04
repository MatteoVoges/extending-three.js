import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { updateUniforms } from "./superquadric.js";

// SETTINGS
const settings = {
	epsilon_1: 1.0,
	epsilon_2: 1.0,
};


function initGUI () {

    const gui = new GUI();
    gui.title("Settings");
    
    // geometry
    const geometryFolder = gui.addFolder("Geometry");
    geometryFolder.onChange(updateUniforms);
    geometryFolder.add(settings, "epsilon_1", 0, 5, 0.01);
    geometryFolder.add(settings, "epsilon_2", 0, 5, 0.01);

    // general
    gui.add({reset: function() {gui.reset();}}, "reset").name("Reset values");

}

export {initGUI, settings};
