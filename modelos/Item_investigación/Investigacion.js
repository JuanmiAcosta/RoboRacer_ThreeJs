
import * as THREE from 'three'

import { TextGeometry } from '../../../libs/TextGeometry.js';
import { FontLoader } from '../../../libs/FontLoader.js';
import { SphereGeometry } from '../../../libs/three.module.js';

class Investigacion extends THREE.Object3D {

  constructor() {
    super();
    //----------------------------------------------------------------------------------------

    var esferaGeo = new SphereGeometry(1,16,16,0,Math.PI*2);
    //material transparente
    var materialEsfera = new THREE.MeshBasicMaterial({
      color: 0xff0000, // Color azul
      transparent: true,
      opacity: 0.1 // Semi-transparente
    });

    var esfera = new THREE.Mesh(esferaGeo, materialEsfera);

    this.add(esfera);
    //----------------------------------------------------------------------------------------
    const loader = new FontLoader();

    var mesh = null;

    loader.load('../fonts/helvetiker_regular.typeface.json', function (font) {

      const geometry = new TextGeometry('+1 pto', {
        font: font,
        size: 2,
        depth: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 3
      });

      geometry.translate(-4,-1,-1);
      geometry.scale(0.2,0.2,0.2);

      var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      mesh = new THREE.Mesh(geometry, material);

      // Añadir mesh a la escena dentro de la función de callback
      this.add(mesh);
    }.bind(this)); // Asegúrate de que 'this' se refiere al objeto correcto

    
  }

  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }

}

export { Investigacion }
