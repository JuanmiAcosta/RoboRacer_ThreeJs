
import * as THREE from 'three'
import { GUI } from './libs/dat.gui.module.js'
import { TrackballControls } from './libs/TrackballControls.js'

import { Ensamblado } from './modelos/coche_lunar/Ensamblado.js' //Modelo robot principal 
import { Circuito } from './modelos/circuito/Circuito.js';
import { Plancton } from './modelos/plancton/plancton.js';
import { Ovni } from './modelos/ovni/ovni.js';
import { Investigacion } from './modelos/Item_investigación/Investigacion.js';
import { C_placa } from './modelos/componentes/C_placa.js';
import { C_tornillos } from './modelos/componentes/C_tornillos.js';

import { HUD } from './funciones_HUD.js'

class MyScene extends THREE.Scene {

  constructor(myCanvas) {

    super();

    this.NUMENEMIGOS = 10;
    this.NUMPREMIOS = 5;
    this.VELOCIDAD = 0.00075;

    this.renderer = this.createRenderer(myCanvas);

    this.gui = this.createGUI();

    this.createLights();

    this.createCamera();
    this.createCameraThirdPerson();
 
    this.circuito = new Circuito();
    this.add(this.circuito);

    this.prota = new Ensamblado(this.circuito.children[0]);
    this.padreNoTransformable = new THREE.Object3D();
    this.padreNoTransformable = this.prota;
    this.padreCamara = this.prota.children[0].children[0];
    this.cajaProta = new THREE.Box3().setFromObject(this.padreNoTransformable);
    this.add(this.prota);

    this.fondo = new THREE.Mesh(new THREE.SphereGeometry(600, 600, 600), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }));
    this.add(this.fondo);

    //Normales invertidas para simular la iluminación
    this.luzSol = new THREE.DirectionalLight(0xffffff, 1);
    this.luzSol.position.set(0, 0, 0);
    this.luzSol.target.position.set(0, 0, 0);
    this.add(this.luzSol);
    this.sol = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20), new THREE.MeshPhongMaterial({ color: 0xffff00,  shininess: 100, specular: 0xffff00 }));
    this.sol.position.set(0, 0, 0);
    this.add(this.sol);



    // Ejemplo enemigo

    // INICIALIZAMOS ARRAY DE OBJETOS A COLISIONAR (ENEMIGOS)
    this.enemigosAColisionar = [];
    this.tornillosAColisionar = [];
    this.placasAColisionar = [];
    this.investigacionesAColisionar = [];

    this.recienColisionado=null;

    this.colocarEnemigos();
    this.colocarPremios();

    //PARA VISUALIZAR LAS CAJAS DE COLISION

     var caja1 = new THREE.Box3Helper(this.cajaProta, 0xffff00);
     this.add(caja1);
    // var caja2 = new THREE.Box3Helper(this.cajaPlancton, 0xffff00);
    // this.add(caja2);

     caja1.visible = true;
    // caja2.visible = true;

    //----------------------------------------------------------------

    // Escuchar eventos de teclado
    document.addEventListener('keydown', (event) => {
      this.leerEntrada(event);
      this.moverProta();
    });

    document.addEventListener('keyup', (event) => {
      this.leerEntrada(event);
      this.moverProta();
    });

    document.addEventListener('keydown', (event) => {
      //Barra espaciadora -> 
      if (event.code === 'Space') {
        this.guiControls.cambia = !this.guiControls.cambia;
        this.cambiaCamara();
      }
    });

    //Crear un map para almacenar tecla y booleano
    this.teclas = new Map();
    this. leerEntrada = (e) => {
      if (e.type === 'keydown') {
        this.teclas.set(e.key, true);
      } else if (e.type === 'keyup') {
        this.teclas.set(e.key, false);
      }
      //console.log(this.teclas);
    }
  }

  colocarEnemigos() {

    for (var i = 0; i < this.NUMENEMIGOS; i++) {
      //Generar un numero aleatorio entre 0 y 1
      var aleatorio = Math.random();

      for (var j=0 ; j<3 ; j++){
        var plancton = new Plancton(this.circuito.children[0], (aleatorio*i) % 1, ((i * aleatorio) % (Math.PI * 2))+(1*j));
        this.add(plancton);
        this.cajaPlancton = new THREE.Box3( ).setFromObject(plancton);
        
        this.enemigosAColisionar.push(this.cajaPlancton);

        var ovni = new Ovni(this.circuito.children[0], (((aleatorio*i)+0.1) % 1) , ((i * aleatorio) % (Math.PI * 2))+(1*j));
        this.cajaOvni = new THREE.Box3().setFromObject(ovni);
        this.add(ovni);
        this.enemigosAColisionar.push(this.cajaOvni);
      }
      
    }

  }

  colocarPremios() {

    for (var i = 0; i < this.NUMPREMIOS; i++) {
      //Generar un numero aleatorio entre 0 y 1
      var aleatorio = Math.random();
      var tornillos = new C_tornillos(this.circuito.children[0], (aleatorio*i) % 1, (i * aleatorio) % (Math.PI * 2));
      this.cajaTornillos = new THREE.Box3().setFromObject(tornillos);
      this.add(tornillos);
      this.tornillosAColisionar.push(this.cajaTornillos);
    }

  }

  createCamera() {

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 2000);

    this.camera.position.set(0, 0, 450);
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
    this.cameraController.rotateX(-Math.PI / 12);

    this.camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.camera2.add(this.iluminacionProta);
    this.cameraController.add(this.camera2);
    
  }

  colisionaEnemigo(){
    var colision = false;
    for (var i = 0; i < this.enemigosAColisionar.length; i++) {
      if (this.cajaProta.intersectsBox(this.enemigosAColisionar[i])) {
        if (this.recienColisionado != this.enemigosAColisionar[i]){
          this.recienColisionado = this.enemigosAColisionar[i];
          colision = true;
        }
        return colision;
      }
    }
    return colision;
  }

  colisionaTornillos(){
    var colision = false;
    for (var i = 0; i < this.tornillosAColisionar.length; i++) {
      if (this.cajaProta.intersectsBox(this.tornillosAColisionar[i])) {
        if (this.recienColisionado != this.tornillosAColisionar[i]){
          this.recienColisionado = this.tornillosAColisionar[i];
          colision = true;
        }
        return colision;
      }
    }
    return colision;
  }

  createGUI() {

    var gui = new GUI();

    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightPower: 2000.0,  // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity: 2,
      axisOnOff: true,
      t: 0.5,
      alfa: 0,
      cambia: false
    }

    var folder = gui.addFolder('Luz y Ejes');

    folder.add(this.guiControls, 'lightPower', 0, 2000, 10)
      .name('Luz puntual : ')
      .onChange((value) => this.setLightPower(value));

    folder.add(this.guiControls, 'ambientIntensity', 0, 2, 0.05)
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

  moverProta() {
    if (this.teclas.get('w')) {
      this.prota.update((this.prota.t + this.VELOCIDAD) % 1, this.prota.alfa);
    }
    if (this.teclas.get('a')) {
      this.prota.update(this.prota.t, (this.prota.alfa - 0.03) % (Math.PI * 2));
    }
     if (this.teclas.get('s')) {
       this.prota.update((this.prota.t - this.VELOCIDAD) % 1, this.prota.alfa);
     }
    if (this.teclas.get('d')) {
      this.prota.update(this.prota.t, (this.prota.alfa + 0.03) % (Math.PI * 2));
    }

    this.cajaProta.setFromObject(this.padreNoTransformable);
    this.cajaProta.expandByScalar(-1);

  }
 

  cambiaCamara() {
    if (this.guiControls.cambia) {
      this.remove(this.camera);
      this.padreCamara.add(this.cameraController);
    } else {
      this.prota.children[0].children[0].remove(this.cameraController);
      this.padreCamara.add(this.camera);
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

    if (this.guiControls.cambia) {

      var camara = this.camera2;
      var nuevaRatio = window.innerWidth / window.innerHeight;

      camara.aspect = nuevaRatio;

      camara.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

    } else {

      var camara = this.camera;
      var nuevaRatio = window.innerWidth / window.innerHeight;

      camara.aspect = nuevaRatio;

      camara.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

  }

  update() {

    this.renderer.render(this, this.getCamera());

    if (!this.guiControls.cambia) {
      this.cameraControl.update();
    }

    this.moverProta();
    
    if (this.colisionaEnemigo(this.objetosACOlisionar)) {
      console.log("COLISION");
      HUD.restarVida();
    }

    if (this.colisionaTornillos(this.objetosACOlisionar)) {
      console.log("COLISION TORNILLOS");
      HUD.sumarVida();
    }

    requestAnimationFrame(() => this.update());

  }
}


/// La función  main
$(function () {

  var scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();

});
