
import * as THREE from 'three'

import { MTLLoader } from '../../../libs/MTLLoader.js';
import { OBJLoader } from '../../../libs/OBJLoader.js';

class Ruedas extends THREE.Object3D {

  constructor() {
    super();

    const onProgress = function (xhr) {

      if (xhr.lengthComputable) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(percentComplete.toFixed(2) + '% downloaded');

      }

    };

    //-----------------------------------------------------------------------------------

    let self = this; // si utilizo this directamente en la funcion se refiere al mtloader, no al objeto en general


    new MTLLoader()
      .setPath('../models/ruedas/')
      .load('ruedas.mtl', function (materials) {

        materials.preload();

        new OBJLoader()
          .setMaterials(materials)
          .setPath('../models/ruedas/')
          .load('ruedas.obj', function (object) {

            self.add(object);

          }, onProgress);

      });

    //Pasar de objeto a mesh (object)



  }

  update() {

  }

}

export { Ruedas }
