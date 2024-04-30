
import * as THREE from 'three'

import { CSG } from '../libs/CSG-v2.js'

class Tuerca extends THREE.Object3D {

  constructor(gui, titleGui) {
    super();

    //-----------------------------------------------------------------------------------

    this.createGUI(gui, titleGui);
    //----------------------------------------------------------------------------------------

    //MATERIAL CON RELIEVE
    const material = new THREE.MeshPhongMaterial({color: 0xAAAAAA, roughness: 0.2, metalness: 0.8, side: THREE.DoubleSide});

    const bumpTexture = new THREE.TextureLoader().load('../textures/bumpmapmetal.jpg')
    material.bumpMap = bumpTexture
    material.bumpScale = 10

    // Cilindro
    var cilindroGeo = new THREE.CylinderGeometry(0.5,0.5,0.5,6,66);
    var cilindro = new THREE.Mesh(cilindroGeo, material);

    //this.add(cilindro);

    //Cilindro interior

    var cilindroInteriorGeo = new THREE.CylinderGeometry(0.25,0.15,1,66,66);
    var cilindroInterior = new THREE.Mesh(cilindroInteriorGeo, material);

    //this.add(cilindroInterior);

    //Espiral de puntos (Recorrido de la extrusión)

    var spiralPoints = [];
    var numPoints = 100;
    var numTurns = 4;
    var radio = 0.20;
    var altura = 0.40;

    for (var i = 0; i < numPoints; i++) {
      var angle = (i/numPoints)*numTurns*2*Math.PI;
      var x = radio*Math.cos(angle);
      var y = radio*Math.sin(angle);
      var z = (i/numPoints)*altura;
      spiralPoints.push(new THREE.Vector3(x,y,z));
    }

    var curve = new THREE.CurvePath();
    curve.add(new THREE.CatmullRomCurve3(spiralPoints));

    //Tube geometry con path

    var extrudeGeo = new THREE.TubeGeometry(curve, 100, 0.06, 8, true);
    extrudeGeo.rotateX(Math.PI/2);
    extrudeGeo.translate(0,0.21,0);
    var extrudeMesh = new THREE.Mesh(extrudeGeo, material);

    //this.add(extrudeMesh);

    //Restar 

    var cilindroCSG = new CSG().setFromMesh(cilindro);
    const result = cilindroCSG.subtract([cilindroInterior]);

    var resultMesh = new THREE.Mesh(result.toGeometry(), material);

    //this.add(resultMesh);

    var finalCSG = new CSG().setFromMesh(resultMesh);
    const finalResult = finalCSG.subtract([extrudeMesh]);

    var finalMesh = new THREE.Mesh(finalResult.toGeometry(), material);

    this.add(finalMesh);

    this.position.set(0.4,0,0);

    this.rotateX(2*(Math.PI/5));
    this.scale.set(0.7,0.7,0.7);
 
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

export { Tuerca }
