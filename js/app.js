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

const opcionesCaptura =
    document.querySelectorAll('.opcion-captura');

let tipoCaptura = '';

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
const LIMITE = 16;

const LIMITES_BUEN_ESTADO = {

    "NACIONAL": 8,
    "CHINA": 8,
    "G4Y": 7,
    "G4B": 7,
    "CUATRI": 9

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

    if (tipoCaptura === "BUEN ESTADO") {

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

        alert("Ya se alcanzó el límite de estructuras");
        return;

    }

    const estado =
        document.getElementById("estadoDanado").value;

    const estructura =
        document.getElementById("estructuraDanada").value;

    let serie =
        document.getElementById("serieDanada").value.trim();

    if (!estado) {

        alert("Selecciona un estado");
        return;

    }

    if (!estructura) {

        alert("Selecciona una estructura");
        return;

    }

    if (
        estado !== "SIN NUMERO DE SERIE" &&
        !serie
    ) {

        alert("Captura una serie");
        return;

    }

    // Buscar datos de la estructura

    const datosEstructura =
        catalogos.estructuras.find(
            item => item[0] === estructura
        );

    // Validar series duplicadas
    const existe = lote.some(
        item => item.serie === serie
    );

    if (
        serie !== "N/A" &&
        existe
    ) {

        alert(
            "La serie ya fue capturada"
        );

        return;

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

    document
      .getElementById("cedi")
      .addEventListener(
        "change",
        cargarAuxiliares
      );

      document
    .getElementById("btnEscanear")
    .addEventListener(
        "click",
        iniciarScanner
    );

    document
        .getElementById("estructuraBuenEstado")
        .addEventListener(
            "change",
            (e) => {

            actualizarComponentes(
                e.target.value
            );

            actualizarContador();

            }
        );

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
        ).value.trim();

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

        alert(
            `Solo se permiten ${limiteEstructura} series para ${estructura}`
        );

        return;

    }

    // validar duplicados

    const existe = lote.some(
        item => item.serie === serie
    );

    if (existe) {

        alert(
            "La serie ya fue capturada"
        );

        document
            .getElementById(
                "serieBuenEstado"
            )
            .value = "";

        return;

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

alert(
    `Registro guardado correctamente\nFolio: ${resultado.item}`
);

btnRegistrar.disabled = false;

btnRegistrar.textContent =
    "Registrar";

// habilitar botón PDF

document.getElementById(
    "btnPDF"
).disabled = false;

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

}

function generarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Título centrado y en negritas
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);

    doc.text(
        "RECUPERACIÓN DE ESTRUCTURAS DE METAL",
        doc.internal.pageSize.getWidth() / 2,
        20,
        { align: "center" }
    );

    // Datos generales
    doc.setFont("helvetica", "normal");
doc.setFontSize(45);

doc.text(
    `Folio: ${ultimoFolio}`,
    15,
    40
);

doc.text(
    `Fecha: ${ultimaFecha}`,
    15,
    60
);

doc.text(
    `CEDI: ${ultimoCedi}`,
    15,
    80
);

    // Tabla
    const filas = ultimoLoteRegistrado.map((pieza, index) => [
        index + 1,
        pieza.estado,
        pieza.estructura,
        pieza.serie
    ]);

    doc.autoTable({

    startY: 100,

    head: [[
        "#",
        "Estado",
        "Tipo de Estructura",
        "Serie"
    ]],

    body: filas,

    styles: {
        fontSize: 13,
        cellPadding: 2
    },

    headStyles: {
        fontSize: 13,
        fontStyle: "bold"
    }

});

    // Total
    doc.setFont("helvetica", "bold");
doc.setFontSize(11);

doc.text(
    `Total de piezas: ${ultimoLoteRegistrado.length}`,
    15,
    doc.lastAutoTable.finalY + 10
);

    doc.save(`${ultimoFolio}.pdf`);
}