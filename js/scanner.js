let scannerActivo = false;
let html5QrCode = null;
let scannerPausado = false;
let modoScanner = "BUEN_ESTADO";

async function iniciarScanner(modo = "BUEN_ESTADO") {

    modoScanner = modo;

    const scannerContainer =
        document.getElementById("scannerContainer");

    scannerContainer.classList.remove("oculto");

    if (scannerActivo) {
        return;
    }

    html5QrCode =
        new Html5Qrcode("reader");

    try {

        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 120
                }
            },
            (decodedText) => {

                if (scannerPausado) return;

                scannerPausado = true;

                const serie = decodedText.trim();

                if (modoScanner === "BUEN_ESTADO") {

                    document
                        .getElementById("serieBuenEstado")
                        .value = serie;

                    agregarSerieBuenEstado();

                } else {

                    document
                        .getElementById("serieDanada")
                        .value = serie;

                    document
                        .getElementById("btnAgregar")
                        .click();

                }

                detenerScanner();

            },
            () => {}
        );

        scannerActivo = true;

    } catch (error) {

        console.error(error);

        mostrarMensajeScanner(
            "No se pudo iniciar la cámara"
        );

    }

}

function detenerScanner() {

    if (!html5QrCode || !scannerActivo) return;

    html5QrCode.stop().then(() => {

        document
            .getElementById("scannerContainer")
            .classList.add("oculto");

        scannerActivo = false;
        scannerPausado = false;

    });

}