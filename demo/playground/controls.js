import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


function createGUI() {

    const gui = new GUI();

    let obj = {
        myBoolean: true,
        myString: 'lil-gui',
        myNumber: 1,
        myFunction: function() { alert( 'hi' ) },
        color1: '#AA00FF',
    }
    
    gui.add( obj, 'myBoolean' ); 	// checkbox
    gui.add( obj, 'myString' ); 	// text field
    gui.add( obj, 'myNumber' ); 	// number field
    gui.add( obj, 'myFunction' ); 	// button
    gui.addColor( obj, 'color1' );  // color picker

    // see https://lil-gui.georgealways.com/#GUI#add
    
    


}

export {createGUI};
