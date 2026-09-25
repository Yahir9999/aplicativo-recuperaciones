const URL_API_MADERA =
    "https://script.google.com/macros/s/AKfycbxv_L6y26hgYjC7X3gUJKoPopdb7D-IAi8vaOTknXz5xUSN0CtQS5tzZabxMAfpEfX6/exec";

let catalogosMadera = {
    usuarios: [],
    cedis: [],
    estructuras: []
};

// =====================================================
// RECUPERACIONES DE MADERA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const btnMadera =
        document.getElementById(
            "btnRecuperacionMadera"
        );

    const btnMetal =
        document.getElementById(
            "btnRecuperacionMetal"
        );

    // OCULTAR MENÚ AL INICIAR
    ocultarMenu();

    // OCULTAR FLUJO METAL
    ocultarFlujoMetal();

    if (btnMadera) {

        btnMadera.addEventListener(
            "click",
            iniciarMadera
        );

    }

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
// MENÚ ⋮
// SOLO SE MUESTRA EN METAL
// =====================================================

function ocultarMenu() {

    const menu =
        document.querySelector(".menu-container");

    if (menu) {

        menu.style.display = "none";

    }

    const opciones =
        document.getElementById("menuOpciones");

    if (opciones) {

        opciones.classList.add("oculto");

    }
}


// =====================================================
// MOSTRAR MENÚ SOLO EN METAL
// =====================================================

function mostrarMenuMetal() {

    const menu =
        document.querySelector(".menu-container");

    if (menu) {

        menu.style.display = "";

    }
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

    ocultarMenu();

    // Ocultar selección
    const seleccion =
        document.getElementById(
            "seccionTipoRecuperacion"
        );

    if (seleccion) {
        seleccion.classList.add("oculto");
    }

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

    // Mostrar formulario MADERA
    const datosMadera =
        document.getElementById(
            "seccionDatosMadera"
        );

    if (datosMadera) {
        datosMadera.classList.remove("oculto");
    }

    // Cargar catálogos MADERA
    cargarCatalogosMadera();

}

// =====================================================
// CARGAR CATÁLOGOS MADERA
// =====================================================

async function cargarCatalogosMadera() {

    try {

        console.log(
            "📚 Cargando catálogos MADERA..."
        );

        const response =
            await fetch(
                `${URL_API_MADERA}?action=catalogosMadera`
            );

        if (!response.ok) {
            throw new Error(
                "Error HTTP: " + response.status
            );
        }

        const data =
            await response.json();

        catalogosMadera = data;

        console.log(
            "✅ Catálogos MADERA:",
            catalogosMadera
        );

        cargarCedisMadera();

    } catch (error) {

        console.error(
            "❌ Error cargando catálogos MADERA:",
            error
        );

        alert(
            "No se pudieron cargar los catálogos de MADERA."
        );

    }

}


// =====================================================
// CARGAR CEDIS MADERA
// =====================================================

function cargarCedisMadera() {

    const select =
        document.getElementById(
            "cediMadera"
        );

    if (!select) {
        return;
    }

    select.innerHTML =
        '<option value="">Seleccionar</option>';

    catalogosMadera.cedis.forEach(fila => {

        const cedi = fila[0];

        if (!cedi) {
            return;
        }

        const option =
            document.createElement("option");

        option.value = cedi;
        option.textContent = cedi;

        select.appendChild(option);

    });

}

// =====================================================
// CAMBIO DE CEDI MADERA
// =====================================================

document.addEventListener(
    "change",
    event => {

        if (
            event.target.id ===
            "cediMadera"
        ) {

            cargarRecuperadoresMadera();

        }

    }
);


// =====================================================
// CARGAR RECUPERADORES MADERA
// =====================================================

function cargarRecuperadoresMadera() {

    const selectCedi =
        document.getElementById(
            "cediMadera"
        );

    const selectRecuperador =
        document.getElementById(
            "recuperadorMadera"
        );

    if (
        !selectCedi ||
        !selectRecuperador
    ) {
        return;
    }

    const cediSeleccionado =
        selectCedi.value;

    selectRecuperador.innerHTML =
        '<option value="">Seleccionar</option>';

    if (!cediSeleccionado) {
        return;
    }

    const usuarios =
        catalogosMadera.usuarios.filter(
            fila =>
                String(fila[1])
                    .trim()
                    .toUpperCase() ===
                String(cediSeleccionado)
                    .trim()
                    .toUpperCase()
        );

    usuarios.forEach(fila => {

        const nombre = fila[0];

        if (!nombre) {
            return;
        }

        const option =
            document.createElement("option");

        option.value = nombre;
        option.textContent = nombre;

        selectRecuperador.appendChild(option);

    });

}


// =====================================================
// METAL
// =====================================================

function iniciarMetal() {

    console.log(
        "🔩 Iniciando recuperación de METAL"
    );

    mostrarMenuMetal();


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

// =====================================================
// REGRESAR A PANTALLA INICIAL
// =====================================================

function regresarPantallaInicio() {

    console.log(
        "↩️ Regresando a selección de recuperación"
    );

    // Ocultar menú
    ocultarMenu();

    // Detener scanner de METAL si existe
    try {

        if (typeof detenerScanner === "function") {
            detenerScanner();
        }

    } catch (error) {

        console.log(
            "No había scanner activo."
        );

    }

    // Ocultar flujo METAL
    ocultarFlujoMetal();

    // Ocultar MADERA
    const datosMadera =
        document.getElementById(
            "seccionDatosMadera"
        );

    if (datosMadera) {
        datosMadera.classList.add("oculto");
    }

    // Ocultar envío
    const envio =
        document.getElementById(
            "seccionEnvioEstructuras"
        );

    if (envio) {
        envio.classList.add("oculto");
    }

    // Mostrar selección
    const seleccion =
        document.getElementById(
            "seccionTipoRecuperacion"
        );

    if (seleccion) {
        seleccion.classList.remove("oculto");
    }

    // Restaurar título
    const titulo =
        document.querySelector(
            ".app-header h1"
        );

    if (titulo) {
        titulo.textContent =
            "RECUPERACIÓN DE ESTRUCTURAS";
    }

}

// =====================================================
// BOTONES REGRESAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const btnMadera =
            document.getElementById(
                "btnRegresarInicioMadera"
            );

        const btnMetal =
            document.getElementById(
                "btnRegresarInicioMetal"
            );


        if (btnMadera) {

            btnMadera.addEventListener(
                "click",
                regresarPantallaInicio
            );

        }


        if (btnMetal) {

            btnMetal.addEventListener(
                "click",
                regresarPantallaInicio
            );

        }

    }
);