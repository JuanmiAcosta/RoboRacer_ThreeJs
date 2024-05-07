
import * as THREE from 'three'

import { TextGeometry } from '../../libs/TextGeometry.js';
import { FontLoader } from '../../libs/FontLoader.js';
import { SphereGeometry } from '../../libs/three.module.js';

class Investigacion extends THREE.Object3D {

  constructor(tuboMesh, t , alfa ) {
    super();

    this.t = t;
    this.alfa = alfa;

    var geomTubo = tuboMesh.geometry;

    this.ensamblado = new THREE.Object3D();

    //----------------------------------------------------------------------------------------

    var esferaGeo = new SphereGeometry(1,16,16,0,Math.PI*2);
    //material transparente
    var materialEsfera = new THREE.MeshPhongMaterial({
      color: 0xff0000, // Color azul
      transparent: true,
      opacity: 0.4 // Semi-transparente
    });

    const bumpTexture = new THREE.TextureLoader().load('../textures/normalmapitem2.jpg')
    materialEsfera.bumpMap = bumpTexture;
    materialEsfera.bumpScale = 20;

    var esfera = new THREE.Mesh(esferaGeo, materialEsfera);

    this.ensamblado.add(esfera);
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
      this.ensamblado.add(mesh);
    }.bind(this)); // Asegúrate de que 'this' se refiere al objeto correcto

    // TUBO --------------------------------------------------------------------------------------------
    // El constructor del personaje recibe la geometria del Tubo para extraer información necesaria
    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    this.padreTraslation = new THREE.Object3D();
    this.padreTraslation.add(this.ensamblado);

    this.padreRotation = new THREE.Object3D();
    this.padreRotation.add(this.padreTraslation);

    this.padrisimo = new THREE.Object3D();
    this.padrisimo.add(this.padreRotation);

    this.add(this.padrisimo);

    this.update(t,alfa);
  }

  update(t,alfa) {
    
    var posTmp = this.path.getPointAt(t);
    this.padrisimo.position.copy(posTmp);
    // Para l a o r i e n t a c i ón necesitamos l a tangente y l a binormal del tubo en esa p o s i c i ón
    // también los extraemos del camino y tubo respectivamente
    var tangente = this.path.getTangentAt(t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(t * this.segmentos);
    this.padrisimo.up = this.tubo.binormals[segmentoActual];
    this.padrisimo.lookAt(posTmp);

    this.padreTraslation.position.y = (this.radio+1.6); //Para que el coche no esté enterrado en el suelo

    this.padreRotation.rotation.z = (alfa);

    this.t = t;
    this.alfa = alfa;
    
  }

}

export { Investigacion }
