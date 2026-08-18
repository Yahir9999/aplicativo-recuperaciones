//conexión de appscript con codigo
const URL_API =
  "https://script.google.com/macros/s/AKfycbxv_L6y26hgYjC7X3gUJKoPopdb7D-IAi8vaOTknXz5xUSN0CtQS5tzZabxMAfpEfX6/exec";




  let catalogos = {
  usuarios: [],
  cedis: [],
  estructuras: []
};

//funcion para traer los catalogos del sheets
async function cargarCatalogos() {

  try {

    const response =
      await fetch(
        `${URL_API}?action=catalogos`
      );

    const data =
      await response.json();

    catalogos = data;

    cargarCedis();
    cargarEstructuras();
    

    console.log(catalogos);

  } catch(error) {

    console.error(error);

    alert(
      "Error al cargar catálogos"
    );

  }

}


//llenar cedis
function cargarCedis() {

  const select =
    document.getElementById("cedi");

  select.innerHTML =
    '<option value="">Seleccionar</option>';

  catalogos.cedis.forEach(cedi => {

    const option =
      document.createElement("option");

    option.value = cedi[0];
    option.textContent = cedi[0];

    select.appendChild(option);

  });

}

//llenar estructuras
function cargarEstructuras() {

  const selectBuen =
    document.getElementById(
      "estructuraBuenEstado"
    );

  const selectDanada =
    document.getElementById(
      "estructuraDanada"
    );

  selectBuen.innerHTML =
    '<option value="">Seleccionar</option>';

  selectDanada.innerHTML =
    '<option value="">Seleccionar</option>';

  catalogos.estructuras.forEach(
    estructura => {

      const nombre =
        estructura[0];

      const option1 =
        document.createElement("option");

      option1.value = nombre;
      option1.textContent = nombre;

      selectBuen.appendChild(option1);

      const option2 =
        document.createElement("option");

      option2.value = nombre;
      option2.textContent = nombre;

      selectDanada.appendChild(option2);

    }

  );

}

//llenar auxiliares
function cargarAuxiliares() {

  const cediSeleccionado =
    document.getElementById("cedi").value;

  const selectAuxiliar =
    document.getElementById("auxiliar");

  // Limpiar opciones actuales
  selectAuxiliar.innerHTML =
    '<option value="">Seleccionar</option>';

  // Filtrar auxiliares por CEDI
  const auxiliaresFiltrados =
    catalogos.usuarios.filter(
      usuario => usuario[1] === cediSeleccionado
    );

  auxiliaresFiltrados.forEach(usuario => {

    const option =
      document.createElement("option");

    option.value = usuario[0];
    option.textContent = usuario[0];

    selectAuxiliar.appendChild(option);

  });

}

function ocultarTodasLasSecciones() {

    const secciones = [

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

    secciones.forEach(id => {

        const seccion = document.getElementById(id);

        if (seccion) {
            seccion.classList.add("oculto");
        }

    });

}

function mostrarSecciones(...ids) {

    ids.forEach(id => {

        document
            .getElementById(id)
            .classList.remove("oculto");

    });

}

//funcion UNICAMENTE PARA CAMARONES
function verificarModoCamarones() {

    const cedi =
        document.getElementById("cedi").value;

    const esCamarones =
        cedi === "CAMARONES";

    ocultarTodasLasSecciones();

    if (esCamarones) {

        mostrarSecciones(
            "seccionModoCamarones"
        );

    } else {

        mostrarSecciones(
            "seccionAuxiliar",
            "seccionTipoCaptura",
            "seccionContador",
            "seccionTabla",
            "seccionAcciones"
        );

        modoRegistro = "";
        modoFolio = "";
        folioGrupal = "";
        esRegistroGrupal = false;

    }

}


function seleccionarRegistroAuxiliar() {

    modoRegistro = "AUXILIAR";
    esRegistroGrupal = false;

    ocultarTodasLasSecciones();

    mostrarSecciones(
        "seccionAuxiliar",
        "seccionTipoCaptura",
        "seccionContador",
        "seccionTabla",
        "seccionAcciones"
    );

}


function seleccionarRegistroGrupal() {

    modoRegistro = "GRUPAL";
    esRegistroGrupal = true;
    tipoCaptura = "BUEN ESTADO";

    opcionesCaptura.forEach(o =>
        o.classList.remove("activa")
    );

    document
        .querySelector('[data-tipo="BUEN ESTADO"]')
        .classList.add("activa");

    ocultarTodasLasSecciones();

    mostrarSecciones(
        "seccionAuxiliar",
        "seccionFolioGrupal"
    );

    document
        .getElementById("btnPDF")
        .disabled = true;

    actualizarContador();

}



function seleccionarNuevoFolio() {

    modoFolio = "NUEVO";
    folioGrupal = "";

    document
        .getElementById("campoFoliosAbiertos")
        .classList.add("oculto");

    document
        .getElementById("folioGrupalActual")
        .classList.add("oculto");

    mostrarSecciones(
        "seccionBuenEstado"
    );

    alert("Selecciona el tipo de estructura para generar el folio.");

}

async function generarNuevoFolioGrupal() {

    const fecha =
        document.getElementById("fecha").value;

    const cedi =
        document.getElementById("cedi").value;

    const estructura =
        document.getElementById("estructuraBuenEstado").value;

    if (!fecha) {
        alert("Selecciona una fecha");
        return;
    }

    if (!cedi) {
        alert("Selecciona un CEDI");
        return;
    }

    if (!estructura) {
        alert("Selecciona una estructura");
        return;
    }

    try {

        const response =
            await fetch(
                `${URL_API}?action=nuevoFolio&cedi=${encodeURIComponent(cedi)}&estructura=${encodeURIComponent(estructura)}&fecha=${encodeURIComponent(fecha)}`
            );

        const resultado =
            await response.json();

        if (!resultado.success) {
            alert(resultado.mensaje);
            return;
        }

        folioGrupal =
            resultado.item;

        const divFolio =
            document.getElementById("folioGrupalActual");

        divFolio.textContent =
            `Folio generado: ${folioGrupal}`;

        divFolio.classList.remove("oculto");

        document
            .getElementById("estructuraBuenEstado")
            .disabled = true;

        mostrarSecciones(
            "seccionContador",
            "seccionTabla",
            "seccionAcciones"
        );

    } catch (error) {

        console.error(error);

        alert("Error al generar folio grupal");

    }

}

function seleccionarFolioExistente() {

    modoFolio = "EXISTENTE";
    folioGrupal = "";

    document
        .getElementById("campoFoliosAbiertos")
        .classList.remove("oculto");

    document
        .getElementById("seccionBuenEstado")
        .classList.add("oculto");

    document
        .getElementById("folioGrupalActual")
        .classList.add("oculto");

    cargarFoliosAbiertos();

}

async function cargarFoliosAbiertos() {

    const select =
        document.getElementById("folioGrupalExistente");

    select.innerHTML =
        '<option value="">Cargando...</option>';

    try {

        const cedi =
            document.getElementById("cedi").value;

        const response =
            await fetch(
                `${URL_API}?action=foliosAbiertos&cedi=${encodeURIComponent(cedi)}`
            );

        const resultado =
            await response.json();

        select.innerHTML =
            '<option value="">Seleccionar folio</option>';

        if (
            !resultado.success ||
            resultado.folios.length === 0
        ) {

            select.innerHTML =
                '<option value="">No hay folios abiertos</option>';

            return;

        }

        resultado.folios.forEach(folio => {

            const option =
                document.createElement("option");

            option.value =
                folio.item;

            option.textContent =
                `${folio.item} (${folio.capturadas}/${folio.limite})`;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        select.innerHTML =
            '<option value="">Error al cargar</option>';

    }

}

function seleccionarFolioGrupal() {

    folioGrupal =
        document.getElementById("folioGrupalExistente").value;

    if (!folioGrupal) return;

    mostrarSecciones(
        "seccionBuenEstado",
        "seccionContador",
        "seccionTabla",
        "seccionAcciones"
    );

}



const opcionesCaptura =
    document.querySelectorAll('[data-tipo]');

let tipoCaptura = '';
let modoRegistro = "";        // AUXILIAR | GRUPAL
let modoFolio = "";           // NUEVO | EXISTENTE
let folioGrupal = "";
let esRegistroGrupal = false;

opcionesCaptura.forEach(opcion => {

    opcion.addEventListener('click', () => {

        opcionesCaptura.forEach(o =>
            o.classList.remove('activa')
        );

        opcion.classList.add('activa');

        tipoCaptura =
            opcion.dataset.tipo;

        console.log(tipoCaptura);

        if (tipoCaptura === 'BUEN ESTADO') {

            document
                .getElementById('seccionBuenEstado')
                .classList.remove('oculto');

            document
                .getElementById('seccionDanada')
                .classList.add('oculto');

        } else {

            document
                .getElementById('seccionDanada')
                .classList.remove('oculto');

            document
                .getElementById('seccionBuenEstado')
                .classList.add('oculto');

        }

        actualizarContador();

    });

});

// LOTE

let lote = [];
let ultimoLoteRegistrado = [];
let ultimoFolio = "";
let ultimaFecha = "";
let ultimoCedi = "";
let ultimoAuxiliar = "";
let ultimoEsRegistroGrupal = false;
const LIMITE = 16;

const LIMITES_BUEN_ESTADO = {

    "G2N": 8,
    "G2C": 8,
    "G4Y": 7,
    "G4B": 7,
    "ATV": 6

};


//contador
function actualizarContador() {

    const cantidad = lote.length;

    let limiteActual = LIMITE;

    if (tipoCaptura === "BUEN ESTADO") {

        const estructura =
            document.getElementById(
                "estructuraBuenEstado"
            ).value;

        limiteActual =
            LIMITES_BUEN_ESTADO[estructura] || 0;

    } else {

        limiteActual = 16;

    }

    document.getElementById(
        "contadorActual"
    ).textContent = cantidad;

    document.getElementById(
        "contadorLimite"
    ).textContent = limiteActual;

    const porcentaje =
        limiteActual > 0
            ? (cantidad / limiteActual) * 100
            : 0;

    document.getElementById(
        "progresoFill"
    ).style.width = `${porcentaje}%`;

    const btnRegistrar =
        document.getElementById(
            "btnRegistrar"
        );

    if (esRegistroGrupal) {

    btnRegistrar.disabled =
        cantidad === 0;

} else if (tipoCaptura === "BUEN ESTADO") {

    btnRegistrar.disabled =
        cantidad !== limiteActual;

} else {

    btnRegistrar.disabled =
        cantidad === 0;

}

}

//sin numero de serie
const estadoDanado =
    document.getElementById("estadoDanado");

const serieDanada =
    document.getElementById("serieDanada");

estadoDanado.addEventListener("change", () => {

    if (
        estadoDanado.value ===
        "SIN NUMERO DE SERIE"
    ) {

        serieDanada.value = "N/A";
        serieDanada.disabled = true;

    } else {

        serieDanada.value = "";
        serieDanada.disabled = false;

    }

});

//agregar mas estructuras

const btnAgregar =
    document.getElementById("btnAgregar");

btnAgregar.addEventListener("click", () => {

    if (lote.length >= LIMITE) {

        detenerScanner();

        mostrarMensajeScanner(
            "Ya se alcanzó el límite de estructuras"
        );

        return;

    }

    const estado =
        document.getElementById("estadoDanado").value;

    const estructura =
        document.getElementById("estructuraDanada").value;

    let serie =
        document.getElementById("serieDanada").value.trim();

    if (!estado) {

        mostrarMensajeScanner(
            "Selecciona un estado"
        );

        return;

    }

    if (!estructura) {

        mostrarMensajeScanner(
            "Selecciona una estructura"
        );

        return;

    }

    if (
        estado !== "SIN NUMERO DE SERIE" &&
        !serie
    ) {

        mostrarMensajeScanner(
            "Captura una serie"
        );

        return;

    }

    const datosEstructura =
        catalogos.estructuras.find(
            item => item[0] === estructura
        );

    serie = serie.trim().toUpperCase();

const existe = lote.some(
    item =>
        item.serie
            .trim()
            .toUpperCase() === serie
);

if (
    serie !== "N/A" &&
    existe
) {

    mostrarMensajeScanner(
        "⚠ Serie duplicada, favor de verificar la bitácora"
    );

}
    lote.push({

        estado,

        estructura,

        serie,

        bases: datosEstructura[1],

        tapa: datosEstructura[2],

        poste: datosEstructura[3],

        h: datosEstructura[4],

        travesano: datosEstructura[5]

    });

    actualizarContador();
    renderizarTabla();

    document.getElementById(
        "estadoDanado"
    ).value = "";

    document.getElementById(
        "estructuraDanada"
    ).value = "";

    document.getElementById(
        "serieDanada"
    ).value = "";

    serieDanada.disabled = false;

    console.log(lote);

});

//guardarlos enseguida de que se realice el registro
function renderizarTabla() {

    const tbody =
        document.getElementById("tablaRegistros");

    tbody.innerHTML = "";

    lote.forEach((pieza, index) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${pieza.estado}</td>
            <td>${pieza.estructura}</td>
            <td>${pieza.serie}</td>
            <td>
                <button
                    class="btn-eliminar"
                    data-index="${index}">
                    🗑️
                </button>
            </td>
        `;

        tbody.appendChild(fila);

    });

}

//eliminar registros
document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("btn-eliminar"))
        return;

    const index =
        Number(e.target.dataset.index);

    lote.splice(index, 1);

if (lote.length === 0) {

    document.getElementById(
        "estructuraBuenEstado"
    ).disabled = false;

}

actualizarContador();
renderizarTabla();



});



///
document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarCatalogos();

    //cedi
    document
    .getElementById("cedi")
    .addEventListener("change", () => {

        cargarAuxiliares();
        verificarModoCamarones();

    });

    document
    .getElementById("btnNuevoFolioGrupal")
    .addEventListener(
        "click",
        seleccionarNuevoFolio
    );

document
    .getElementById("btnFolioExistenteGrupal")
    .addEventListener(
        "click",
        seleccionarFolioExistente
    );

    document
    .getElementById("btnRegistroAuxiliar")
    .addEventListener("click", seleccionarRegistroAuxiliar);

    document
    .getElementById("btnRegistroGrupal")
    .addEventListener("click", seleccionarRegistroGrupal);

    // Escáner para Buen Estado
    document
      .getElementById("btnEscanear")
      .addEventListener(
        "click",
        () => iniciarScanner("BUEN_ESTADO")
      );

    // Escáner para Dañada
    document
      .getElementById("btnEscanearDanada")
      .addEventListener(
        "click",
        () => iniciarScanner("DANADA")
      );

    document
  .getElementById("estructuraBuenEstado")
  .addEventListener(
    "change",
    async (e) => {

      actualizarComponentes(
        e.target.value
      );

      actualizarContador();

      if (
        esRegistroGrupal &&
        modoFolio === "NUEVO" &&
        e.target.value
      ) {

        await generarNuevoFolioGrupal();

      }

    }
  );

    // Captura manual Buen Estado con Enter
    document
      .getElementById("serieBuenEstado")
      .addEventListener(
        "keydown",
        (e) => {

          if (e.key === "Enter") {

            e.preventDefault();

            agregarSerieBuenEstado();

          }

        }
      );

      document
    .getElementById("folioGrupalExistente")
    .addEventListener(
        "change",
        seleccionarFolioGrupal
    );

    // Captura manual Dañada con Enter
    document
      .getElementById("serieDanada")
      .addEventListener(
        "keydown",
        (e) => {

          if (e.key === "Enter") {

            e.preventDefault();

            document
              .getElementById("btnAgregar")
              .click();

          }

        }
      );

    document
      .getElementById("btnRegistrar")
      .addEventListener(
        "click",
        registrarRecuperaciones
      );

    document
      .getElementById("btnPDF")
      .addEventListener(
        "click",
        generarPDF
      );

  }
);

//llenar datos de estructuras
function actualizarComponentes(nombreEstructura) {

  const estructura =
    catalogos.estructuras.find(
      item => item[0] === nombreEstructura
    );

  if (!estructura) return;

  document.getElementById("bases")
    .textContent = estructura[1] || 0;

  document.getElementById("tapa")
    .textContent = estructura[2] || 0;

  document.getElementById("poste")
    .textContent = estructura[3] || 0;

  document.getElementById("h")
    .textContent = estructura[4] || 0;

  document.getElementById("travesano")
    .textContent = estructura[5] || 0;

}

//agregar series en buen estado
function agregarSerieBuenEstado() {

    const estructura =
        document.getElementById(
            "estructuraBuenEstado"
        ).value;

    const limiteEstructura =
        LIMITES_BUEN_ESTADO[estructura];

    const serie =
        document.getElementById(
            "serieBuenEstado"
        ).value
        .trim()
        .toUpperCase();

    if (!estructura) {

        alert(
            "Selecciona una estructura"
        );

        return;

    }

    if (!serie) {

        return;

    }

    // validar límite por estructura

    if (lote.length >= limiteEstructura) {

        detenerScanner();

        mostrarMensajeScanner(
            `Límite alcanzado: ${limiteEstructura} series para ${estructura}`
        );

        return;

    }

    // validar duplicados

    const existe = lote.some(
    item =>
        item.serie
            .trim()
            .toUpperCase() === serie
);

if (existe) {

    mostrarMensajeScanner(
        "⚠ Serie duplicada, favor de verificar la bitácora"
    );

}

    const datosEstructura =
        catalogos.estructuras.find(
            item => item[0] === estructura
        );

    lote.push({

        estado: "BUEN ESTADO",

        estructura,

        serie,

        bases: datosEstructura[1],

        tapa: datosEstructura[2],

        poste: datosEstructura[3],

        h: datosEstructura[4],

        travesano: datosEstructura[5]

    });

    // apagar cámara después de una lectura correcta
    detenerScanner();

    // bloquear estructura después de la primera captura

    document.getElementById(
        "estructuraBuenEstado"
    ).disabled = true;

    actualizarContador();

    renderizarTabla();

    document
        .getElementById(
            "serieBuenEstado"
        )
        .value = "";

    document
        .getElementById(
            "serieBuenEstado"
        )
        .focus();

}

//funcion para registrar las recuperaciones
async function registrarRecuperaciones() {


    const fecha =
        document.getElementById("fecha").value;

    const cedi =
        document.getElementById("cedi").value;

    const auxiliar =
        document.getElementById("auxiliar").value;

    if (!fecha) {

        alert("Selecciona una fecha");
        return;

    }

    if (!cedi) {

        alert("Selecciona un CEDI");
        return;

    }

    if (!auxiliar) {

        alert("Selecciona un auxiliar");
        return;

    }

    if (lote.length === 0) {

    alert("No hay registros para guardar");
    return;

}

const btnRegistrar =
    document.getElementById(
        "btnRegistrar"
    );

btnRegistrar.disabled = true;

btnRegistrar.textContent =
    "Guardando...";



    const datos = {
    fecha,
    cedi,
    auxiliar,
    tipoCaptura,
    modoRegistro,
    modoFolio,
    folioGrupal,
    registros: lote
};

    try {

        const response =
    await fetch(URL_API, {

        method: "POST",

        body:
            JSON.stringify(datos)

    });


        const resultado =
            await response.json();

        if (!resultado.success) {

            btnRegistrar.disabled = false;

            btnRegistrar.textContent =
                "Registrar";

            alert(resultado.mensaje);

            return;

        }

        // Guardar datos para el PDF

ultimoFolio =
    resultado.item;

ultimoLoteRegistrado =
    [...lote];

    ultimoCedi = cedi;

ultimoAuxiliar = auxiliar;

ultimaFecha = fecha;

ultimoEsRegistroGrupal = esRegistroGrupal;

let mensaje = `Registro guardado correctamente\nFolio: ${resultado.item}`;

if (resultado.duplicadas && resultado.duplicadas.length > 0) {
    mensaje +=
        "\n\n⚠ Serie duplicada, favor de verificar la bitácora:\n" +
        resultado.duplicadas.join(", ");
}

alert(mensaje);

btnRegistrar.disabled = false;

btnRegistrar.textContent =
    "Registrar";

// habilitar botón PDF

if (!esRegistroGrupal) {

    document
        .getElementById("btnPDF")
        .disabled = false;

}
else {

    document
        .getElementById("btnPDF")
        .disabled =
        !resultado.loteCompleto;

}

limpiarFormulario();

    } catch(error) {

    console.error(error);

    btnRegistrar.disabled = false;

    btnRegistrar.textContent =
        "Registrar";

    alert(
        "Error al guardar información"
    );

}

}



//esta funcion es para limpiar el formulario
function limpiarFormulario() {

    lote = [];

    renderizarTabla();
    actualizarContador();

    document.getElementById("fecha").value = "";

    document.getElementById("cedi").value = "";

    document.getElementById("auxiliar").innerHTML =
        '<option value="">Seleccionar</option>';

    document.getElementById(
        "estructuraBuenEstado"
    ).value = "";

    document.getElementById(
        "estructuraBuenEstado"
    ).disabled = false;

    document.getElementById(
        "serieBuenEstado"
    ).value = "";

    document.getElementById(
        "estadoDanado"
    ).value = "";

    document.getElementById(
        "estructuraDanada"
    ).value = "";

    document.getElementById(
        "serieDanada"
    ).value = "";

    document.getElementById(
        "contadorActual"
    ).textContent = 0;

        modoRegistro = "";
    modoFolio = "";
    folioGrupal = "";
    esRegistroGrupal = false;

    document
    .getElementById("seccionBuenEstado")
    .classList.add("oculto");

    document
        .getElementById("folioGrupalActual")
        .classList.add("oculto");

    document
        .getElementById("campoFoliosAbiertos")
        .classList.add("oculto");

    document
        .getElementById("folioGrupalExistente")
        .innerHTML =
        '<option value="">Seleccionar folio</option>';

    

}

async function generarPDF() {

    let registrosPDF = ultimoLoteRegistrado;

    if (ultimoEsRegistroGrupal) {

        const response = await fetch(
            `${URL_API}?action=registrosFolio&cedi=${encodeURIComponent(ultimoCedi)}&item=${encodeURIComponent(ultimoFolio)}`
        );

        const resultado = await response.json();

        if (!resultado.success) {
            alert(resultado.mensaje);
            return;
        }

        registrosPDF = resultado.registros;

    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const marcaAgua = await cargarImagenBase64(
        "iconos/marca_de_agua.png"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(23);

    doc.text(
        "LISTADO DE ESTRUCTURAS DE METAL",
        doc.internal.pageSize.getWidth() / 2,
        25,
        { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(42);

    doc.text(`Folio: ${ultimoFolio}`, 15, 45);
    doc.text(`Fecha: ${ultimaFecha}`, 15, 62);
    doc.text(`CEDI: ${ultimoCedi}`, 15, 79);

    doc.addImage(
        marcaAgua,
        "PNG",
        45,
        95,
        120,
        120
    );

    const filas = registrosPDF.map((pieza, index) => [
        index + 1,
        pieza.estado,
        pieza.estructura,
        pieza.serie
    ]);

    doc.autoTable({
        startY: 95,
        head: [["#", "Estado", "Tipo de Estructura", "Serie"]],
        body: filas,

        styles: {
            fontSize: 10,
            cellPadding: 3,
            halign: "center",
            fillColor: false
        },

        headStyles: {
            fontSize: 10,
            fontStyle: "bold",
            fillColor: [40, 132, 184],
            textColor: [255, 255, 255]
        },

        bodyStyles: {
            fillColor: false
        },

        alternateRowStyles: {
            fillColor: false
        }
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
        `Total de piezas: ${registrosPDF.length}`,
        15,
        doc.lastAutoTable.finalY + 12
    );

    doc.save(`${ultimoFolio}.pdf`);
}

function cargarImagenBase64(ruta) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL("image/png"));
        };

        img.src = ruta;
    });
}

function mostrarMensajeScanner(texto) {

    const mensaje =
        document.getElementById("mensajeScanner");

    mensaje.textContent = texto;
    mensaje.classList.remove("oculto");

    setTimeout(() => {

        mensaje.classList.add("oculto");
        mensaje.textContent = "";

    }, 2500);

}


/* =====================================================
   ENVÍO DE ESTRUCTURAS
===================================================== */


/* =========================
   VARIABLES
========================= */

let foliosEnvio = [];

let scannerEnvio = null;
let scannerEnvioActivo = false;


/*
    Cantidad de estructuras por folio
*/
const ESTRUCTURAS_POR_FOLIO = {

    G2N: 8,
    G2I: 8,
    G4Y: 7,
    G4B: 7,
    ATV: 6

};


/* =====================================================
   MENÚ ⋮
===================================================== */

const btnMenu =
    document.getElementById("btnMenu");

const menuOpciones =
    document.getElementById("menuOpciones");

const btnEnvioEstructuras =
    document.getElementById("btnEnvioEstructuras");


if (btnMenu) {

    btnMenu.addEventListener("click", (e) => {

        e.stopPropagation();

        menuOpciones.classList.toggle("oculto");

    });

}


/*
    Cerrar menú al hacer clic fuera
*/

document.addEventListener("click", (e) => {

    if (
        menuOpciones &&
        btnMenu &&
        !menuOpciones.contains(e.target) &&
        !btnMenu.contains(e.target)
    ) {

        menuOpciones.classList.add("oculto");

    }

});


/* =====================================================
   ENTRAR A ENVÍO
===================================================== */

if (btnEnvioEstructuras) {

    btnEnvioEstructuras.addEventListener(
        "click",
        abrirEnvioEstructuras
    );

}


function abrirEnvioEstructuras() {

    /*
        Cerrar menú
    */

    menuOpciones.classList.add("oculto");


    /*
        Detener escáner anterior
        por seguridad
    */

    try {

        detenerScanner();

    } catch (error) {

        console.log(
            "No había escáner de recuperación activo."
        );

    }


    /*
        Ocultar flujo de recuperaciones
    */

    ocultarTodasLasSecciones();

    
    /*
        Mostrar envío
    */

    document
        .getElementById("seccionEnvioEstructuras")
        .classList.remove("oculto");


    /*
        Cambiar título
    */

    const titulo =
        document.querySelector(
            ".app-header h1"
        );

    if (titulo) {

        titulo.textContent =
            "ENVÍO DE ESTRUCTURAS";

    }


    /*
        Cargar CEDIS
    */

    cargarCedisEnvio();


    /*
        Colocar fecha actual
    */

    establecerFechaEnvio();


    /*
        Limpiar datos anteriores
        de una sesión anterior
    */

    limpiarEnvioEstructuras();

}


/* =====================================================
   REGRESAR A RECUPERACIONES
===================================================== */

const btnRegresarRecuperaciones =
    document.getElementById(
        "btnRegresarRecuperaciones"
    );


if (btnRegresarRecuperaciones) {

    btnRegresarRecuperaciones.addEventListener(
        "click",
        regresarRecuperaciones
    );

}


function regresarRecuperaciones() {

    /*
        Detener escáner
    */

    detenerScannerEnvio();


    /*
        Ocultar módulo de envío
    */

    document
        .getElementById(
            "seccionEnvioEstructuras"
        )
        .classList.add("oculto");


    /*
        Restaurar título
    */

    const titulo =
        document.querySelector(
            ".app-header h1"
        );

    if (titulo) {

        titulo.textContent =
            "RECUPERACIONES DE ESTRUCTURAS DE METAL";

    }

    mostrarSecciones("seccionDatosGenerales");

    /*
        Volver a mostrar el flujo
        correspondiente al CEDI actual
    */

    const cedi =
        document.getElementById("cedi").value;


    if (cedi) {

        verificarModoCamarones();

    } else {

        mostrarSecciones(
            "seccionDatosGenerales"
        );

    }

}


/* =====================================================
   CARGAR CEDIS EN ENVÍO
===================================================== */

function cargarCedisEnvio() {

    const select =
        document.getElementById(
            "envioCedi"
        );


    if (!select) return;


    select.innerHTML =
        '<option value="">Seleccionar</option>';


    /*
        Utilizamos el mismo catálogo
        que ya carga el aplicativo
    */

    if (
        !catalogos ||
        !catalogos.cedis
    ) {

        return;

    }


    catalogos.cedis.forEach(
        cedi => {

            const nombre =
                cedi[0];

            const option =
                document.createElement(
                    "option"
                );

            option.value = nombre;

            option.textContent = nombre;

            select.appendChild(option);

        }
    );

}


/* =====================================================
   FECHA ACTUAL
===================================================== */

function establecerFechaEnvio() {

    const input =
        document.getElementById(
            "fechaEnvio"
        );


    if (!input) return;


    const hoy =
        new Date();


    const anio =
        hoy.getFullYear();


    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoy.getDate()
        ).padStart(2, "0");


    input.value =
        `${anio}-${mes}-${dia}`;

}


/* =====================================================
   BOTÓN ESCANEAR FOLIO
===================================================== */

const btnEscanearFolioEnvio =
    document.getElementById(
        "btnEscanearFolioEnvio"
    );


if (btnEscanearFolioEnvio) {

    btnEscanearFolioEnvio.addEventListener(
        "click",
        iniciarScannerEnvio
    );

}


async function iniciarScannerEnvio() {

    const container =
        document.getElementById(
            "scannerEnvioContainer"
        );


    if (!container) return;


    /*
        Si ya está activo,
        no volver a iniciarlo
    */

    if (scannerEnvioActivo) {

        return;

    }


    container.classList.remove(
        "oculto"
    );


    try {

        scannerEnvio =
            new Html5Qrcode(
                "readerEnvio"
            );


        scannerEnvioActivo = true;


        await scannerEnvio.start(

            {
                facingMode: "environment"
            },

            {
                fps: 10,

                qrbox: {
                    width: 250,
                    height: 250
                }

            },

            async (decodedText) => {

                /*
                    Lectura correcta
                */

                document
                    .getElementById(
                        "folioEnvio"
                    )
                    .value =
                    decodedText.trim()
                        .toUpperCase();


                /*
                    Apagar cámara
                */

                detenerScannerEnvio();


                /*
                    Validar automáticamente
                    el folio
                */

                await validarYAgregarFolioEnvio();

            },

            (errorMessage) => {

                /*
                    No mostramos errores
                    normales de lectura.
                */

            }

        );

    } catch (error) {

        console.error(
            "Error al iniciar scanner de envío:",
            error
        );


        scannerEnvioActivo = false;


        container.classList.add(
            "oculto"
        );


        mostrarMensajeFolioEnvio(
            "No se pudo iniciar la cámara."
        );

    }

}


/* =====================================================
   DETENER ESCÁNER
===================================================== */

function detenerScannerEnvio() {

    if (
        scannerEnvio &&
        scannerEnvioActivo
    ) {

        scannerEnvio.stop()
            .then(() => {

                scannerEnvio.clear();

                scannerEnvioActivo =
                    false;

            })
            .catch(error => {

                console.log(
                    "Error al detener scanner:",
                    error
                );

                scannerEnvioActivo =
                    false;

            });

    }


    const container =
        document.getElementById(
            "scannerEnvioContainer"
        );


    if (container) {

        container.classList.add(
            "oculto"
        );

    }

}


/* =====================================================
   BOTÓN AÑADIR FOLIO
===================================================== */

const btnAgregarFolioEnvio =
    document.getElementById(
        "btnAgregarFolioEnvio"
    );


if (btnAgregarFolioEnvio) {

    btnAgregarFolioEnvio.addEventListener(
        "click",
        validarYAgregarFolioEnvio
    );

}


/* =====================================================
   ENTER EN FOLIO
===================================================== */

const inputFolioEnvio =
    document.getElementById(
        "folioEnvio"
    );


if (inputFolioEnvio) {

    inputFolioEnvio.addEventListener(
        "keydown",
        async (e) => {

            if (
                e.key === "Enter"
            ) {

                e.preventDefault();

                await validarYAgregarFolioEnvio();

            }

        }
    );

}


/* =====================================================
   VALIDAR FOLIO
===================================================== */

async function validarYAgregarFolioEnvio() {

    const folioInput =
        document.getElementById(
            "folioEnvio"
        );


    const cediInput =
        document.getElementById(
            "envioCedi"
        );


    if (!folioInput || !cediInput) {

        return;

    }


    const folio =
        folioInput.value
            .trim()
            .toUpperCase();


    const cedi =
        cediInput.value;


    /*
        Validar CEDI
    */

    if (!cedi) {

        mostrarMensajeFolioEnvio(
            "Selecciona un CEDI antes de agregar folios."
        );

        return;

    }


    /*
        Validar folio
    */

    if (!folio) {

        mostrarMensajeFolioEnvio(
            "Escanea o escribe un folio."
        );

        return;

    }


    /*
        Evitar duplicados
    */

    const yaExiste =
        foliosEnvio.some(
            item =>
                item.folio === folio
        );


    if (yaExiste) {

        mostrarMensajeFolioEnvio(
            "⚠ Este folio ya fue agregado."
        );

        folioInput.focus();

        return;

    }


    /*
        Mostrar estado
    */

    mostrarMensajeFolioEnvio(
        "Validando folio..."
    );


    try {

        /*
            Consultar Apps Script
        */

        const response =
            await fetch(
                `${URL_API}?action=validarFolioEnvio` +
                `&cedi=${encodeURIComponent(cedi)}` +
                `&item=${encodeURIComponent(folio)}`
            );


        const resultado =
            await response.json();


        /*
            Folio inexistente
        */

        if (
            !resultado.success
        ) {

            mostrarMensajeFolioEnvio(
                "❌ " +
                (
                    resultado.mensaje ||
                    "Folio no encontrado."
                )
            );

            return;

        }


        /*
            Identificar estructura
        */

        const tipo =
            identificarTipoFolio(
                folio,
                resultado.estructura
            );


        if (!tipo) {

            mostrarMensajeFolioEnvio(
                "❌ No se pudo identificar el tipo de estructura del folio."
            );

            return;

        }


        /*
            Cantidad correspondiente
        */

        const cantidad =
            ESTRUCTURAS_POR_FOLIO[
                tipo.codigo
            ];


        /*
            Agregar a memoria
        */

        foliosEnvio.push({

            folio: folio,

            tipo: tipo.codigo,

            nombre: tipo.nombre,

            cantidad: cantidad

        });


        /*
            Actualizar tabla
        */

        renderizarFoliosEnvio();


        /*
            Actualizar totales
        */

        actualizarResumenEnvio();


        /*
            Limpiar campo
        */

        folioInput.value = "";

        folioInput.focus();


        /*
            Mensaje correcto
        */

        mostrarMensajeFolioEnvio(
            `✅ Folio válido: ${folio}`
        );


    } catch (error) {

        console.error(
            "Error validando folio:",
            error
        );


        mostrarMensajeFolioEnvio(
            "❌ No fue posible validar el folio. Verifica tu conexión."
        );

    }

}


/* =====================================================
   IDENTIFICAR ESTRUCTURA DEL FOLIO
===================================================== */

function identificarTipoFolio(
    folio,
    estructuraAppsScript = ""
) {

    const valor =
        String(
            estructuraAppsScript ||
            ""
        )
        .trim()
        .toUpperCase();


    /*
        Primero intentamos utilizar
        la estructura que nos devuelve
        Apps Script.
    */

    if (
        valor === "G2N" ||
        valor === "G2 NACIONAL" ||
        valor === "G2 NACIONAL"
    ) {

        return {

            codigo: "G2N",

            nombre: "G2 Nacional"

        };

    }


    if (
    valor === "G2C" ||
    valor === "G2I" ||
    valor === "G2 IMPORTADA"
) {

    return {

        codigo: "G2I",

        nombre: "G2 Importada"

    };

}


    if (
        valor === "G4Y" ||
        valor === "G4-Y"
    ) {

        return {

            codigo: "G4Y",

            nombre: "G4-Y"

        };

    }


    if (
        valor === "G4B" ||
        valor === "G4-B"
    ) {

        return {

            codigo: "G4B",

            nombre: "G4-B"

        };

    }


    if (
        valor === "ATV" ||
        valor.includes("CUATRIMOTO")
    ) {

        return {

            codigo: "ATV",

            nombre: "ATV (Cuatrimoto)"

        };

    }


    /*
        Si Apps Script no devolvió
        estructura, usamos el prefijo
        del folio como respaldo.
    */

    const prefijo =
        String(folio)
            .trim()
            .toUpperCase()
            .split("-")[0];


    if (prefijo === "G2N") {

        return {

            codigo: "G2N",

            nombre: "G2 Nacional"

        };

    }


    if (
    prefijo === "G2C" ||
    prefijo === "G2I"
) {

    return {

        codigo: "G2I",

        nombre: "G2 Importada"

    };

}


    if (prefijo === "G4Y") {

        return {

            codigo: "G4Y",

            nombre: "G4-Y"

        };

    }


    if (prefijo === "G4B") {

        return {

            codigo: "G4B",

            nombre: "G4-B"

        };

    }


    if (prefijo === "ATV") {

        return {

            codigo: "ATV",

            nombre: "ATV (Cuatrimoto)"

        };

    }


    return null;

}


/* =====================================================
   RENDERIZAR TABLA DE FOLIOS
===================================================== */

function renderizarFoliosEnvio() {

    const tbody =
        document.getElementById(
            "tablaFoliosEnvio"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    foliosEnvio.forEach(
        (item, index) => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${item.folio}
                </td>

                <td>
                    ${item.nombre}
                </td>

                <td>
                    ${item.cantidad}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-eliminar-folio-envio"
                        data-index="${index}">

                        🗑️

                    </button>

                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}


/* =====================================================
   ELIMINAR FOLIO DEL ENVÍO
===================================================== */

document.addEventListener(
    "click",
    (e) => {

        const boton =
            e.target.closest(
                ".btn-eliminar-folio-envio"
            );


        if (!boton) return;


        const index =
            Number(
                boton.dataset.index
            );


        if (
            Number.isNaN(index)
        ) {

            return;

        }


        foliosEnvio.splice(
            index,
            1
        );


        renderizarFoliosEnvio();

        actualizarResumenEnvio();

    }
);


/* =====================================================
   ACTUALIZAR RESUMEN
===================================================== */

function actualizarResumenEnvio() {

    let g2Nacional = 0;

    let g2Importada = 0;

    let g4Y = 0;

    let g4B = 0;

    let atv = 0;


    foliosEnvio.forEach(
        item => {

            switch (
                item.tipo
            ) {

                case "G2N":

                    g2Nacional +=
                        item.cantidad;

                    break;


                case "G2I":

                    g2Importada +=
                        item.cantidad;

                    break;


                case "G4Y":

                    g4Y +=
                        item.cantidad;

                    break;


                case "G4B":

                    g4B +=
                        item.cantidad;

                    break;


                case "ATV":

                    atv +=
                        item.cantidad;

                    break;

            }

        }
    );


    const total =
        g2Nacional +
        g2Importada +
        g4Y +
        g4B +
        atv;


    document.getElementById(
        "envioG2Nacional"
    ).textContent =
        g2Nacional;


    document.getElementById(
        "envioG2Importada"
    ).textContent =
        g2Importada;


    document.getElementById(
        "envioG4Y"
    ).textContent =
        g4Y;


    document.getElementById(
        "envioG4B"
    ).textContent =
        g4B;


    document.getElementById(
        "envioATV"
    ).textContent =
        atv;


    document.getElementById(
        "envioCantidadTotal"
    ).textContent =
        total;


    actualizarTotalTornilleria();

}


/* =====================================================
   TORNILLERÍA
===================================================== */

const camposTornilleria = [

    "tornilloM6",

    "tornilloM8",

    "tornilloM8x55"

];


camposTornilleria.forEach(
    id => {

        const campo =
            document.getElementById(
                id
            );


        if (!campo) return;


        campo.addEventListener(
            "input",
            actualizarTotalTornilleria
        );

    }
);


function obtenerNumero(
    id
) {

    const campo =
        document.getElementById(
            id
        );


    if (!campo) return 0;


    const valor =
        Number(
            campo.value
        );


    return Number.isFinite(valor)
        ? valor
        : 0;

}


function actualizarTotalTornilleria() {

    const m6 =
        obtenerNumero(
            "tornilloM6"
        );


    const m8 =
        obtenerNumero(
            "tornilloM8"
        );


    const m8x55 =
        obtenerNumero(
            "tornilloM8x55"
        );


    const total =
        m6 +
        m8 +
        m8x55;


    const elemento =
        document.getElementById(
            "totalTornilleria"
        );


    if (elemento) {

        elemento.textContent =
            total;

    }


    actualizarEstadoBotonEnvio();

}


/* =====================================================
   EVIDENCIA
===================================================== */

const evidenciaEnvio =
    document.getElementById(
        "evidenciaEnvio"
    );


if (evidenciaEnvio) {

    evidenciaEnvio.addEventListener(
        "change",
        mostrarPreviewEvidencia
    );

}


function mostrarPreviewEvidencia() {

    const archivo =
        evidenciaEnvio.files[0];


    const preview =
        document.getElementById(
            "previewEvidencia"
        );


    const imagen =
        document.getElementById(
            "imagenEvidencia"
        );


    if (
        !archivo ||
        !archivo.type.startsWith(
            "image/"
        )
    ) {

        preview.classList.add(
            "oculto"
        );

        imagen.src = "";

        actualizarEstadoBotonEnvio();

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        (e) => {

            imagen.src =
                e.target.result;

            preview.classList.remove(
                "oculto"
            );

        };


    reader.readAsDataURL(
        archivo
    );


    actualizarEstadoBotonEnvio();

}


/* =====================================================
   HABILITAR / DESHABILITAR ENVIAR
===================================================== */

function actualizarEstadoBotonEnvio() {

    const boton =
        document.getElementById(
            "btnEnviarEstructuras"
        );


    if (!boton) return;


    const cedi =
        document.getElementById(
            "envioCedi"
        )?.value;


    const fecha =
        document.getElementById(
            "fechaEnvio"
        )?.value;


    const marchamo =
        document.getElementById(
            "numeroMarchamo"
        )?.value.trim();


    /*
        Por ahora pedimos:

        CEDI
        Fecha
        Al menos un folio
        Marchamo
        Evidencia
    */

    const evidencia =
        document.getElementById(
            "evidenciaEnvio"
        )?.files.length > 0;


    boton.disabled =
        !cedi ||
        !fecha ||
        foliosEnvio.length === 0 ||
        !marchamo ||
        !evidencia;

}


/* =====================================================
   EVENTOS DE CAMPOS DEL ENVÍO
===================================================== */

[
    "envioCedi",
    "fechaEnvio",
    "numeroMarchamo"

].forEach(
    id => {

        const campo =
            document.getElementById(
                id
            );


        if (!campo) return;


        campo.addEventListener(
            "input",
            actualizarEstadoBotonEnvio
        );


        campo.addEventListener(
            "change",
            actualizarEstadoBotonEnvio
        );

    }
);


/* =====================================================
   MENSAJE DE FOLIO
===================================================== */

function mostrarMensajeFolioEnvio(
    texto
) {

    const mensaje =
        document.getElementById(
            "mensajeFolioEnvio"
        );


    if (!mensaje) return;


    mensaje.textContent =
        texto;


    mensaje.classList.remove(
        "oculto"
    );


    clearTimeout(
        window.timeoutMensajeFolioEnvio
    );


    window.timeoutMensajeFolioEnvio =
        setTimeout(
            () => {

                mensaje.classList.add(
                    "oculto"
                );

                mensaje.textContent =
                    "";

            },

            3000
        );

}


/* =====================================================
   LIMPIAR ENVÍO
===================================================== */

function limpiarEnvioEstructuras() {

    foliosEnvio = [];


    renderizarFoliosEnvio();

    actualizarResumenEnvio();


    const folio =
        document.getElementById(
            "folioEnvio"
        );


    if (folio) {

        folio.value = "";

    }


    const marchamo =
        document.getElementById(
            "numeroMarchamo"
        );


    if (marchamo) {

        marchamo.value = "";

    }


    const tornillos = [

        "tornilloM6",

        "tornilloM8",

        "tornilloM8x55"

    ];


    tornillos.forEach(
        id => {

            const campo =
                document.getElementById(
                    id
                );


            if (campo) {

                campo.value = 0;

            }

        }
    );


    if (evidenciaEnvio) {

        evidenciaEnvio.value =
            "";

    }


    const preview =
        document.getElementById(
            "previewEvidencia"
        );


    const imagen =
        document.getElementById(
            "imagenEvidencia"
        );


    if (preview) {

        preview.classList.add(
            "oculto"
        );

    }


    if (imagen) {

        imagen.src = "";

    }


    actualizarTotalTornilleria();

    actualizarEstadoBotonEnvio();

}


/* =====================================================
   BOTÓN ENVIAR
===================================================== */

const btnEnviarEstructuras =
    document.getElementById(
        "btnEnviarEstructuras"
    );


if (btnEnviarEstructuras) {

    btnEnviarEstructuras.addEventListener(
        "click",
        enviarEstructuras
    );

}


async function enviarEstructuras() {

    const cedi =
        document.getElementById(
            "envioCedi"
        ).value;


    const fecha =
        document.getElementById(
            "fechaEnvio"
        ).value;


    const marchamo =
        document.getElementById(
            "numeroMarchamo"
        ).value.trim();


    if (!cedi) {

        alert(
            "Selecciona un CEDI."
        );

        return;

    }


    if (!fecha) {

        alert(
            "Selecciona la fecha de envío."
        );

        return;

    }


    if (
        foliosEnvio.length === 0
    ) {

        alert(
            "Agrega al menos un folio."
        );

        return;

    }


    if (!marchamo) {

        alert(
            "Captura el número de marchamo."
        );

        return;

    }


    if (
        !evidenciaEnvio ||
        evidenciaEnvio.files.length === 0
    ) {

        alert(
            "Agrega una evidencia."
        );

        return;

    }


    const boton =
        document.getElementById(
            "btnEnviarEstructuras"
        );


    boton.disabled = true;

    boton.textContent =
        "ENVIANDO...";


    try {

        // ==========================================
        // CONVERTIR EVIDENCIA
        // ==========================================

        const archivo =
            evidenciaEnvio.files[0];


        const evidencia =
            await convertirImagenBase64(
                archivo
            );


        // ==========================================
        // DATOS DEL ENVÍO
        // ==========================================

        const datosEnvio = {

            tipoOperacion:
                "ENVIO_ESTRUCTURAS",

            cedi,

            fecha,

            folios:
                foliosEnvio,

            tornilloM6:
                obtenerNumero(
                    "tornilloM6"
                ),

            tornilloM8:
                obtenerNumero(
                    "tornilloM8"
                ),

            tornilloM8x55:
                obtenerNumero(
                    "tornilloM8x55"
                ),

            marchamo,

            evidencia

        };


        console.log(
            "ENVIANDO:",
            datosEnvio
        );


        // ==========================================
        // ENVIAR A APPS SCRIPT
        // ==========================================

        const response =
            await fetch(
                URL_API,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            datosEnvio
                        )

                }
            );


        const resultado =
            await response.json();


        console.log(
            "RESPUESTA APPS SCRIPT:",
            resultado
        );


        // ==========================================
        // ERROR
        // ==========================================

        if (
            !resultado.success
        ) {

            throw new Error(
                resultado.mensaje ||
                "No se pudo registrar el envío."
            );

        }


        // ==========================================
        // ÉXITO
        // ==========================================

        alert(
            "✅ Envío registrado correctamente.\n\n" +

            "Folios: " +
            resultado.folios.length +

            "\nEstructuras: " +
            resultado.cantidadTotal +

            "\nTornillería: " +
            resultado.totalTornilleria
        );


        // ==========================================
        // LIMPIAR FORMULARIO
        // ==========================================

        limpiarEnvioEstructuras();


    } catch (error) {

        console.error(
            "Error al enviar estructuras:",
            error
        );


        alert(
            "❌ No se pudo registrar el envío.\n\n" +
            error.message
        );


    } finally {

        boton.disabled = false;

        boton.textContent =
            "ENVIAR";

        actualizarEstadoBotonEnvio();

    }

}

function convertirImagenBase64(
    archivo
) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    const resultado =
                        reader.result;


                    const partes =
                        resultado.split(",");


                    resolve({

                        mimeType:
                            archivo.type ||
                            "image/jpeg",

                        base64:
                            partes[1]

                    });

                };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "No se pudo leer la evidencia."
                        )
                    );

                };


            reader.readAsDataURL(
                archivo
            );

        }
    );

}