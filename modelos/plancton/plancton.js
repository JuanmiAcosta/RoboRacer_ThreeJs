import * as THREE from 'three'//Se importa la biblioteca three.module.js

class Plancton extends THREE.Object3D {
  //Constructor de la clase MyBox
  constructor(tuboMesh, t , alfa) {
    super();

    this.t = t;
    this.alfa = alfa;

    this.geomTubo = tuboMesh.geometry;

    this.ensamblado = new THREE.Object3D();

    this.padrePupila = new THREE.Object3D();
    this.padreOjoCompleto = new THREE.Object3D();
    this.padre = new THREE.Object3D();
    this.padrePierna1 = new THREE.Object3D();
    this.padrePierna2 = new THREE.Object3D();
    this.padreAntena1 = new THREE.Object3D();
    this.padreAntena2 = new THREE.Object3D();
    this.padreBrazo1 = new THREE.Object3D();
    this.padreBrazo2 = new THREE.Object3D();

    this.createEyeBrow();
    this.createEyePlancton();
    this.createEyePupilePlancton();
    this.createBodyPlancton();
    this.createMouthPlancton();
    this.createAntennasPlancton();
    this.createLegsPlancton();
    this.createArmsPlancton();

    this.padrePupila.add(this.eyePupilePlancton);


    this.padreOjoCompleto.add(this.padrePupila);
    this.padreOjoCompleto.add(this.eyePlancton);

    this.padreOjoCompleto.position.z = 2;



    this.padreAntena1.add(this.antena1);
    this.padreAntena2.add(this.antena2);

    this.padreAntena1.position.y = 5;
    this.padreAntena1.position.x = 1;
    this.padreAntena2.position.y = 5;
    this.padreAntena2.position.x = -1;



    this.padrePierna1.add(this.leg1);
    this.padrePierna2.add(this.leg2);

    this.padrePierna1.position.x = -1;
    this.padrePierna2.position.x = 1;
    this.padrePierna1.position.y = -6.5;
    this.padrePierna2.position.y = -6.5;


    this.padreBrazo1.add(this.arm1);
    this.padreBrazo2.add(this.arm2);

    this.padreBrazo1.position.y = -2;
    this.padreBrazo1.position.x = -2;
    this.padreBrazo2.position.y = -2;
    this.padreBrazo2.position.x = 2;


    this.padre.add(this.bodyPlancton);
    this.padre.add(this.padreOjoCompleto);
    this.padre.add(this.mouthPlancton);
    this.padre.add(this.eyeBrow);
    this.padre.add(this.padreAntena1);
    this.padre.add(this.padreAntena2);
    this.padre.add(this.padrePierna1);
    this.padre.add(this.padrePierna2);
    this.padre.add(this.padreBrazo1);
    this.padre.add(this.padreBrazo2);
    this.padre.position.z = 2;

    this.padre.scale.set(0.5, 0.5, 0.5);
    this.padre.rotation.y = Math.PI;
    this.padre.translateY(3.4);

    this.ensamblado.add(this.padre);

    // TUBO --------------------------------------------------------------------------------------------
    // El constructor del personaje recibe la geometria del Tubo para extraer información necesaria
    this.tubo = this.geomTubo;
    this.path = this.geomTubo.parameters.path;
    this.radio = this.geomTubo.parameters.radius;
    this.segmentos = this.geomTubo.parameters.tubularSegments;

    this.padreTraslation = new THREE.Object3D();
    this.padreTraslation.add(this.ensamblado);

    this.padreRotation = new THREE.Object3D();
    this.padreRotation.add(this.padreTraslation);

    this.padrisimo = new THREE.Object3D();
    this.padrisimo.add(this.padreRotation);

    this.add(this.padrisimo);

    this.update(t,alfa);

  }

  createHeartShape() {
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -2);
    heartShape.bezierCurveTo(-2, 0, -2, 2, 0, 0.5);
    heartShape.bezierCurveTo(2, 2, 2, 0, 0, -2);

    const material = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide });

    const extrudeSettings = {
      steps: 20, //Número de divisiones de la extrsuión
      depth: 1, //Profundida de la extrusión
      bevelEnabled: false, //Desavtivar el bisel para tener extrusión plana   
    };

    const geometryExtrude = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    this.heart = new THREE.Mesh(geometryExtrude, material);
  }

  createEyeBrow() {

    const eyeBrowShape = new THREE.Shape();
    eyeBrowShape.moveTo(-3, 0);
    eyeBrowShape.lineTo(-3.5, 0.25);
    eyeBrowShape.lineTo(-2.5, 0.25);
    eyeBrowShape.lineTo(-3, 0.75);
    eyeBrowShape.lineTo(-2, 0.65);
    eyeBrowShape.lineTo(-2, 1);

    eyeBrowShape.quadraticCurveTo(0, -0.5, 2, 1);
    eyeBrowShape.lineTo(2, 0.65);
    eyeBrowShape.lineTo(3, 0.75);
    eyeBrowShape.lineTo(2.5, 0.25);
    eyeBrowShape.lineTo(3.5, 0.25);

    eyeBrowShape.quadraticCurveTo(0, -1.75, -3, 0);

    //------------------------------------------------//

    const colorNegro = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const extrudeSettings = {
      steps: 20,
      depth: 0.1,
      bevelEnabled: false,
    };

    var geometryExtrude = new THREE.ExtrudeGeometry(eyeBrowShape, extrudeSettings);

    this.eyeBrow = new THREE.Mesh(geometryExtrude, colorNegro);

    this.eyeBrow.position.z = 3;
    this.eyeBrow.position.y = 2.5;
  }


  createEyePlancton() {

    const eyePlancton = new THREE.SphereGeometry(2, 20, 20);

    const colorAmarillo = new THREE.MeshStandardMaterial({ color: 0xFFFEBA });

    this.eyePlancton = new THREE.Mesh(eyePlancton, colorAmarillo);

    this.eyePlancton.scale.set(1, 1.4, 1);

    this.eyePlancton.position.z = -0.5;
  }

  createEyePupilePlancton() {

    const eyePupilePlancton = new THREE.Shape();
    eyePupilePlancton.moveTo(-0.75, 0);
    eyePupilePlancton.bezierCurveTo(-0.75, 1, 0.75, 1, 0.75, 0);
    eyePupilePlancton.bezierCurveTo(0.75, -1, -0.75, -1, -0.75, 0);

    const colorRojo = new THREE.MeshStandardMaterial({ color: 0xFE0000 });

    const extrudeSettings = {
      steps: 20,
      depth: 0.1,
      bevelEnabled: false,
    }

    var geometryExtrude = new THREE.ExtrudeGeometry(eyePupilePlancton, extrudeSettings);

    this.eyePupilePlancton = new THREE.Mesh(geometryExtrude, colorRojo);

    this.eyePupilePlancton.position.z = 1.6;
  }

  createBodyPlancton() {

    var cuerpoGeo = new THREE.CapsuleGeometry(3, 8, 20, 20);

    var colorVerde = new THREE.MeshStandardMaterial({ color: 0x008f39 });

    this.bodyPlancton = new THREE.Mesh(cuerpoGeo, colorVerde);

    this.bodyPlancton.position.y = -1.5;
  }

  createMouthPlancton() {

    const mouthShape = new THREE.Shape();
    mouthShape.moveTo(-3, 0);
    mouthShape.bezierCurveTo(-2, 2, 2, 2, 3, 0);
    mouthShape.bezierCurveTo(1.5, 1, -1.5, 1, -3, 0);

    const colorNegro = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const extrudeSettings = {
      steps: 20,
      depth: 0.1,
      bevelEnabled: false,
    };

    var extrudeGeometry = new THREE.ExtrudeGeometry(mouthShape, extrudeSettings);

    this.mouthPlancton = new THREE.Mesh(extrudeGeometry, colorNegro);

    this.mouthPlancton.scale.set(0.7, 1.5, 0.8);

    this.mouthPlancton.position.z = 3;
    this.mouthPlancton.position.y = -5;
  }

  createAntennasPlancton() {

    var antenaGeo = new THREE.CylinderGeometry(0.2, 0.2, 5);

    const colorNegro = new THREE.MeshStandardMaterial({ color: 0x000000 });

    this.antena1 = new THREE.Mesh(antenaGeo, colorNegro);
    this.antena2 = new THREE.Mesh(antenaGeo, colorNegro);

    this.antena1.rotation.z = -Math.PI / 8;
    this.antena2.rotation.z = Math.PI / 8;

    this.antena2.position.x = -0.9;
    this.antena2.position.y = 2.15;

    this.antena1.position.x = 0.9;
    this.antena1.position.y = 2.15;
  }

  createLegsPlancton() {

    var antenaGeo = new THREE.CylinderGeometry(0.3, 0.2, 4);

    const colorVerde = new THREE.MeshStandardMaterial({ color: 0x008f39 });

    this.leg1 = new THREE.Mesh(antenaGeo, colorVerde);
    this.leg2 = new THREE.Mesh(antenaGeo, colorVerde);

    this.leg1.position.y = -2;
    this.leg2.position.y = -2;
  }


  createArmsPlancton() {

    var antenaGeo = new THREE.CylinderGeometry(0.3, 0.2, 4);

    const colorVerde = new THREE.MeshStandardMaterial({ color: 0x008f39 });

    this.arm1 = new THREE.Mesh(antenaGeo, colorVerde);
    this.arm2 = new THREE.Mesh(antenaGeo, colorVerde);

    this.arm1.position.x = -2;
    this.arm2.position.x = 2;

    this.arm1.rotation.z = -Math.PI / 3;
    this.arm2.rotation.z = Math.PI / 3;
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

    this.padreTraslation.position.y = (this.radio+1.4); //Para que el coche no esté enterrado en el suelo

    this.padreRotation.rotation.z = (alfa);

    this.t = t;
    this.alfa = alfa;
    
  }
}

export { Plancton };
