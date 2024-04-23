
import * as THREE from 'three'

import { TextGeometry } from 'libs/TextGeometry.js';
import { FontLoader } from 'libs/FontLoader.js';

class Tornillos extends THREE.Object3D {

  constructor() {
    super();

    //----------------------------------------------------------------------------------------

    // Cilindro
    var cilindroGeo = new THREE.CylinderGeometry(0.5,0.5,0.3,6,66);
    var cilindroMat = new THREE.MeshPhongMaterial({color: 0xAAAAAA, specular: 0x111111, shininess: 30});
    var cilindro = new THREE.Mesh(cilindroGeo, cilindroMat);

    this.add(cilindro);

    //Parte de abajo (Revolucion a partir de shape)
    var points = [];
    points.push(new THREE.Vector2(0.15,-0.1));
    points.push(new THREE.Vector2(0.15,-1));
    points.push(new THREE.Vector2(0,-1.2));

    var revGeo = new THREE.LatheGeometry(points, 66);
    var revMat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,color: 0xAAAAAA, specular: 0x111111, shininess: 30});
    var meshRev = new THREE.Mesh(revGeo, revMat);

    this.add(meshRev);

    //Espiral de puntos (Recorrido de la extrusión)

    var spiralPoints = [];
    var numPoints = 100;
    var numTurns = 4;
    var radio = 0.15;
    var altura = 1;

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
    shape.lineTo(0, 0.02);
    shape.lineTo(0.06, 0);
    shape.lineTo(0, -0.02);
    shape.lineTo(0, 0);

    var extrudeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    extrudeGeo.rotateX(Math.PI/2);

    var extrudeMat = new THREE.MeshPhongMaterial({color: 0xAAAAAA, specular: 0x111111, shininess: 30});

    var extrude = new THREE.Mesh(extrudeGeo, extrudeMat);

    this.add(extrude);

    //Serigrafía

    const loader = new FontLoader();

    var mesh = null;

    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {

      const geometry = new TextGeometry('Robot', {
        font: font,
        size: 1,
        depth: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 3
      });
      geometry.rotateX(-Math.PI/2);
      geometry.translate(-1.8,-0.1,0);
      geometry.scale(0.2,0.2,0.2);
      

      var material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, specular: 0xAAAAAA, shininess: 70});
      mesh = new THREE.Mesh(geometry, material);

      // Añadir mesh a la escena dentro de la función de callback
      this.add(mesh);
    }.bind(this)); // Asegúrate de que 'this' se refiere al objeto correcto

    this.position.set(-0.3,0.3,0);
    this.rotateX(Math.PI/3);

    this.scale.set(0.7,0.7,0.7);
 
  }

  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }

}

export { Tornillos }
