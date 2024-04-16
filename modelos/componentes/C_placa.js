
import * as THREE from 'three'

import { BoxGeometry, CylinderGeometry, SphereGeometry } from '../../../libs/three.module.js';

class C_placa extends THREE.Object3D {

  constructor() {
    super();

    //---------------------------------------------------------------------------------------

    var esferaGeo = new SphereGeometry(1,16,16,0,Math.PI*2);
    //material transparente
    var materialEsfera = new THREE.MeshBasicMaterial({
      color: 0x00ff00, // Color azul
      transparent: true,
      opacity: 0.1 // Semi-transparente
    });

    var esfera = new THREE.Mesh(esferaGeo, materialEsfera);

    this.add(esfera);

    //Placa
    //shape de la forma

    const shape = new THREE.Shape();
    shape.moveTo(1,1);
    shape.lineTo(1,0);
    shape.lineTo(1.5,0);
    shape.lineTo(1.5,-1.5);
    shape.lineTo(-0.5,-1.5);
    shape.lineTo(-0.5,-1);
    shape.lineTo(-1.5,-1);
    shape.lineTo(-1.5,0);
    shape.lineTo(-1,0);
    shape.lineTo(-1,1);
    shape.lineTo(1,1);

    //material con textura

    let texture = new THREE.TextureLoader().load('../imgs/placa.jpg');
    let materialPlacaSolar = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide});

    //extrusión

    const extrudeSettings = {
      steps: 1,
      depth: 0.1,
      bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.scale(0.4,0.4,0.4);

    this.placa = new THREE.Mesh(geometry, materialPlacaSolar);

    //condensadores
    this.padreCondensadores = new THREE.Object3D();

    var condensadorGeo = new CylinderGeometry(0.02,0.02,0.08,16,16);
    condensadorGeo.rotateX(Math.PI/2);
    var material = new THREE.MeshPhongMaterial({color: 0x000000, specular: 0x111111, shininess: 30});
    var condensador = new THREE.Mesh(condensadorGeo, material);

    condensador.position.set(0.5,-0.5,0.05);
    this.padreCondensadores.add(condensador);

    var condensador2 = condensador.clone();
    condensador2.position.set(0.43,-0.5,0.05);
    this.padreCondensadores.add(condensador2);

    var condensador3 = condensador.clone();
    condensador3.position.set(0.36,-0.5,0.05);
    this.padreCondensadores.add(condensador3);

    var condensador4 = condensador.clone();
    condensador4.position.set(0.39,-0.4,0.05);
    this.padreCondensadores.add(condensador4);

    var condensador5 = condensador.clone();
    condensador5.position.set(0.47,-0.4,0.05);
    this.padreCondensadores.add(condensador5);

    this.add(this.padreCondensadores);

    this.padreCondensadores2 = this.padreCondensadores.clone();
    this.padreCondensadores2.position.set(-0.8,0.3,0);
    this.add(this.padreCondensadores2);

    //resistencias
    this.padreResistencias = new THREE.Object3D();

    var resistenciaGeo = new BoxGeometry(0.02,0.02,0.08);
    resistenciaGeo.rotateX(Math.PI/2);
    //marron claro
    var resMat = new THREE.MeshPhongMaterial({color : 0xD2B48C, specular: 0x111111, shininess: 30});
    var resistencia = new THREE.Mesh(resistenciaGeo, resMat);

    resistencia.position.set(-0.5,-0.5,0.05);
    this.padreResistencias.add(resistencia);

    var resistencia2 = resistencia.clone();
    resistencia2.position.set(-0.43,-0.5,0.05);
    this.padreResistencias.add(resistencia2);

    var resistencia3 = resistencia.clone();
    resistencia3.position.set(-0.36,-0.5,0.05);
    this.padreResistencias.add(resistencia3);

    var resistencia4 = resistencia.clone();
    resistencia4.position.set(-0.39,-0.4,0.05);
    this.padreResistencias.add(resistencia4);

    var resistencia5 = resistencia.clone();
    resistencia5.position.set(-0.47,-0.4,0.05);
    this.padreResistencias.add(resistencia5);

    this.padreResistencias.position.set(0.5,0,0);
    this.add(this.padreResistencias);

    this.padreResistencias2 = this.padreResistencias.clone();
    this.padreResistencias2.position.set(0.3,0.7,0);
    this.add(this.padreResistencias2);

    

    //microchip

    var micro = new BoxGeometry(0.4,0.4,0.03);
    let texture2 = new THREE.TextureLoader().load('../imgs/micro.jpg');
    let materialMicro = new THREE.MeshPhongMaterial({ map: texture2, side: THREE.DoubleSide});

    var microchip = new THREE.Mesh(micro, materialMicro);
    microchip.position.set(0,-0.1,0.05);

    this.placa.add(microchip);



    this.add(this.placa);


    //----------------------------------------------------------------------------------------

    this.position.set (+1.2,0,0);

  }

  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }

}

export { C_placa }
