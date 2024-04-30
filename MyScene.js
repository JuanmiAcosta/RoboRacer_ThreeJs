
import * as THREE from 'three'
import { GUI } from './libs/dat.gui.module.js'
import { TrackballControls } from './libs/TrackballControls.js'

import { Ensamblado } from './modelos/coche_lunar/Ensamblado.js' //Modelo robot principal 
import { Circuito } from './modelos/circuito/Circuito.js';

class MyScene extends THREE.Scene {

  constructor(myCanvas) {
    super();

    this.renderer = this.createRenderer(myCanvas);

    this.gui = this.createGUI();

    this.createLights();

    this.createCamera();
    this.createCameraThirdPerson();

    // this.axis = new THREE.AxesHelper(1);
    // this.axis.position.set(0, 0, 0);
    // this.add(this.axis);

    this.circuito = new Circuito();
    this.add(this.circuito);

    this.prota = new Ensamblado(this.circuito.children[0]);
    //this.prota.add(this.cameraController); //Añadimos la cámara al prota
    this.add(this.prota);

    this.fondo = new THREE.Mesh(new THREE.SphereGeometry(400, 400, 400), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }));
    this.add(this.fondo);

    // Escuchar eventos de teclado
    document.addEventListener('keydown', (event) => {
      this.leerEntrada(event);
      this.moverProta();
    });

    document.addEventListener('keyup', (event) => {
      this.leerEntrada(event);
      this.moverProta();
    });

    //Crear un map para almacenar tecla y booleano
    this.teclas = new Map();
    this.leerEntrada = (e) => {
      if(e.type === 'keydown'){
        this.teclas.set(e.key,true);
      }else if(e.type === 'keyup'){
        this.teclas.set(e.key,false);
      }
      console.log(this.teclas);
    }
  }

  createCamera() {

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);

    this.camera.position.set(0, 0, 200);
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;

    this.cameraControl.target = look;
  }

  createCameraThirdPerson() {

    this.cameraController = new THREE.Object3D();
    this.cameraController.position.set(0, 30, -19);
    this.cameraController.rotateY(Math.PI);
    this.cameraController.rotateX(-Math.PI / 8);

    this.camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 600);

    this.cameraController.add(this.camera2);
    this.cameraController.add(this.iluminacionProta);
  }

  createGUI() {

    var gui = new GUI();

    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightPower: 600.0,  // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity: 0.80,
      axisOnOff: true,
      t: 0.5,
      alfa: 0,
      cambia: false
    }

    var folder = gui.addFolder('Luz y Ejes');

    folder.add(this.guiControls, 'lightPower', 0, 2000, 10)
      .name('Luz puntual : ')
      .onChange((value) => this.setLightPower(value));

    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setAmbientIntensity(value));

    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange((value) => this.setAxisVisible(value));

    folder.add(this.guiControls, 't', 0, 1, 0.0001)
      .name('Recorrido : ')
      .onChange((value) => this.prota.update(value, this.guiControls.alfa));

    folder.add(this.guiControls, 'alfa', 0, 2 * Math.PI, 0.01)
      .name('Giro : ')
      .onChange((value) => this.prota.update(this.guiControls.t, value));

    folder.add(this.guiControls, 'cambia')
      .name('Cambia camara : ')
      .onChange((value) => this.cambiaCamara());

    return gui;
  }

  moverProta(){
    if (this.teclas.get('w')) {
      this.prota.update((this.prota.t + 0.0005) % 1, this.prota.alfa);
      console.log("ADELANTE");
    }
    if (this.teclas.get('a')) {
      this.prota.update(this.prota.t, (this.prota.alfa - 0.05) % (Math.PI * 2));
      console.log("IZQUIERDA");
    }
    if (this.teclas.get('s')) {
      this.prota.update((this.prota.t - 0.0005) % 1, this.prota.alfa);
      console.log("ATRAS");
    }
    if (this.teclas.get('d')) {
      this.prota.update(this.prota.t, (this.prota.alfa + 0.05) % (Math.PI * 2));
      console.log("DERECHA");
    }
  }

  cambiaCamara() {
    if (this.guiControls.cambia) {
      this.remove(this.camera);
      this.prota.children[0].children[0].add(this.cameraController);
    } else {
      this.prota.children[0].children[0].remove(this.cameraController);
      this.add(this.camera);
    }
  }

  createLights() {

    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);

    this.pointLight = new THREE.SpotLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(0, 0, 2);
    this.add(this.pointLight);

    this.pointLight2 = new THREE.SpotLight(0xffffff);
    this.pointLight2.power = this.guiControls.lightPower;
    this.pointLight2.position.set(0, 0, -2);
    this.add(this.pointLight2);

    this.iluminacionProta = new THREE.SpotLight(0xffffff);
    this.iluminacionProta.power = this.guiControls.lightPower;

  }

  setLightPower(valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity(valor) {
    this.ambientLight.intensity = valor;
  }

  setAxisVisible(valor) {
    this.axis.visible = valor;
  }

  createRenderer(myCanvas) {

    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

    renderer.setSize(window.innerWidth, window.innerHeight);

    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  getCamera() {
    if (this.guiControls.cambia) {
      return this.camera2;
    } else {
      return this.camera;
    }
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {

    this.setCameraAspect(window.innerWidth / window.innerHeight);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {

    this.renderer.render(this, this.getCamera());

    if (!this.guiControls.cambia) {
      this.cameraControl.update();
    }


    this.moverProta();

    requestAnimationFrame(() => this.update());

  }
}


/// La función  main
$(function () {

  var scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();

});
