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

        // Ocultar formulario de captura hasta completar datos generales
    const formularioCompleta =
        document.getElementById(
            "seccionCapturaCompletaMadera"
        );

    if (formularioCompleta) {
        formularioCompleta.classList.add("oculto");
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

        if (
            event.target.id === "fechaMadera" ||
            event.target.id === "cediMadera" ||
            event.target.id === "recuperadorMadera"
        ) {

            verificarDatosGeneralesMadera();

        }

        if (
            event.target.id ===
            "tipoEstructuraMadera" ||
            event.target.id ===
            "cantidadEstructuraMadera"
        ) {

            calcularPiezasMaderaCompleta();

        }

    }
);



document.addEventListener(
    "input",
    event => {

        if (
            event.target.id ===
            "cantidadEstructuraMadera"
        ) {

            calcularPiezasMaderaCompleta();

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
// VALIDAR DATOS GENERALES MADERA
// =====================================================

function verificarDatosGeneralesMadera() {

    const fecha =
        document.getElementById("fechaMadera");

    const cedi =
        document.getElementById("cediMadera");

    const recuperador =
        document.getElementById("recuperadorMadera");

    const formularioCompleta =
        document.getElementById(
            "seccionCapturaCompletaMadera"
        );

    if (
        !fecha ||
        !cedi ||
        !recuperador ||
        !formularioCompleta
    ) {
        return;
    }

    const datosCompletos =
        fecha.value &&
        cedi.value &&
        recuperador.value;

    if (datosCompletos) {

        formularioCompleta.classList.remove(
            "oculto"
        );

        cargarTiposEstructuraMadera();

    } else {

        formularioCompleta.classList.add(
            "oculto"
        );

    }

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



// =====================================================
// CARGAR TIPOS DE ESTRUCTURA MADERA
// =====================================================

function cargarTiposEstructuraMadera() {

    const select =
        document.getElementById(
            "tipoEstructuraMadera"
        );

    if (!select) {
        return;
    }

    select.innerHTML =
        '<option value="">Seleccionar</option>';

    catalogosMadera.estructuras.forEach(
        estructura => {

            const tipo =
                estructura[0];

            if (!tipo) {
                return;
            }

            const option =
                document.createElement(
                    "option"
                );

            option.value = tipo;
            option.textContent = tipo;

            select.appendChild(option);

        }
    );

}

// =====================================================
// CALCULAR PIEZAS MADERA COMPLETA
// =====================================================

function calcularPiezasMaderaCompleta() {

    const tipo =
        document.getElementById(
            "tipoEstructuraMadera"
        ).value;

    const cantidad =
        Number(
            document.getElementById(
                "cantidadEstructuraMadera"
            ).value
        );

    const resumen =
        document.getElementById(
            "resumenCompletaMadera"
        );

    if (
        !tipo ||
        !cantidad ||
        cantidad < 1
    ) {

        if (resumen) {
            resumen.classList.add(
                "oculto"
            );
        }

        return;
    }

    const estructura =
        catalogosMadera.estructuras.find(
            fila =>
                String(fila[0]).trim() ===
                String(tipo).trim()
        );

    if (!estructura) {
        return;
    }

    /*
        CATALOGO MADERA:

        [0] Tipo
        [1] Base
        [2] Tapa
        [3] Esquinero
        [4] Ángulo
        [5] Diagonal
        [6] Poste
    */

    const base =
        Number(estructura[1]) * cantidad;

    const tapa =
        Number(estructura[2]) * cantidad;

    const esquinero =
        Number(estructura[3]) * cantidad;

    const angulo =
        Number(estructura[4]) * cantidad;

    const diagonal =
        Number(estructura[5]) * cantidad;

    const poste =
        Number(estructura[6]) * cantidad;


    document.getElementById(
        "totalBaseMadera"
    ).textContent = base;

    document.getElementById(
        "totalTapaMadera"
    ).textContent = tapa;

    document.getElementById(
        "totalEsquineroMadera"
    ).textContent = esquinero;

    document.getElementById(
        "totalAnguloMadera"
    ).textContent = angulo;

    document.getElementById(
        "totalDiagonalMadera"
    ).textContent = diagonal;

    document.getElementById(
        "totalPosteMadera"
    ).textContent = poste;


    if (resumen) {

        resumen.classList.remove(
            "oculto"
        );

    }

}

// =====================================================
// GUARDAR RECUPERACIÓN DE MADERA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const btnGuardar =
            document.getElementById(
                "btnGuardarMadera"
            );

        if (btnGuardar) {

            btnGuardar.addEventListener(
                "click",
                guardarMadera
            );

        }

    }
);

async function guardarMadera() {

    const fecha =
        document.getElementById(
            "fechaMadera"
        ).value;

    const cedi =
        document.getElementById(
            "cediMadera"
        ).value;

    const auxiliar =
        document.getElementById(
            "recuperadorMadera"
        ).value;

    const tipoEstructura =
        document.getElementById(
            "tipoEstructuraMadera"
        ).value;

    const cantidad =
        Number(
            document.getElementById(
                "cantidadEstructuraMadera"
            ).value
        );

    const base =
        Number(
            document.getElementById(
                "totalBaseMadera"
            ).textContent
        ) || 0;

    const tapa =
        Number(
            document.getElementById(
                "totalTapaMadera"
            ).textContent
        ) || 0;

    const esquinero =
        Number(
            document.getElementById(
                "totalEsquineroMadera"
            ).textContent
        ) || 0;

    const angulo =
        Number(
            document.getElementById(
                "totalAnguloMadera"
            ).textContent
        ) || 0;

    const diagonal =
        Number(
            document.getElementById(
                "totalDiagonalMadera"
            ).textContent
        ) || 0;

    const poste =
        Number(
            document.getElementById(
                "totalPosteMadera"
            ).textContent
        ) || 0;


    // =================================================
    // VALIDACIONES
    // =================================================

    if (!fecha) {

        alert(
            "Selecciona una fecha."
        );

        return;

    }

    if (!cedi) {

        alert(
            "Selecciona un CEDI."
        );

        return;

    }

    if (!auxiliar) {

        alert(
            "Selecciona un auxiliar."
        );

        return;

    }

    if (!tipoEstructura) {

        alert(
            "Selecciona el tipo de estructura."
        );

        return;

    }

    if (!cantidad || cantidad < 1) {

        alert(
            "Ingresa una cantidad válida."
        );

        return;

    }


    // =================================================
    // BOTÓN
    // =================================================

    const boton =
        document.getElementById(
            "btnGuardarMadera"
        );

    boton.disabled = true;

    boton.textContent =
        "GUARDANDO...";


    // =================================================
    // DATOS
    // =================================================

    const datos = {

        tipoOperacion:
            "RECUPERACION_MADERA",

        fecha,
        cedi,
        auxiliar,
        tipoEstructura,
        cantidad,

        base,
        tapa,
        esquinero,
        angulo,
        diagonal,
        poste

    };


    console.log(
        "🪵 ENVIANDO MADERA:",
        datos
    );


    // =================================================
    // ENVIAR A APPS SCRIPT
    // =================================================

    try {

        const response =
            await fetch(
                URL_API_MADERA,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            datos
                        )

                }
            );


        const resultado =
            await response.json();


        console.log(
            "🪵 RESPUESTA MADERA:",
            resultado
        );


        // =============================================
        // ERROR
        // =============================================

        if (!resultado.success) {
    throw new Error(
        resultado.mensaje || "No se pudo guardar la recuperación."
    );
}

alert("✅ Recuperación de MADERA guardada correctamente.");

// ==========================================
// LIMPIAR FORMULARIO PARA NUEVO REGISTRO
// ==========================================

// Limpiar tipo de estructura
const selectTipo = document.getElementById("tipoEstructuraMadera");
if (selectTipo) {
    selectTipo.value = "";
}

// Regresar cantidad a 1
const inputCantidad = document.getElementById("cantidadEstructuraMadera");
if (inputCantidad) {
    inputCantidad.value = 1;
}

// Ocultar resumen de piezas
const resumen = document.getElementById("resumenCompletaMadera");
if (resumen) {
    resumen.classList.add("oculto");
}

// Reiniciar valores visuales de piezas
document.getElementById("totalBaseMadera").textContent = "0";
document.getElementById("totalTapaMadera").textContent = "0";
document.getElementById("totalEsquineroMadera").textContent = "0";
document.getElementById("totalAnguloMadera").textContent = "0";
document.getElementById("totalDiagonalMadera").textContent = "0";
document.getElementById("totalPosteMadera").textContent = "0";

    } catch (error) {

        console.error(
            "❌ Error al guardar MADERA:",
            error
        );

        alert(
            "❌ No se pudo guardar la recuperación.\n\n" +
            error.message
        );


    } finally {

        boton.disabled = false;

        boton.textContent =
            "GUARDAR RECUPERACIÓN";

    }

}