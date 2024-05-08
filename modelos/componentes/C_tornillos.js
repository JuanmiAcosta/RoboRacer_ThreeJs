
import * as THREE from 'three'

import { Tornillos } from './Tornillos.js'
import { Tuerca } from './Tuerca.js'

class C_tornillos extends THREE.Object3D {

  constructor(tuboMesh, t , alfa) {
    super();

    this.t = t;
    this.alfa = alfa;

    var geomTubo = tuboMesh.geometry;

    this.ensamblado = new THREE.Object3D();

    //---------------------------------------------------------------------------------------
 
    var tornillo = new Tornillos();
    var tuerca = new Tuerca();

    this.ensamblado.add(tornillo);
    this.ensamblado.add(tuerca);

    var esferaGeo = new THREE.SphereGeometry(1,16,16,0,Math.PI*2);
    //material transparente
    var materialEsfera = new THREE.MeshPhongMaterial({
      color: 0x0000ff, // Color azul
      transparent: true,
      opacity: 0.1 // Semi-transparente
   });

    const bumpTexture = new THREE.TextureLoader().load('../textures/normalmapitem2.jpg')
    materialEsfera.bumpMap = bumpTexture
    materialEsfera.bumpScale = 10

    var esfera = new THREE.Mesh(esferaGeo, materialEsfera);

    this.ensamblado.add(esfera);

    this.ensamblado.position.set (-1.2,0,0);
    this.ensamblado.scale.set(2.5,2.5,2.5);
    this.ensamblado.rotation.y = Math.PI/2;

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

    this.padreTraslation.position.y = (this.radio+2); //Para que el coche no esté enterrado en el suelo

    this.padreRotation.rotation.z = (alfa);

    this.t = t;
    this.alfa = alfa;
    
  }

}

export { C_tornillos }
