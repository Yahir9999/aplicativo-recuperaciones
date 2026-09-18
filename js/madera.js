// =====================================================
// MÓDULO DE RECUPERACIONES DE MADERA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const btnMadera =
        document.getElementById("btnRecuperacionMadera");

    const btnMetal =
        document.getElementById("btnRecuperacionMetal");


    // =========================================
    // MADERA
    // =========================================

    if (btnMadera) {

        btnMadera.addEventListener(
            "click",
            iniciarRecuperacionMadera
        );

    }


    // =========================================
    // METAL
    // =========================================

    if (btnMetal) {

        btnMetal.addEventListener(
            "click",
            iniciarRecuperacionMetal
        );

    }

});


// =====================================================
// INICIAR MADERA
// =====================================================

function iniciarRecuperacionMadera() {

    console.log("🪵 Recuperación de MADERA");

    document
        .getElementById("seccionTipoRecuperacion")
        .classList.add("oculto");

    // Por ahora no mostramos nada más.
    // Aquí construiremos el flujo de MADERA.

}


// =====================================================
// INICIAR METAL
// =====================================================

function iniciarRecuperacionMetal() {

    console.log("🔩 Recuperación de METAL");

    document
        .getElementById("seccionTipoRecuperacion")
        .classList.add("oculto");

    const datosGenerales =
        document.getElementById("seccionDatosGenerales");

    if (datosGenerales) {

        datosGenerales.classList.remove("oculto");

    }

}