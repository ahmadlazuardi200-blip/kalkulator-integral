const tombol = document.getElementById("tombolHitung");
const inputSoal = document.getElementById("soal");
const hasil = document.getElementById("hasil");

function integral(soal) {
    soal = soal
        .replace(/\s/g, "")
        .replace(/^∫/, "")
        .replace(/dx$/i, "")
        .replace(/−/g, "-");

    // 1. Integral e^(ax)
    let m = soal.match(/^e\^\(?([+-]?\d*)x\)?$/i);

    if (m) {
        let a = koefisien(m[1]);

        if (a === 0) return "Bentuk eksponen tidak valid.";

        return [
            "Soal: ∫ " + soal + " dx",
            "Gunakan rumus integral eksponen.",
            "Hasil: e^(" + a + "x) / " + a + " + C"
        ].join("\n\n");
    }

    // 2. Integral sin(ax) atau cos(ax)
    m = soal.match(/^(sin|cos)\(?([+-]?\d*)x\)?$/i);

    if (m) {
        let jenis = m[1].toLowerCase();
        let a = koefisien(m[2]);

        if (a === 0) return "Koefisien x tidak boleh nol.";

        let jawaban = jenis === "sin"
            ? "-cos(" + a + "x) / " + a + " + C"
            : "sin(" + a + "x) / " + a + " + C";

        return [
            "Soal: ∫ " + soal + " dx",
            "Gunakan rumus integral trigonometri.",
            "Hasil: " + jawaban
        ].join("\n\n");
    }

    // 3. Integral (ax+b)^n
    m = soal.match(/^\(?([+-]?\d*)x([+-]\d+)?\)?\^([+-]?\d+)$/i);

    if (m) {
        let a = koefisien(m[1]);
        let b = m[2] || "";
        let n = Number(m[3]);

        if (a === 0) return "Koefisien x tidak boleh nol.";

        let dalam = "(" + bentukLinear(a, b) + ")";

        if (n === -1) {
            return [
                "Soal: ∫ " + soal + " dx",
                "Gunakan rumus integral 1/u.",
                "Hasil: ln|" + bentukLinear(a, b) + "| / " + a + " + C"
            ].join("\n\n");
        }

        let pangkat = n + 1;
        let penyebut = a * pangkat;

        return [
            "Soal: ∫ " + soal + " dx",
            "Langkah 1: Misalkan u = " + bentukLinear(a, b),
            "Langkah 2: du = " + a + " dx",
            "Langkah 3: Naikkan pangkat menjadi " + pangkat + ".",
            "Hasil: " + dalam + "^" + pangkat +
                " / " + penyebut + " + C"
        ].join("\n\n");
    }

    // 4. Integral polinomial, misalnya x^3+2x^2-4x+1
    if (/^[+\-]?(?:\d+(?:\.\d+)?(?:x(?:\^\d+)?)?|x(?:\^\d+)?)(?:[+\-](?:\d+(?:\.\d+)?(?:x(?:\^\d+)?)?|x(?:\^\d+)?))*$/i.test(soal)) {
        let suku = soal.match(/[+-]?[^+-]+/g);
        let hasilSuku = [];

        for (let item of suku) {
            let tanda = item.startsWith("-") ? -1 : 1;
            let isi = item.replace(/^[+-]/, "");
            let bagian = isi.match(/^(\d+(?:\.\d+)?)?(x)?(?:\^(\d+))?$/i);

            if (!bagian) return "Bentuk polinomial belum didukung.";

            let angka = bagian[1] ? Number(bagian[1]) : (bagian[2] ? 1 : 0);
            let adaX = Boolean(bagian[2]);
            let pangkat = adaX ? Number(bagian[3] || 1) : 0;
            let koef = tanda * angka;

            if (adaX && pangkat === 0) {
                return "Pangkat nol tidak valid untuk suku x.";
            }

            if (adaX && pangkat === -1) {
                hasilSuku.push("ln|x|");
            } else if (!adaX) {
                hasilSuku.push(formatAngka(koef) + "x");
            } else {
                let baru = pangkat + 1;
                let nilai = koef / baru;
                hasilSuku.push(
                    formatAngka(nilai) + "x" +
                    (baru === 1 ? "" : "^" + baru)
                );
            }
        }

        // Menyatukan suku dengan tanda yang tepat
        let jawaban = hasilSuku.join(" + ").replace(/\+ -/g, "- ");

        return [
            "Soal: ∫ " + soal + " dx",
            "Integralkan setiap suku secara terpisah.",
            "Hasil: " + jawaban + " + C"
        ].join("\n\n");
    }

    return "Maaf, bentuk integral ini belum didukung.\n\n" +
        "Coba bentuk seperti (2x+3)^5, x^3+2x^2-4x+1, e^(2x), sin(x), atau cos(x).";
}

function koefisien(teks) {
    if (teks === "" || teks === "+") return 1;
    if (teks === "-") return -1;
    return Number(teks);
}

function bentukLinear(a, b) {
    let x = a === 1 ? "x" : a === -1 ? "-x" : a + "x";

    if (b !== "") {
        x += b.startsWith("-") ? b : "+" + b;
    }

    return x;
}

function formatAngka(n) {
    return Number(n.toFixed(6)).toString();
}

tombol.addEventListener("click", function () {
    hasil.textContent = integral(inputSoal.value);
});