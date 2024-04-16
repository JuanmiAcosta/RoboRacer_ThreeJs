
import * as THREE from 'three'

import { CSG } from '../../../libs/CSG-v2.js'


class Brazo_robot extends THREE.Object3D {

  constructor(side) {
    super();

    this.side=side;

    //-----------------------------------------------------------------------------------

    var hombroGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16, 16, false, 0, Math.PI * 2);

    var artiHombroGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16, 16, false, 0, Math.PI * 2);
    artiHombroGeo.translate(0, 0.15, 0);

    var brazoGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16, 16, false, 0, Math.PI * 2);
    brazoGeo.rotateZ(Math.PI / 2);
    brazoGeo.translate(0.5, 0.15, 0);

    var acero = new THREE.MeshPhongMaterial({ color: 0xAAAAAA }); // gris plateado
    var negro = new THREE.MeshPhongMaterial({ color: 0x000000 }) // negro

    this.hombro = new THREE.Mesh(hombroGeo, acero);
    this.artiHombro = new THREE.Mesh(artiHombroGeo, acero);
    this.brazo = new THREE.Mesh(brazoGeo, negro)

    this.add(this.hombro);
    this.hombro.add(this.artiHombro);
    this.hombro.add(this.brazo);

    //---------------------------------------------------------------------------------------

    this.codo = new THREE.Mesh(hombroGeo, acero);
    this.artiCodo = new THREE.Mesh(artiHombroGeo, acero);
    this.anteBrazo = new THREE.Mesh(brazoGeo, negro);

    this.codo.position.x = 1;
    this.codo.position.y = 0.15;

    this.codo.scale.set(0.8, 0.8, 0.8);

    this.brazo.add(this.codo);
    this.codo.add(this.artiCodo);
    this.codo.add(this.anteBrazo);

    //---------------------------------------------------------------------------------------

    var manoGeo = new THREE.TorusGeometry(0.3, 0.1, 12, 48);
    manoGeo.rotateX(Math.PI / 2);
    var manoMesh = new THREE.Mesh(manoGeo, acero);

    var cuboResta = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    var cuboRestaMesh = new THREE.Mesh(cuboResta, acero);
    cuboRestaMesh.rotation.y = Math.PI / 4;
    cuboRestaMesh.position.set(0.4, 0, 0);

    const manoMeshCSG = new CSG().setFromMesh(manoMesh);

    const result1 = manoMeshCSG.subtract([cuboRestaMesh]);
    this.resultMesh1 = new THREE.Mesh(result1.toGeometry(), acero);


    this.resultMesh1.position.x += 1.1;
    this.resultMesh1.position.y += 0.15;
    this.anteBrazo.add(this.resultMesh1);

    //----------------------------------------------------------------------------------------

  }

}

export { Brazo_robot }
