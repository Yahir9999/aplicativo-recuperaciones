let scannerActivo = false;
let html5QrCode = null;
let scannerPausado = false;
let modoScanner = "BUEN_ESTADO";

function iniciarScanner(modo = "BUEN_ESTADO") {

    modoScanner = modo;

    const scannerContainer =
        document.getElementById("scannerContainer");

    scannerContainer.classList.remove("oculto");

    if (scannerActivo) return;

    html5QrCode =
        new Html5Qrcode("reader");

    html5QrCode.start(
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

            if (modoScanner === "BUEN_ESTADO") {

                document
                    .getElementById("serieBuenEstado")
                    .value = decodedText;

                agregarSerieBuenEstado();

            } else {

                document
                    .getElementById("serieDanada")
                    .value = decodedText;

                document
                    .getElementById("btnAgregar")
                    .click();

            }

            setTimeout(() => {
                scannerPausado = false;
            }, 2000);

        },
        () => {}
    );

    scannerActivo = true;
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