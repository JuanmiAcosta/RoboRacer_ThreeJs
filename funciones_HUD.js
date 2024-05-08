/*
<!--HUD DE INVESTIGACIÓN-->
    <div class="barra_investigacion">
        <h2>Barra de investigación (0%) </h2>
        <div class="progreso_container">
            <div class="progreso"></div>
        </div>
    </div>
    <!--HUD DE VIDA-->
    <div class="barra_vidas">
        <h2>Barra de vida:</h2>
        <div class="vida_container">
            <img class="vida" src="./imgs/corazon.png">
            <img class="vida" src="./imgs/corazon.png">
            <img class="vida" src="./imgs/corazon.png">
            <img class="vida" src="./imgs/corazon.png">
            <img class="vida" src="./imgs/corazon.png">
            <img class="vida" src="./imgs/corazon.png">
        </div>
    </div>
    <!--HUD DE MISION-->
    <div class="mision">
        <p>La misión consiste en terminar las tres vueltas del circuito habiendo completado la barra de
            investigación. Confiamos en ti.</p>
    </div>
*/

/*
body{
    font-family: "Jersey 15", sans-serif;
    font-weight: 300;
    font-style: normal;
    font-size:20px;
}

.barra_investigacion { 
position:absolute;
top: 50px;

left: 38%;
width: 20%;
height: auto;
text-align: center;
padding-top: 10px;
margin-top: 10px;
}

.barra_investigacion h2 {
color: #fff;
}

.barra_investigacion .progreso_container{
background-color: #fff;
width: 100%;
height: 25px;
display: flex;
justify-content:baseline;
align-items: center;
border: 2px solid #000;
border-radius: 25px;
}

.barra_investigacion .progreso_container .progreso{
background-color: #e14c4c;
padding : 2px;
width: 0%;
height: 20px;
border: 2px solid #000;
border-radius: 25px;
}

.barra_vidas {
position:absolute;
bottom : 200px;
left : 150px;
width: 420px;
height: 50px;
text-align: center;
padding-top: 10px;
margin-top: 10px;
}

.barra_vidas h2 {
color: #fff;
}

.vida_container{
height: 50px;
width:100%;
border: 3px solid #fff;
border-radius: 25px;
display: flex;
justify-content: baseline;
align-items: center;
}

.vida {
width:50px;
aspect-ratio: 1/1;
box-shadow: inset;
margin:10px;
}

.mision {
position:absolute;
bottom : 200px;
right: 100px;
width: 400px;
height: 50px;
text-align: center;
padding-top: 10px;
margin-top: 10px;
}

.mision p{
color: #fff;
font-size:30px;
font-family: "Jersey 15", sans-serif;
font-weight: 200;
font-style: normal;
}
*/

class HUD {

    static porcentaje = 0;

    static restarVida(){ //quitar una .vida de .vida_container si hay más de 0
        
        if (document.querySelectorAll('.vida').length > 0){
            var vidas = document.querySelector('.vida_container');
            var vida = document.querySelector('.vida');
            vidas.removeChild(vida);
        }else{
            console.log("No hay vidas que quitar");
        }

    }
    
    static sumarVida(){ // aumentar sólo si hay 6 vidas o menos
        if (document.querySelectorAll('.vida').length < 6){
            var vidas = document.querySelector('.vida_container');
            var vida = document.createElement('img');
            vida.src = "./imgs/corazon.png";
            vida.className = "vida";
            vidas.appendChild(vida);
        }
    }

    static actualizarBarraInvestigacion(){
        
        //Actualizar el porcentaje
        HUD.porcentaje += 10;
        if (HUD.porcentaje > 100){
            HUD.porcentaje = 100;
        }

        //Actualizar el texto
        var barra = document.querySelector('.barra_investigacion h2');
        barra.textContent = "Barra de investigación (" + HUD.porcentaje + "%)";

        //Actualizar la barra
        var progreso = document.querySelector('.progreso');
        progreso.style.width = HUD.porcentaje + "%";

    }

}

export {HUD};

