
class HUD {

    static porcentaje = 0;
    static vidas = 6;

    static restarVida() { //quitar una .vida de .vida_container si hay más de 0

        if (HUD.vidas > 1) {
            HUD.vidas -= 1;
            var vidas = document.querySelector('.vida_container');
            var vida = document.querySelector('.vida');
            vidas.removeChild(vida);

        } else {
            HUD.vidas -= 1;
            var vidas = document.querySelector('.vida_container');
            var vida = document.querySelector('.vida');
            vidas.removeChild(vida);
            console.log("No hay vidas que quitar");
            alert("Has perdido todas las vidas, vuelve a intentarlo.");
            HUD.restaurarHUD();
        }
    }

    static restaurarHUD() {

        HUD.porcentaje = 0;
        HUD.vidas = 6;

        var barra = document.querySelector('.barra_investigacion h2');
        barra.textContent = "Barra de investigación (" + HUD.porcentaje + "%)";

        var progreso = document.querySelector('.progreso');
        progreso.style.width = HUD.porcentaje + "%";

        var vidas = document.querySelector('.vida_container');
        vidas.innerHTML = "";
        for (var i = 0; i < 6; i++) {
            var vida = document.createElement('img');
            vida.src = "./imgs/corazon.png";
            vida.className = "vida";
            vidas.appendChild(vida);
        }

    }

    static sumarVida() { // aumentar sólo si hay 6 vidas o menos
        if (document.querySelectorAll('.vida').length < 6) {
            HUD.vidas += 1;
            var vidas = document.querySelector('.vida_container');
            var vida = document.createElement('img');
            vida.src = "./imgs/corazon.png";
            vida.className = "vida";
            vidas.appendChild(vida);
        }
    }

    static actualizarBarraInvestigacion() {

        //Actualizar el porcentaje
        HUD.porcentaje += 10;
        if (HUD.porcentaje > 100) {
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

export { HUD };

