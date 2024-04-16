import * as THREE from 'three'

class Chasis extends THREE.Object3D {

    constructor() {
        super();

        //Crear path con puntos (Vertex3D) para un tube

        let points = [
            new THREE.Vector3(-1.2, 0, 0),
            new THREE.Vector3(-1.2, 1.8, 0),
            new THREE.Vector3(-1.2, 2, 0),
            new THREE.Vector3(-1, 2, 0),
            new THREE.Vector3(1, 2, 0),
            new THREE.Vector3(1.2, 2, 0),
            new THREE.Vector3(1.2, 1.8, 0),
            new THREE.Vector3(1.2, -1.8, 0),
            new THREE.Vector3(1.2, -2, 0),
            new THREE.Vector3(1, -2, 0),
            new THREE.Vector3(-1, -2, 0),
            new THREE.Vector3(-1.2, -2, 0),
            new THREE.Vector3(-1.2, -1.8, 0),
            new THREE.Vector3(-1.2, 0, 0)
        ];
        
        // Crear un camino a partir de los puntos
        let curvePath = new THREE.CatmullRomCurve3(points);

        // Crear una geometría de tubo a partir del camino
        let geometry = new THREE.TubeGeometry(curvePath, 20, 0.08, 8, false);
        geometry.rotateX(Math.PI / 2);

        // Crear un material
        let material = new THREE.MeshPhongMaterial({ color: 0x999999 , specular: 0x333333, shininess: 100});

        // Crear una malla a partir de la geometría y el material
        let tube1 = new THREE.Mesh(geometry, material);

        //----------------------------------------------------------------------------------------

        let points2 = [
            new THREE.Vector3(-0.3, 0, -2),
            new THREE.Vector3(-0.3, 1, -1),
            new THREE.Vector3(-0.3, 1, 1),
            new THREE.Vector3(-0.3, 0, 2),
        ];

        let curvePath2 = new THREE.CatmullRomCurve3(points2);

        // Crear una geometría de tubo a partir del camino
        let geometry2 = new THREE.TubeGeometry(curvePath2, 20, 0.08, 8, false);
        
        let tube2 = new THREE.Mesh(geometry2, material);

        //--------------------------------------------------------------------------------------------
        
        let tube3 = tube2.clone();
        tube3.translateX(0.6);

        this.add(tube1);
        this.add(tube2);
        this.add(tube3);
        
        //--------------------------------------------------------------------------------------------

        //Union ruedas con chasis
        let union = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 20);
        union.rotateZ(Math.PI / 2);

        let union2 = union.clone();
        union2.translate(0,0,1.3);

        let union3 = union.clone();
        union3.translate(0,0,-1.3);

        let union4 = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 20);
        union4.rotateZ(Math.PI / 2);
        union4.translate(0,1.17,0);

        let materialUnion = new THREE.MeshPhongMaterial({ color: 0x444444 , specular: 0x333333, shininess: 100});

        let unionM = new THREE.Mesh(union, materialUnion);
        let unionM2 = new THREE.Mesh(union2, materialUnion);
        let unionM3 = new THREE.Mesh(union3, materialUnion);

        let unionM4 = new THREE.Mesh(union4, materialUnion);

        //--------------------------------------------------------------------------------------------

        let unionBaja = new THREE.CylinderGeometry(0.1, 0.1, 2.6, 20);
        unionBaja.rotateX(Math.PI / 2);

        let unionBajaM = new THREE.Mesh(unionBaja, materialUnion);

        //--------------------------------------------------------------------------------------------

        let troncoGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 20);
        troncoGeometry.translate(0, 1, 0);

        let tronco = new THREE.Mesh(troncoGeometry, materialUnion);

        this.add(tronco);

        //--------------------------------------------------------------------------------------------

        let brazos = new THREE.CylinderGeometry(0.15, 0.15, 2.4, 20);
        brazos.rotateZ(Math.PI / 2);
        brazos.translate(0, 1.6, 0);

        let brazosM = new THREE.Mesh(brazos, materialUnion);

        this.add(brazosM);

        //--------------------------------------------------------------------------------------------

        this.add(unionM);
        this.add(unionM2);
        this.add(unionM3);

        this.add(unionM4);

        this.add(unionBajaM);

        //--------------------------------------------------------------------------------------------

        let placaSolarGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.6);
        placaSolarGeometry.rotateX(-Math.PI / 4);

        let texture = new THREE.TextureLoader().load('../imgs/placa_solar.jpg');
        let materialPlacaSolar = new THREE.MeshPhongMaterial({ map: texture });

        let placaSolar = new THREE.Mesh(placaSolarGeometry, materialPlacaSolar);

        placaSolar.position.set(0, 1, -1.3);

        this.add(placaSolar);

    }

    update() {
        // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
    }

}

export { Chasis }
