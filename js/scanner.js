let scannerActivo = false;
let html5QrCode = null;
let scannerPausado = false;

function iniciarScanner() {

    const reader = document.getElementById("reader");

    reader.classList.remove("oculto");

    if (scannerActivo) return;

    html5QrCode = new Html5Qrcode("reader");

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

            document.getElementById("serieBuenEstado").value =
                decodedText;

            agregarSerieBuenEstado();

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
            .getElementById("reader")
            .classList.add("oculto");

        scannerActivo = false;
        scannerPausado = false;

    });

}