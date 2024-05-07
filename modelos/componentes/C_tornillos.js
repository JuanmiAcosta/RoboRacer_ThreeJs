
import * as THREE from 'three'

import { Tornillos } from './Tornillos.js'
import { Tuerca } from './Tuerca.js'

class C_tornillos extends THREE.Object3D {

  constructor(gui, titleGui) {
    super();

    //-----------------------------------------------------------------------------------

    this.createGUI(gui, titleGui);
    //---------------------------------------------------------------------------------------
 
    var tornillo = new Tornillos(gui, "Controles Tornillo");
    var tuerca = new Tuerca(gui, "Controles Tuerca");

    this.add(tornillo);
    this.add(tuerca);

    var esferaGeo = new THREE.SphereGeometry(1,16,16,0,Math.PI*2);
    //material transparente
    var materialEsfera = new THREE.MeshPhongMaterial({
      color: 0x0000ff, // Color azul
      transparent: true,
      opacity: 0.3 // Semi-transparente
    });

    const bumpTexture = new THREE.TextureLoader().load('../textures/normalmapitem2.jpg')
    materialEsfera.bumpMap = bumpTexture
    materialEsfera.bumpScale = 10

    var esfera = new THREE.Mesh(esferaGeo, materialEsfera);

    this.add(esfera);

    this.position.set (-1.2,0,0);

  }

  createGUI(gui, titleGui) {
    // Controles para el movimiento de la parte móvil
    this.guiControls = {

    }

    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
  }

  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }

}

export { C_tornillos }
