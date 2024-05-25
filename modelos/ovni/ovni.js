import * as THREE from 'three'//Se importa la biblioteca three.module.js
import {CSG} from '../../libs/CSG-v2.js'
import { Plancton } from './plancton.js'
 
class Ovni extends THREE.Object3D { 
  //Constructor de la clase MyBox
  constructor(tuboMesh, t , alfa ) {
    super();

    this.VIDAS=4;

    this.MAX_ALTURA = 2;
    this.MIN_ALTURA = -1.5;
    this.SUBIENDO = true;

    this.t = t;
    this.alfa = alfa;

    var geomTubo = tuboMesh.geometry;

    this.ensamblado = new THREE.Object3D();

    //---------------

    this.padreCannon1 = new THREE.Object3D();
    this.padreCannon2 = new THREE.Object3D();

    this.createOvni();
    this.createCannons();
    this.createHeadOvni();
    this.light = this.createLights();

    this.padreCannon1.add(this.cannon1);
    this.padreCannon2.add(this.cannon2);

    this.padreCannon1.position.x=-1;
    this.padreCannon2.position.x=1;
    this.padreCannon1.position.z=2.57;
    this.padreCannon2.position.z=2.57;
    this.padreCannon1.position.y=-1.5;
    this.padreCannon2.position.y=-1.5;

    //Añadimos el plancton a la escena y lo colocamos
    this.plancton = new Plancton();
    this.plancton.scale.set(0.23,0.23,0.23);
    this.plancton.position.y = 0.25;
    this.plancton.position.z = -0.4;

    //Añadimos el resto de elementos y obtenemos el ovni final
    var luces = new THREE.Object3D();
    this.light.forEach(light => {
      light.scale.set(0.5, 0.5, 0.5);
      luces.add(light);
    });

    this.ensamblado.add(this.padreCannon1);
    this.ensamblado.add(this.padreCannon2);
    this.ensamblado.add(this.plancton);
    this.ensamblado.add(this.ovni);
    this.ensamblado.add(luces);
    this.ensamblado.add(this.headFinal);
    this.ensamblado.rotateY(Math.PI);

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

  restarVida(){
    this.VIDAS--;
  }

  restaurarVida(){  
    this.VIDAS=4;
  }

  createOvni(){
    var points = [];
    points.push(new THREE.Vector2(0,-2));
    points.push(new THREE.Vector2(3,-2));
    points.push(new THREE.Vector2(3,-1));
    points.push(new THREE.Vector2(5,0));
    points.push(new THREE.Vector2(0,0));

    var segmentos = 100;
    var angle = 2 * Math.PI;

    var latheGeometry = new THREE.LatheGeometry(points, segmentos, 0, angle);

    var material = new THREE.MeshStandardMaterial({color: 0x9B9B9B, side: THREE.DoubleSide });

    this.ovni_basic = new THREE.Mesh(latheGeometry, material);

    //-------------------------------//
    //Quitamos de la mitad del ovni mediante CSG un circulo de menor tamaño 
    //que la esfera  del cristal para tener hueco y meter al plancton
    var headGeo = new THREE.SphereGeometry(2,20);
    var color = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.1});
    this.head = new THREE.Mesh(headGeo,color);

    const base = new CSG().setFromMesh(this.ovni_basic);
    const base_final = base.subtract([this.head]);

    this.ovni = new THREE.Mesh(base_final.toGeometry(),material);
  }

  /**
   * Función para crear el cristal de la parte de arriba del platillo
   */
  createHeadOvni(){
    //Creamos una esfera transparente con poca opacidad
    var headGeo = new THREE.SphereGeometry(2,20);
    var color = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.4});
    this.head = new THREE.Mesh(headGeo,color);

    //Creamos una caja para quitarsela a la esfera creada y quedarnos con una semiesfera
    var box = new THREE.BoxGeometry(5,4,5);
    this.box = new THREE.Mesh(box,color);
    this.box.position.y=-2;

    //Mediante CSG le quitamos a la esfera la mitad de abajo 
    const base = new CSG().setFromMesh(this.head);
    const base_final = base.subtract([this.box]);

    //El mesh que contiene la semiesfera final
    this.headFinal = new THREE.Mesh(base_final.toGeometry(),color);
  }

  createLights() {
    const lights = [];

    //Representamos las luces mediante esferas
    var geometrySphere = new THREE.SphereGeometry(0.6,20);
    var colorAmarillo = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });

    //Creamos las luces en el borde del platillo alrededor del mismo,calculando el nuevo valor de X y Z mediante cos y sen del ángulo
    for (let i = 0; i < 10; i++) {
        const lightMesh = new THREE.Mesh(geometrySphere.clone(), colorAmarillo.clone());
        const angle = (i / 10) * Math.PI * 2;
        const radius = 4.05;//Distancia al centro del platilla en el que se encontraran las luces
        const posX = Math.cos(angle) * radius;
        const posZ = Math.sin(angle) * radius;

        lightMesh.position.set(posX, 0, posZ);

        lights.push(lightMesh);
    }
    return lights;
  }
  
  createCannons(){
    var cannonsGeo = new THREE.CylinderGeometry(0.2,0.2,2);

    const colorNegro = new THREE.MeshStandardMaterial( {color:0x000000} );

    this.cannon1 = new THREE.Mesh(cannonsGeo,colorNegro);
    this.cannon2 = new THREE.Mesh(cannonsGeo,colorNegro);

    this.cannon1.rotation.x=Math.PI/2;
    this.cannon2.rotation.x=Math.PI/2;
    this.cannon1.position.z=1;
    this.cannon2.position.z=1;
  }

  moverse(){
    if (this.SUBIENDO){
      if (this.ensamblado.position.y < this.MAX_ALTURA){
        this.ensamblado.position.y += 0.03;
      } else {
        this.SUBIENDO = false;
      }
    }
    else {
      if (this.ensamblado.position.y > this.MIN_ALTURA){
        this.ensamblado.position.y -= 0.03;
      } else {
        this.SUBIENDO = true;
      }
    }

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

    this.padreTraslation.position.y = (this.radio+6); //Para que el coche no esté enterrado en el suelo

    this.padreRotation.rotation.z = (alfa);

    this.t = t;
    this.alfa = alfa;
    
  }
}

export { Ovni };
