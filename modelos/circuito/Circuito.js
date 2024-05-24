
import * as THREE from 'three'

class Circuito extends THREE.Object3D {

  constructor() {
    super();
    //----------------------------------------------------------------------------------------

    // Torus knot 
    var torusKnotGeometry = new THREE.TorusKnotGeometry(100, 10, 80, 20, 1, 5);

    var texture = new THREE.TextureLoader().load("./textures/circuitoT.jpg");
    texture.wrapS=THREE.RepeatWrapping;
    texture.wrapT=THREE.RepeatWrapping;
    texture.repeat.set(10,3);

    var materialCircuito = new THREE.MeshPhongMaterial({ map: texture });

    // A partir del torius knot hacer un tubeGeometry
    var path = this.getPathFromTorusKnot(torusKnotGeometry);

    var tubeGeometry = new THREE.TubeGeometry(path, 300, 20, 300, true);

    var tube = new THREE.Mesh(tubeGeometry, materialCircuito);
    this.add(tube);
  }

  getPathFromTorusKnot(torusKnot) {

    const p = torusKnot.parameters.p;
    const q = torusKnot.parameters.q;
    const radius = torusKnot.parameters.radius;
    const resolution = torusKnot.parameters.tubularSegments;
    var u, cu, su, quOverP, cs;
    var x, y, z;
    // En  points  se almacenan los puntos que extraemos del torusKnot
    const points = [];
    for (let i = 0; i < resolution; ++i) {
      u = i / resolution * p * Math.PI * 2;
      cu = Math.cos(u);
      su = Math.sin(u);
      quOverP = q / p * u;
      cs = Math.cos(quOverP);

      x = radius * (2 + cs) * 0.5 * cu;
      y = radius * (2 + cs) * su * 0.5;
      z = radius * Math.sin(quOverP) * 0.5;

      points.push(new THREE.Vector3(x, y, z));
    }
    // Una vez tenemos el array de puntos 3D construimos y devolvemos el CatmullRomCurve3
    return new THREE.CatmullRomCurve3(points, true);
  }

  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }

}

export { Circuito }
