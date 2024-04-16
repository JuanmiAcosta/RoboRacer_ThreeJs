
import * as THREE from 'three'

import { Tornillos } from './Tornillos.js'
import { Tuerca } from './Tuerca.js'
import { SphereGeometry } from '../../../libs/three.module.js';

class C_tornillos extends THREE.Object3D {

  constructor() {
    super();

    //---------------------------------------------------------------------------------------
 
    var tornillo = new Tornillos(gui, "Controles Tornillo");
    var tuerca = new Tuerca(gui, "Controles Tuerca");

    this.add(tornillo);
    this.add(tuerca);

    var esferaGeo = new SphereGeometry(1,16,16,0,Math.PI*2);
    //material transparente
    var materialEsfera = new THREE.MeshBasicMaterial({
      color: 0x0000ff, // Color azul
      transparent: true,
      opacity: 0.1 // Semi-transparente
    });

    var esfera = new THREE.Mesh(esferaGeo, materialEsfera);

    this.add(esfera);

    this.position.set (-1.2,0,0);

  }

  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }

}

export { C_tornillos }
