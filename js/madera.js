// =====================================================
// RECUPERACIONES DE MADERA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const btnMadera =
        document.getElementById("btnRecuperacionMadera");

    const btnMetal =
        document.getElementById("btnRecuperacionMetal");


    // ==============================================
    // OCULTAR FLUJO DE METAL AL INICIAR
    // ==============================================

    ocultarFlujoMetal();


    // ==============================================
    // BOTÓN MADERA
    // ==============================================

    if (btnMadera) {

        btnMadera.addEventListener(
            "click",
            iniciarMadera
        );

    }


    // ==============================================
    // BOTÓN METAL
    // ==============================================

    if (btnMetal) {

        btnMetal.addEventListener(
            "click",
            iniciarMetal
        );

    }

});


// =====================================================
// OCULTAR FLUJO METAL
// =====================================================

function ocultarFlujoMetal() {

    const seccionesMetal = [

        "seccionDatosGenerales",
        "seccionModoCamarones",
        "seccionAuxiliar",
        "seccionFolioGrupal",
        "seccionTipoCaptura",
        "seccionBuenEstado",
        "seccionDanada",
        "scannerContainer",
        "seccionContador",
        "seccionTabla",
        "seccionAcciones"

    ];


    seccionesMetal.forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {

            elemento.classList.add("oculto");

        }

    });

}


// =====================================================
// MOSTRAR SELECCIÓN
// =====================================================

function mostrarSeleccionRecuperacion() {

    const seleccion =
        document.getElementById(
            "seccionTipoRecuperacion"
        );

    if (seleccion) {

        seleccion.classList.remove("oculto");

    }

}


// =====================================================
// MADERA
// =====================================================

function iniciarMadera() {

    console.log(
        "🪵 Iniciando recuperación de MADERA"
    );


    // Ocultar selección

    document
        .getElementById(
            "seccionTipoRecuperacion"
        )
        .classList.add("oculto");


    // Ocultar todo METAL

    ocultarFlujoMetal();


    // Cambiar título

    const titulo =
        document.querySelector(
            ".app-header h1"
        );

    if (titulo) {

        titulo.textContent =
            "RECUPERACIONES DE ESTRUCTURAS DE MADERA";

    }


    // ==========================================
    // AQUÍ COMENZARÁ EL FLUJO DE MADERA
    // ==========================================

}


// =====================================================
// METAL
// =====================================================

function iniciarMetal() {

    console.log(
        "🔩 Iniciando recuperación de METAL"
    );


    // Ocultar selección

    document
        .getElementById(
            "seccionTipoRecuperacion"
        )
        .classList.add("oculto");


    // Cambiar título

    const titulo =
        document.querySelector(
            ".app-header h1"
        );

    if (titulo) {

        titulo.textContent =
            "RECUPERACIONES DE ESTRUCTURAS DE METAL";

    }


    // Mostrar datos generales

    const datosGenerales =
        document.getElementById(
            "seccionDatosGenerales"
        );

    if (datosGenerales) {

        datosGenerales.classList.remove(
            "oculto"
        );

    }

}
