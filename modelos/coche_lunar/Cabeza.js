
import * as THREE from 'three'

class Cabeza extends THREE.Object3D {

  constructor() {
    super();

    //TRAERA--------------------------------------------------------------------------------------------
    
    //Hacer un shape 
    let traseraShape = new THREE.Shape();
    traseraShape.moveTo(-0.6, 0);
    traseraShape.lineTo(0.6, 0);
    traseraShape.lineTo(0.3, 0.5);
    traseraShape.lineTo(-0.3, 0.5);

    //Hacer un extrude geometry
    let extrudeSettings = {
      steps: 2,
      depth: 0.5,
      bevelEnabled: false
    };

    let traseraGeometry = new THREE.ExtrudeGeometry(traseraShape, extrudeSettings);
    traseraGeometry.rotateX(-Math.PI / 2);
    traseraGeometry.translate(0, 2, 0);

    let traseraMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
    let trasera = new THREE.Mesh(traseraGeometry, traseraMaterial);

    //DELANTERA-----------------------------------------------------------------------------------------

      let delanteraGeo = new THREE.BoxGeometry(1.8, 1, 0.5);
      delanteraGeo.translate(0, 2.5, 0);

      let panelGeo = new THREE.BoxGeometry(1.4, 0.8, 0.2);
      panelGeo.translate(0, 2.5, 0.2);

      let delanteraMaterial = new THREE.MeshPhongMaterial({ color: 0xAAAAAA });
      let delantera = new THREE.Mesh(delanteraGeo, delanteraMaterial);

      //VIDEO COMO TEXTURA on loop
      let video = document.createElement('video');
      video.src = 'imgs/HUD.mp4';
      video.load();
      video.play();
      video.loop = true;

      let videoTexture = new THREE.VideoTexture(video);
      let panel = new THREE.Mesh(panelGeo, new THREE.MeshPhongMaterial({ map: videoTexture }));

    //---------------------------------------------------------------------------------------------------

    this.add(trasera);
    this.add(delantera);
    this.add(panel);

  }

  update() {

  }

}

export { Cabeza }
