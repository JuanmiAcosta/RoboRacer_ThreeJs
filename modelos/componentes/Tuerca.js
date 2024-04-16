
import * as THREE from 'three'

import { CSG } from '../../../libs/CSG-v2.js'

class Tuerca extends THREE.Object3D {

  constructor() {
    super();

    //----------------------------------------------------------------------------------------

    // Cilindro
    var cilindroGeo = new THREE.CylinderGeometry(0.5,0.5,0.5,6,66);
    var cilindroMat = new THREE.MeshPhongMaterial({color: 0xAAAAAA, specular: 0x111111, shininess: 30});
    var cilindro = new THREE.Mesh(cilindroGeo, cilindroMat);

    //this.add(cilindro);

    //Cilindro interior

    var cilindroInteriorGeo = new THREE.CylinderGeometry(0.25,0.15,1,66,66);

    var cilindroInterior = new THREE.Mesh(cilindroInteriorGeo, cilindroMat);

    //this.add(cilindroInterior);

    //Espiral de puntos (Recorrido de la extrusión)

    var spiralPoints = [];
    var numPoints = 100;
    var numTurns = 4;
    var radio = 0.18;
    var altura = 0.44;

    for (var i = 0; i < numPoints; i++) {
      var angle = (i/numPoints)*numTurns*2*Math.PI;
      var x = radio*Math.cos(angle);
      var y = radio*Math.sin(angle);
      var z = (i/numPoints)*altura;
      spiralPoints.push(new THREE.Vector3(x,y,z));
    }

    var curve = new THREE.CurvePath();
    curve.add(new THREE.CatmullRomCurve3(spiralPoints));

    const extrudeSettings = {
      steps: 100, // Número de divisiones a lo largo de la extrusión
      bevelEnabled: false, // Aplicar chaflán
      extrudePath: curve
    };

    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 0.06);
    shape.lineTo(0.06, 0);
    shape.lineTo(0, -0.06);
    shape.lineTo(0, 0);

    var extrudeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    extrudeGeo.rotateX(Math.PI/2);
    extrudeGeo.translate(0,0.21,0);
    

    var extrudeMat = new THREE.MeshPhongMaterial({color: 0xAAAAAA, specular: 0x111111, shininess: 30});

    var extrudeMesh = new THREE.Mesh(extrudeGeo, extrudeMat);

    //this.add(extrudeMesh);

    //Restar 

    var cilindroCSG = new CSG().setFromMesh(cilindro);
    const result = cilindroCSG.subtract([cilindroInterior]);

    var resultMesh = new THREE.Mesh(result.toGeometry(), cilindroMat);

    //this.add(resultMesh);

    var finalCSG = new CSG().setFromMesh(resultMesh);
    const finalResult = finalCSG.subtract([extrudeMesh]);

    var finalMesh = new THREE.Mesh(finalResult.toGeometry(), cilindroMat);

    this.add(finalMesh);

    this.position.set(0.4,0,0);

    this.rotateX(2*(Math.PI/5));
    this.scale.set(0.7,0.7,0.7);
 
  }

  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }

}

export { Tuerca }
