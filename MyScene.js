
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

    this.VELOCIDAD_MAX = 0.00075;
    this.VUELTA = 0;
    this.vueltaCompletada = false;

    this.NUMENEMIGOS = 10;
    this.NUMPREMIOS = 5;
    this.SUBE_VEL = 0.000001;
    this.VELOCIDAD = 0;

    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.createLights();
    this.createCamera();
    this.createCameraThirdPerson();

    this.circuito = new Circuito();
    this.add(this.circuito);

    this.prota = new Ensamblado(this.circuito.children[0]);
    this.prota.add(this.iluminacionProta);
    this.padreNoTransformable = new THREE.Object3D();
    this.padreNoTransformable = this.prota;
    this.padreCamara = this.prota.children[0].children[0];
    this.cajaProta = new THREE.Box3().setFromObject(this.padreNoTransformable);
    this.add(this.prota);

    this.fondo = new THREE.Mesh(new THREE.SphereGeometry(600, 600, 600), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }));
    this.add(this.fondo);

    this.sol = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), new THREE.MeshPhongMaterial({ color: 0x00ffff, shininess: 80, specular: 0x00ffff, side: THREE.DoubleSide }));
    this.sol.position.set(0, 0, 0);
    this.add(this.sol);

    this.toro = new THREE.Mesh(new THREE.TorusGeometry(15, 1, 16, 100), new THREE.MeshPhongMaterial({ color: 0x00dddd, shininess: 80, specular: 0x00ffff, side: THREE.DoubleSide }));
    this.toro.position.set(0, 0, 0);

    this.toro.update = () => {
      this.toro.rotation.y += 0.01;
      this.toro.rotation.x += 0.01;
    }

    this.add(this.toro);


    //Variables picking
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    // Ejemplo enemigo

    // INICIALIZAMOS ARRAY DE OBJETOS A COLISIONAR (ENEMIGOS)
    this.enemigosAColisionar = [];
    this.tornillosAColisionar = [];
    this.placasAColisionar = [];
    this.investigacionesAColisionar = [];

    this.recienColisionadoEnemigo = null;
    this.recienColisionadoTornillo = null;
    this.recienColisionadoPlaca = null;
    this.recienColisionadoInvestigacion = null;

    this.colocarEnemigos();
    this.colocarPremios();

    //PARA VISUALIZAR LAS CAJAS DE COLISION

    var caja1 = new THREE.Box3Helper(this.cajaProta, 0xffff00);
    this.add(caja1);

    caja1.visible = true;

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

    document.addEventListener('click', (event) => {
      if (event.button === 0) {
        this.picking(event);
      }
    });

    //Crear un map para almacenar tecla y booleano
    this.teclas = new Map();
    this.leerEntrada = (e) => {
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

      for (var j = 0; j < 3; j++) {
        var plancton = new Plancton(this.circuito.children[0], (aleatorio * i) % 1, ((i * aleatorio) % (Math.PI * 2)) + (1 * j));
        this.add(plancton);
        this.cajaPlancton = new THREE.Box3().setFromObject(plancton);
        this.cajaPlancton.expandByScalar(-0.6);
        this.cajaPlanctonVisible = new THREE.Box3Helper(this.cajaPlancton,0xffff00);
        this.cajaPlanctonVisible.visible=true;
        this.add(this.cajaPlanctonVisible);
        this.enemigosAColisionar.push([this.cajaPlancton, plancton]);
        var ovni = new Ovni(this.circuito.children[0], (((aleatorio * i) + 0.2) % 1), ((i * aleatorio) % (Math.PI * 2)) + (1 * j));
        this.cajaOvni = new THREE.Box3().setFromObject(ovni);
        this.cajaOvni.expandByScalar(-3);
        this.add(ovni);
        this.enemigosAColisionar.push([this.cajaOvni, ovni]);
      }

    }

  }

  colocarPremios() {

    for (var i = 0; i < this.NUMPREMIOS; i++) {
      //Generar un numero aleatorio entre 0 y 1
      var aleatorio = Math.random();
      var tornillos = new C_tornillos(this.circuito.children[0], (aleatorio * i) % 1, (i * aleatorio) % (Math.PI * 2));
      this.cajaTornillos = new THREE.Box3().setFromObject(tornillos);
      this.cajaTornillos.expandByScalar(-2);
      this.cajaTornillosVisible = new THREE.Box3Helper(this.cajaTornillos,0xffff00);
      this.cajaTornillosVisible.visible=true;
      this.add(this.cajaTornillosVisible );
      this.add(tornillos);
      this.tornillosAColisionar.push([this.cajaTornillos, tornillos]);

      var placas = new C_placa(this.circuito.children[0], ((aleatorio * i)) % 1, (i * aleatorio) % (Math.PI * 2) + 0.4);
      this.cajaPlaca = new THREE.Box3().setFromObject(placas);
      this.cajaPlaca.expandByScalar(-2);
      this.cajaPlacaVisible = new THREE.Box3Helper(this.cajaPlaca,0xffff00);
      this.cajaPlacaVisible.visible=true;
      this.add(this.cajaPlacaVisible);
      this.add(placas);
      this.placasAColisionar.push([this.cajaPlaca, placas]);

      var investigaciones = new Investigacion(this.circuito.children[0], ((aleatorio * i)) % 1, (i * aleatorio) % (Math.PI * 2) + 0.8);
      this.cajaInvestigacion = new THREE.Box3().setFromObject(investigaciones);
      this.cajaInvestigacion.expandByScalar(-2);
      this.cajaInvestigacionVisible = new THREE.Box3Helper(this.cajaInvestigacion,0xffff00);
      this.cajaInvestigacionVisible.visible=true;
      this.add(this.cajaInvestigacionVisible);
      this.add(investigaciones);
      this.investigacionesAColisionar.push([this.cajaInvestigacion, investigaciones]);
    }

  }

  picking(event) {
    try {
      event.preventDefault();

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

      this.raycaster.setFromCamera(this.mouse, this.camera2);

      var arrayMesh = this.enemigosAColisionar.map((value) => value[1]);
      console.log(arrayMesh);

      var pickedObjects = this.raycaster.intersectObjects(arrayMesh, true);

      if (pickedObjects.length > 0) {
        //Sacar el mesh en concreto que ha sido clickado
        var mesh = pickedObjects[0].object;
        console.log("Clickado "+mesh);
        mesh.update((mesh.t + 0.5) % 1, mesh.alfa);  
      }
      
    } catch (e) {
      console.log("Se ha disparado al aire"+ e);
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
    this.cameraController.add(this.camera2);
  }

  colisionaEnemigo() {
    var colision = false;
    for (var i = 0; i < this.enemigosAColisionar.length; i++) {
      if (this.cajaProta.intersectsBox(this.enemigosAColisionar[i])) {
        if (this.recienColisionado != this.enemigosAColisionar[i]) {
          this.recienColisionado = this.enemigosAColisionar[i];
          colision = true;
        }
        return colision;
      }
    }
    return colision;
  }

  colisionaTornillos() {
    var colision = false;
    for (var i = 0; i < this.tornillosAColisionar.length; i++) {
      if (this.cajaProta.intersectsBox(this.tornillosAColisionar[i])) {
        if (this.recienColisionado != this.tornillosAColisionar[i]) {
          this.recienColisionado = this.tornillosAColisionar[i];
          colision = true;
        }
        return colision;
      }
    }
    return colision;
  }

  colisionaPlacas() {
    var colision = false;
    for (var i = 0; i < this.placasAColisionar.length; i++) {
      if (this.cajaProta.intersectsBox(this.placasAColisionar[i])) {
        if (this.recienColisionado != this.placasAColisionar[i]) {
          this.recienColisionado = this.placasAColisionar[i];
          colision = true;
          console.log("Colisiona placa");
        }
        return colision;
      }
    }
    return colision;
  }

  colisionaInvestigaciones() {
    var colision = false;
    for (var i = 0; i < this.investigacionesAColisionar.length; i++) {
      if (this.cajaProta.intersectsBox(this.investigacionesAColisionar[i])) {
        if (this.recienColisionado != this.investigacionesAColisionar[i]) {
          this.recienColisionado = this.investigacionesAColisionar[i];
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
      t: 0.5,
      alfa: 0
    }

    var folder = gui.addFolder('Gui');

    folder.add(this.guiControls, 't', 0, 1, 0.0001)
      .name('Recorrido : ')
      .onChange((value) => this.prota.update(value, this.guiControls.alfa));

    folder.add(this.guiControls, 'alfa', 0, 2 * Math.PI, 0.01)
      .name('Giro : ')
      .onChange((value) => this.prota.update(this.guiControls.t, value));

    return gui;
  }

  cambiaCamara() {
    if (this.guiControls.cambia) {
      this.remove(this.camera);
      this.padreCamara.add(this.cameraController);
    } else {
      this.padreCamara.remove(this.cameraController);
      this.add(this.camera);

      this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

      this.cameraControl.rotateSpeed = 5;
      this.cameraControl.zoomSpeed = -2;
      this.cameraControl.panSpeed = 0.5;

      this.cameraControl.target = look;
    }
  }

  createCameraThirdPerson() {

    this.cameraController = new THREE.Object3D();
    this.cameraController.position.set(0, 30, -19);
    this.cameraController.rotateY(Math.PI);
    this.cameraController.rotateX(-Math.PI / 12);

    this.camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.cameraController.add(this.camera2);
  }

  colisionaEnemigo() {
    var colision = false;
    for (var i = 0; i < this.enemigosAColisionar.length; i++) {
      let [caja, mesh] = this.enemigosAColisionar[i];
      if (this.cajaProta.intersectsBox(caja)) {
        if (this.recienColisionadoEnemigo != caja) {
          this.recienColisionadoEnemigo = caja;
          colision = true;
          this.VELOCIDAD = 0.00025;
        }
        return colision;
      }
    }
    return colision;
  }

  colisionaTornillos() {
    var colision = false;
    for (var i = 0; i < this.tornillosAColisionar.length; i++) {
      let [caja, mesh] = this.tornillosAColisionar[i];
      if (this.cajaProta.intersectsBox(caja)) {
        if (this.recienColisionadoTornillo != caja) {
          this.recienColisionadoTornillo = caja;
          colision = true;
          console.log(mesh);
        }
        return colision;
      }
    }
    return colision;
  }

  colisionaPlacas() {
    var colision = false;
    for (var i = 0; i < this.placasAColisionar.length; i++) {
      let [caja, mesh] = this.placasAColisionar[i];
      if (this.cajaProta.intersectsBox(caja)) {
        if (this.recienColisionadoPlaca != caja) {
          this.recienColisionadoPlaca = caja;
          colision = true;
          console.log(mesh);
        }
        return colision;
      }
    }
    return colision;
  }

  colisionaInvestigaciones() {
    var colision = false;
    for (var i = 0; i < this.investigacionesAColisionar.length; i++) {
      let [caja, mesh] = this.investigacionesAColisionar[i];
      if (this.cajaProta.intersectsBox(caja)) {
        if (this.recienColisionadoInvestigacion != caja) {
          this.recienColisionadoInvestigacion = caja;
          colision = true;
          console.log(mesh);
        }
        return colision;
      }
    }
    return colision;
  }

  createGUI() {

    var gui = new GUI();

    this.guiControls = {
      t: 0.5,
      alfa: 0
    }

    var folder = gui.addFolder('Gui');

    folder.add(this.guiControls, 't', 0, 1, 0.0001)
      .name('Recorrido : ')
      .onChange((value) => this.prota.update(value, this.guiControls.alfa));

    folder.add(this.guiControls, 'alfa', 0, 2 * Math.PI, 0.01)
      .name('Giro : ')
      .onChange((value) => this.prota.update(this.guiControls.t, value));

    return gui;
  }

  moverProta() {
    var atras;
    if (this.teclas.get('w')) {
      atras = false;
      this.VELOCIDAD = this.VELOCIDAD + this.SUBE_VEL;
      if (this.VELOCIDAD >= this.VELOCIDAD_MAX) {
        this.VELOCIDAD = this.VELOCIDAD_MAX;
      }
      this.prota.update((this.prota.t + this.VELOCIDAD) % 1, this.prota.alfa);

      this.compruebaVuelta();

    } else {
      if (!this.teclas.get('s') && !atras) {
        //aqui se frena
        this.VELOCIDAD = this.VELOCIDAD - 0.000005;
        if (this.VELOCIDAD < 0) {
          this.VELOCIDAD = 0;
        }
        this.prota.update((this.prota.t + this.VELOCIDAD) % 1, this.prota.alfa);
      }
    }
    if (this.teclas.get('a')) {
      this.prota.update(this.prota.t, (this.prota.alfa - 0.01) % (Math.PI * 2));
    }
    if (this.teclas.get('s')) {
      atras = true;
      this.VELOCIDAD = 0;
      if (this.prota.t - 0.0002 < 0) {
        this.prota.t = 1;
      }
      this.prota.update((this.prota.t - 0.0002) % 1, this.prota.alfa);
    }
    if (this.teclas.get('d')) {
      this.prota.update(this.prota.t, (this.prota.alfa + 0.01) % (Math.PI * 2));
    }

    this.cajaProta.setFromObject(this.padreNoTransformable);
    this.cajaProta.expandByScalar(-1.2);

  }

  compruebaVuelta() {
    if (this.prota.t > 0.99 && !this.vueltaCompletada) {
        this.VUELTA++;
        this.VELOCIDAD_MAX = this.VELOCIDAD_MAX + (this.VELOCIDAD_MAX * 0.1);
        console.log("Vuelta: " + this.VUELTA + " Velocidad: " + this.VELOCIDAD_MAX);
        this.vueltaCompletada = true;
    } else if (this.prota.t < 0.99) {
        this.vueltaCompletada = false;
    }
}

  cambiaCamara() {
    if (this.guiControls.cambia) {
      this.remove(this.camera);
      this.padreCamara.add(this.cameraController);
    } else {
      this.padreCamara.remove(this.cameraController);
      this.add(this.camera);
    }
  }

  createLights() {

    //ILUMINACION 
    //luz direccional 1
    this.iluminacionProta = new THREE.DirectionalLight(0xffaaaa, 8.5);
    this.iluminacionProta.position.set(0, 0, -50);

    //luz ambiental
    this.ambientLight = new THREE.AmbientLight(0x404040, 1);

    //luz direccional 2
    this.iluminacionProta2 = new THREE.DirectionalLight(0xaaaaff, 8.5);
    this.iluminacionProta2.position.set(0, 0, 50);
    this.iluminacionProta2.rotateY(Math.PI);

    //Luz puntual amarilla
    this.luzPuntual = new THREE.PointLight(0x00ffff);
    this.luzPuntual.intensity = 1;
    this.luzPuntual.power = 100000;
    this.luzPuntual.position.set(0, 0, 0);
    this.luzPuntual.visible = true;
    this.luzPuntual.castShadow = true;

    this.add(this.iluminacionProta);
    this.add(this.iluminacionProta2);
    this.add(this.ambientLight);
    this.add(this.luzPuntual);
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

    if (this.colisionaEnemigo()) {
      console.log("COLISION");
      HUD.restarVida();
    }

    if (this.colisionaTornillos()) {
      console.log("COLISION TORNILLOS");
      HUD.sumarVida();
    }

    if (this.colisionaPlacas()) {
      console.log("COLISION PLACAS");
    }

    if (this.colisionaInvestigaciones()) {
      console.log("COLISION INVESTIGACIONES");
      HUD.actualizarBarraInvestigacion();
    }

    requestAnimationFrame(() => this.update(this.toro.update()));

  }
}


/// La función  main
$(function () {

  var scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();

});
