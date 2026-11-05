// =====================================================
// HISTORIAL DE RECUPERACIONES - METAL Y MADERA
// =====================================================

// URL del proyecto de Google Apps Script
const URL_API_HISTORIAL =
    "https://script.google.com/macros/s/AKfycbxv_L6y26hgYjC7X3gUJKoPopdb7D-IAi8vaOTknXz5xUSN0CtQS5tzZabxMAfpEfX6/exec";

// Tipo de historial seleccionado
let tipoHistorialActual = "METAL";

// Catálogos de ambos aplicativos
let catalogosHistorial = {
    metal: {
        usuarios: [],
        cedis: [],
        estructuras: []
    },
    madera: {
        usuarios: [],
        cedis: [],
        estructuras: []
    }
};

// =====================================================
// INICIALIZAR EVENTOS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const btnAbrir = document.getElementById("btnAbrirHistorial");
    const btnRegresar = document.getElementById("btnRegresarHistorial");

    const btnMetal = document.getElementById("btnHistorialMetal");
    const btnMadera = document.getElementById("btnHistorialMadera");

    const btnConsultar = document.getElementById("btnConsultarHistorial");

    const selectCedi = document.getElementById("historialCedi");

    // Abrir historial
    if (btnAbrir) {
        btnAbrir.addEventListener("click", abrirHistorial);
    }

    // Regresar a la pantalla inicial
    if (btnRegresar) {
        btnRegresar.addEventListener("click", cerrarHistorial);
    }

    // Cambiar entre METAL y MADERA
    if (btnMetal) {
        btnMetal.addEventListener("click", () => {
            cambiarTipoHistorial("METAL");
        });
    }

    if (btnMadera) {
        btnMadera.addEventListener("click", () => {
            cambiarTipoHistorial("MADERA");
        });
    }

    // Consultar registros
    if (btnConsultar) {
        btnConsultar.addEventListener("click", consultarHistorial);
    }

    // Actualizar recuperadores al cambiar CEDI
    if (selectCedi) {
        selectCedi.addEventListener("change", cargarRecuperadoresHistorial);
    }

});

// =====================================================
// ABRIR HISTORIAL
// =====================================================

function abrirHistorial() {

    const inicio = document.getElementById("seccionTipoRecuperacion");
    const historial = document.getElementById("seccionHistorial");

    // Ocultar pantalla inicial
    if (inicio) {
        inicio.classList.add("oculto");
    }

    // Mostrar historial
    if (historial) {
        historial.classList.remove("oculto");
    }

    // Cambiar título principal
    const titulo = document.querySelector(".app-header h1");

        if (titulo) {
        titulo.textContent = "HISTORIAL DE RECUPERACIONES";
    }

    // Inicializar historial METAL y cargar sus catálogos
    cambiarTipoHistorial("METAL");

}


// =====================================================
// REGRESAR A LA PANTALLA INICIAL
// =====================================================

function cerrarHistorial() {

    const inicio = document.getElementById("seccionTipoRecuperacion");
    const historial = document.getElementById("seccionHistorial");

    // Ocultar historial
    if (historial) {
        historial.classList.add("oculto");
    }

    // Mostrar pantalla inicial
    if (inicio) {
        inicio.classList.remove("oculto");
    }

    // Restaurar título principal
    const titulo = document.querySelector(".app-header h1");

    if (titulo) {
        titulo.textContent = "RECUPERACIÓN DE ESTRUCTURAS";
    }

}


// =====================================================
// CAMBIAR ENTRE HISTORIAL METAL Y MADERA
// =====================================================

function cambiarTipoHistorial(tipo) {

    tipoHistorialActual = tipo;

    const btnMetal = document.getElementById("btnHistorialMetal");
    const btnMadera = document.getElementById("btnHistorialMadera");

    const titulo = document.getElementById("tituloTipoHistorial");

    const selectCedi = document.getElementById("historialCedi");
    const selectRecuperador = document.getElementById("historialRecuperador");

    // Actualizar botones activos
    if (btnMetal) {
        btnMetal.classList.toggle("activo", tipo === "METAL");
    }

    if (btnMadera) {
        btnMadera.classList.toggle("activo", tipo === "MADERA");
    }

    // Actualizar título
    if (titulo) {
        titulo.textContent = `HISTORIAL DE ${tipo}`;
    }

    // Limpiar filtros anteriores
    if (selectCedi) {
        selectCedi.value = "";
    }

    if (selectRecuperador) {
        selectRecuperador.innerHTML =
            '<option value="">Todos los recuperadores</option>';
    }

    // Limpiar fechas
    document.getElementById("historialFechaInicio").value = "";
    document.getElementById("historialFechaFin").value = "";

    // Limpiar tabla y total
    document.getElementById("tablaHistorialRecuperaciones").innerHTML = "";
    document.getElementById("totalHistorialRecuperaciones").textContent = "0";

    // Actualizar mensaje
    document.getElementById("mensajeHistorial").textContent =
        "Selecciona un CEDI para consultar las recuperaciones.";

    // Cargar catálogos del tipo seleccionado
    cargarCatalogosHistorial();

}

// =====================================================
// CARGAR CATÁLOGOS DEL HISTORIAL
// =====================================================

async function cargarCatalogosHistorial() {

    const mensaje = document.getElementById("mensajeHistorial");

    if (mensaje) {
        mensaje.textContent = "Cargando catálogos...";
    }

    try {

        const respuesta = await fetch(
            `${URL_API_HISTORIAL}?action=historialCatalogos`
        );

        const datos = await respuesta.json();

        if (!datos.success) {
            throw new Error(
                datos.mensaje || "No se pudieron cargar los catálogos."
            );
        }

        // Guardar catálogos de METAL y MADERA
        catalogosHistorial = datos;

        // Llenar selector de CEDIS
        llenarCedisHistorial();

        if (mensaje) {
            mensaje.textContent =
                "Selecciona un CEDI para consultar las recuperaciones.";
        }

    } catch (error) {

        console.error("Error cargando catálogos:", error);

        if (mensaje) {
            mensaje.textContent = error.message;
        }

    }

}


// =====================================================
// OBTENER CATÁLOGOS SEGÚN EL TIPO SELECCIONADO
// =====================================================

function obtenerCatalogosTipoHistorial() {

    if (tipoHistorialActual === "METAL") {
        return catalogosHistorial.metal;
    }

    return catalogosHistorial.madera;

}


// =====================================================
// LLENAR SELECTOR DE CEDIS
// =====================================================

function llenarCedisHistorial() {

    const selectCedi = document.getElementById("historialCedi");

    const selectRecuperador =
        document.getElementById("historialRecuperador");

    if (!selectCedi || !selectRecuperador) return;

    // Conservar las selecciones actuales
    const cediAnterior = selectCedi.value;
    const recuperadorAnterior = selectRecuperador.value;

    const catalogos = obtenerCatalogosTipoHistorial();

    selectCedi.innerHTML =
        '<option value="">Seleccionar CEDI</option>';

    (catalogos.cedis || []).forEach(fila => {

        const nombre = fila[0];

        if (!nombre) return;

        const opcion = document.createElement("option");

        opcion.value = nombre;
        opcion.textContent = nombre;

        selectCedi.appendChild(opcion);

    });

    // Restaurar el CEDI si sigue existiendo
    selectCedi.value = cediAnterior;

    // Recargar recuperadores del CEDI conservado
    cargarRecuperadoresHistorial();

    // Restaurar recuperador si sigue disponible
    selectRecuperador.value = recuperadorAnterior;

}


// =====================================================
// CARGAR RECUPERADORES SEGÚN EL CEDI
// =====================================================

function cargarRecuperadoresHistorial() {

    const selectCedi = document.getElementById("historialCedi");

    const selectRecuperador =
        document.getElementById("historialRecuperador");

    if (!selectCedi || !selectRecuperador) return;

    const cediSeleccionado = selectCedi.value;

    const catalogos = obtenerCatalogosTipoHistorial();

    selectRecuperador.innerHTML =
        '<option value="">Todos los recuperadores</option>';

    if (!cediSeleccionado) return;

    // Filtrar usuarios pertenecientes al CEDI seleccionado
    const usuarios = (catalogos.usuarios || []).filter(fila => {

        return String(fila[1] || "").trim().toUpperCase() ===
            String(cediSeleccionado).trim().toUpperCase();

    });

    // Obtener nombres sin duplicados
    const nombres = [
        ...new Set(
            usuarios
                .map(fila => String(fila[0] || "").trim())
                .filter(Boolean)
        )
    ];

    nombres.sort((a, b) => a.localeCompare(b, "es"));

    nombres.forEach(nombre => {

        const opcion = document.createElement("option");

        opcion.value = nombre;
        opcion.textContent = nombre;

        selectRecuperador.appendChild(opcion);

    });

}

// =====================================================
// CONSULTAR HISTORIAL EN GOOGLE SHEETS
// =====================================================

async function consultarHistorial() {

    const cedi = document.getElementById("historialCedi").value;
    const recuperador = document.getElementById("historialRecuperador").value;

    const fechaInicio = document.getElementById("historialFechaInicio").value;
    const fechaFin = document.getElementById("historialFechaFin").value;

    const mensaje = document.getElementById("mensajeHistorial");
    const boton = document.getElementById("btnConsultarHistorial");

    // Validar CEDI
    if (!cedi) {
        mensaje.textContent = "Selecciona un CEDI para consultar el historial.";
        return;
    }

    // Validar rango de fechas
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
        mensaje.textContent = "La fecha inicial no puede ser posterior a la fecha final.";
        return;
    }

    boton.disabled = true;
    boton.textContent = "CONSULTANDO...";
    mensaje.textContent = "Consultando bitácora...";

    limpiarTablaHistorial();

    try {

        const parametros = new URLSearchParams({
            action: "historialRecuperaciones",
            tipo: tipoHistorialActual,
            cedi: cedi,
            recuperador: recuperador,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        });

        const respuesta = await fetch(
            `${URL_API_HISTORIAL}?${parametros.toString()}`
        );

        const datos = await respuesta.json();

        if (!datos.success) {
            throw new Error(
                datos.mensaje || "No se pudo consultar el historial."
            );
        }

        const registros = datos.registros || [];

        pintarTablaHistorial(registros);

        mensaje.textContent = registros.length > 0
            ? `Se encontraron ${registros.length} recuperaciones.`
            : "No se encontraron recuperaciones con los filtros seleccionados.";

    } catch (error) {

        console.error("Error consultando historial:", error);

        mensaje.textContent = error.message ||
            "Ocurrió un error al consultar el historial.";

    } finally {

        boton.disabled = false;
        boton.textContent = "CONSULTAR HISTORIAL";

    }

}


// =====================================================
// MOSTRAR RESULTADOS EN LA TABLA
// =====================================================

function pintarTablaHistorial(registros) {

    const tbody = document.getElementById("tablaHistorialRecuperaciones");
    const total = document.getElementById("totalHistorialRecuperaciones");

    if (!tbody || !total) return;

    tbody.innerHTML = "";

    let sumaTotal = 0;

    registros.forEach(registro => {

        const cantidad = Number(registro.cantidad) || 0;

        sumaTotal += cantidad;

        const fila = document.createElement("tr");

        const celdaFecha = document.createElement("td");
        const celdaEstructura = document.createElement("td");
        const celdaCantidad = document.createElement("td");

        celdaFecha.textContent = formatearFechaHistorial(registro.fecha);

        celdaEstructura.textContent =
            registro.tipoEstructura || "—";

        celdaCantidad.textContent =
            cantidad.toLocaleString("es-MX");

        celdaCantidad.classList.add("historial-cantidad");

        fila.appendChild(celdaFecha);
        fila.appendChild(celdaEstructura);
        fila.appendChild(celdaCantidad);

        tbody.appendChild(fila);

    });

    // Total de estructuras recuperadas
    total.textContent = sumaTotal.toLocaleString("es-MX");

}


// =====================================================
// FORMATEAR FECHAS
// =====================================================

function formatearFechaHistorial(fecha) {

    if (!fecha) return "—";

    const partes = String(fecha).split("-");

    if (partes.length === 3 && partes[0].length === 4) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return fecha;

}


// =====================================================
// LIMPIAR TABLA Y TOTAL
// =====================================================

function limpiarTablaHistorial() {

    const tbody = document.getElementById("tablaHistorialRecuperaciones");
    const total = document.getElementById("totalHistorialRecuperaciones");

    if (tbody) {
        tbody.innerHTML = "";
    }

    if (total) {
        total.textContent = "0";
    }

}