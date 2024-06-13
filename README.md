# ROBO RACER https://roboracer.netlify.app 

## Descripción del proyecto

ROBO RACER es un juego de carreras desarrollado en Three.js, inspirado en el estilo de Mario Kart. El objetivo principal es completar tres vueltas en un circuito "Torus Knot" mientras se recolectan puntos de investigación y se esquivan enemigos alienígenas. El juego incluye varios tipos de enemigos y objetos, así como una interfaz gráfica detallada que muestra el progreso y la vida del jugador.

## Características principales

- **Circuito y Ambientación**: Basado en la geometría nativa de Three.js "Torus Knot".
- **Objetivo**: Completar tres vueltas recolectando puntos de investigación y evitando perder piezas debido a los enemigos.
- **Enemigos**: Existen enemigos voladores y terrestres que intentan dañar el vehículo del jugador.
- **Objetos**: Hay diferentes tipos de objetos que proporcionan vida, puntos de investigación y pequeños impulsos.

## Diseño de la Aplicación

### Diagrama de Clases

1. **RoboRacer**: Clase principal encargada de la lógica del juego y renderización.
2. **Circuito**: Clase que define el circuito del juego.
3. **Item de Investigación**: Clase que representa los puntos de investigación.
4. **Ensamblado**: Clase para la gestión de componentes del vehículo.
5. **Componente Placa y Tornillos**: Clases para los elementos que proporcionan vida.
6. **Plancton y Ovni**: Clases que representan a los enemigos terrestres y voladores.
7. **Funciones HUD**: Clase para las funciones de la interfaz gráfica del usuario.

### Modelos y Jerarquías

- **Coche Lunar**: Modelos jerárquicos que componen el protagonista del juego (brazo, cabeza, chasis, ruedas).
- **Items**: Modelos de los diferentes objetos recolectables (tornillos, tuercas, placa, ítem de investigación).
- **Enemigos**: Modelos de los enemigos (Plancton y Ovni).

## Algoritmos y Funcionalidades Relevantes

1. **Circuito**: Definido mediante la geometría "TorusKnot" con parámetros específicos.
2. **Movimiento del Personaje**: Algoritmos para el desplazamiento a través del tubo del circuito.
3. **Colisiones**: Detección y efectos de colisiones con enemigos y objetos.
4. **Animaciones**: Movimientos del personaje y enemigos.
5. **Picking**: Interacción para derrotar enemigos.
6. **Cámaras**: Configuraciones de cámara en tercera persona y general.
7. **Iluminación y Materiales**: Detalles de iluminación y materiales usados en el juego.
8. **Bibliotecas Externas**: Uso de TextGeometry y FontLoader para la creación de geometrías de texto.

## Manual de Usuario

### Objetivos

Este manual detalla todos los aspectos del juego ROBO RACER relevantes para comprender la construcción de modelos, luces, cámaras, materiales, animaciones y la conexión de todas las clases y componentes utilizados en la asignatura de Sistemas Gráficos.

## Autores

- **Juan Miguel Acosta Ortega** ([acostaojuanmi@correo.ugr.es](mailto:acostaojuanmi@correo.ugr.es))
- **David Serrano Domínguez** ([davidserrano07@correo.ugr.es](mailto:davidserrano07@correo.ugr.es))

Fecha: 31 de mayo de 2024
