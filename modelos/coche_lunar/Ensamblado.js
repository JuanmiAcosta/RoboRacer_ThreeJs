import * as THREE from 'three'

//EL COCHE TIENE TRANSFORMACIONES, ANIMACIONES, CSG EN LA MANO Y CABEZA, TUBEGEOMETRY CON UN PATH.

// Clases de mi proyecto

import { Brazo_robot } from './Brazo_robot.js'
import { Ruedas } from './Ruedas.js'
import { Chasis } from './Chasis.js'
import { Cabeza } from './Cabeza.js'

class Ensamblado extends THREE.Object3D {

  constructor(tuboMesh, t = 0.5 ) {
    super();

    var geomTubo = tuboMesh.geometry;

    // BRAZO --------------------------------------------------------------------------------------------

    this.brazor = new Brazo_robot("r");
    this.brazor.position.set(-1.2, 1.6, 0);
    this.brazor.rotation.z = Math.PI / 2;
    this.brazor.rotation.x = Math.PI;
    //this.brazo.scale.set(0.5, 0.5, 0.5); //Así mide un metro de largo
    this.add(this.brazor);

    this.brazol = new Brazo_robot("l");
    this.brazol.position.set(1.2, 1.6, 0);
    this.brazol.rotation.y = Math.PI
    this.brazol.rotation.z = Math.PI / 2;
    this.brazol.rotation.x = Math.PI;

    this.add(this.brazol);

    // RUEDAS --------------------------------------------------------------------------------------------

    this.ruedalt = new Ruedas();
    this.ruedalb = new Ruedas();
    this.ruedart = new Ruedas();
    this.ruedarb = new Ruedas();
    this.ruedalm = new Ruedas();
    this.ruedarm = new Ruedas();

    this.ruedart.rotation.y = Math.PI;
    this.ruedarb.rotation.y = Math.PI;
    this.ruedarm.rotation.y = Math.PI;

    this.ruedalt.position.set(0.7, 0, 1.3);
    this.ruedalb.position.set(0.7, 0, -1.3);
    this.ruedart.position.set(-0.7, 0, 1.3);
    this.ruedarb.position.set(-0.7, 0, -1.3);
    this.ruedalm.position.set(0.7, 0, 0);
    this.ruedarm.position.set(-0.7, 0, 0);

    this.add(this.ruedalt);
    this.add(this.ruedalb);

    this.add(this.ruedart);
    this.add(this.ruedarb);

    this.add(this.ruedalm);
    this.add(this.ruedarm);

    // CHASIS --------------------------------------------------------------------------------------------

    this.chasis = new Chasis();
    this.add(this.chasis);

    // CABEZA --------------------------------------------------------------------------------------------

    this.cabeza = new Cabeza();
    this.add(this.cabeza);

    // TUBO --------------------------------------------------------------------------------------------
    // El constructor del personaje recibe la geometria del Tubo para extraer información necesaria
    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    this.update(t);
  }

  update(t) {
    

    var posTmp = this.path.getPointAt(t);
    this.position.copy(posTmp);
    // Para l a o r i e n t a c i ón necesitamos l a tangente y l a binormal del tubo en esa p o s i c i ón
    // también los extraemos del camino y tubo respectivamente
    var tangente = this.path.getTangentAt(t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(t * this.segmentos);
    this.up = this.tubo.binormals[segmentoActual];
    this.lookAt(posTmp);

    this.translateY(this.radio+0.5); //Para que el coche no esté enterrado en el suelo
    
  }

}

export { Ensamblado }
