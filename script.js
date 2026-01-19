// Zeige die aktuellen Werte der Slider an
// PALETTE: assign 10 pale rainbow colors to the first 10 sliders
const PALETTE = [
    '#FFC9D2', // slider-1 Pale Rose
    '#FFD8B5', // slider-2 Pale Peach
    '#FFF5BA', // slider-3 Pale Lemon
    '#E7FFD4', // slider-4 Pale Mint
    '#D0F4EA', // slider-5 Pale Aqua
    '#D6EEFF', // slider-6 Pale Sky
    '#D9D4FF', // slider-7 Pale Periwinkle
    '#F0D9FF', // slider-8 Pale Lavender
    '#FFEAF2', // slider-9 Pale Blush
    '#FFF3E6'  // slider-10 Pale Sand (environment)
];

// expose colors as CSS variables on :root and add classes to the first 10 .slider elements
const sliders = document.querySelectorAll('.slider');

PALETTE.forEach((color, i) => {
    // set a root-level CSS variable --slider-1 .. --slider-10
    document.documentElement.style.setProperty(`--slider-${i + 1}`, color);

    // if a corresponding slider exists, add a class and set inline accent color for immediate effect
    if (sliders[i]) {
        sliders[i].classList.add(`slider-${i + 1}`);
        // prefer the accent-color API if supported
        try {
            sliders[i].style.accentColor = color;
        } catch (e) {
            // ignore if not supported
        }
    }
});

sliders.forEach(slider => {
    const valueSpan = document.getElementById(slider.id + 'Value');
    if (valueSpan) {
        valueSpan.textContent = slider.value;
    }

    slider.addEventListener('input', function() {
        const vs = document.getElementById(this.id + 'Value');
        if (vs) vs.textContent = this.value;
    });
});

// Variable für das Chart, damit es später zerstört werden kann
let lifeWheelChart = null;

// Generiere das Lebensrad beim Absenden des Formulars
const form = document.getElementById('lifeWheelForm');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Hole die Werte der Slider
        const lifeQuality = parseInt(document.getElementById('lifeQuality').value);
        const career = parseInt(document.getElementById('career').value);
        const family = parseInt(document.getElementById('family').value);
        const health = parseInt(document.getElementById('health').value);
        const friendship = parseInt(document.getElementById('friendship').value);
        const romance = parseInt(document.getElementById('romance').value);
        const personalGrowth = parseInt(document.getElementById('personalGrowth').value);
        const fun = parseInt(document.getElementById('fun').value);
        const finance = parseInt(document.getElementById('finance').value);
        const environment = parseInt(document.getElementById('environment').value);

        // Erstelle oder aktualisiere das Radar-Diagramm
        const ctx = document.getElementById('lifeWheelChart').getContext('2d');

        // Falls bereits ein Chart existiert, zerstöre es
        if (lifeWheelChart) {
            lifeWheelChart.destroy();
        }

        // Erstelle das neue Chart
        lifeWheelChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Lebensqualität',
                    'Karriere',
                    'Familie/Freunde',
                    'Gesundheit',
                    'Freundschaften',
                    'Liebesleben',
                    'Persönliches Wachstum',
                    'Spaß & Erholung',
                    'Finanzielle Situation',
                    'Wohnsituation'
                ],
                datasets: [{
                    label: 'Dein Lebensrad',
                    data: [lifeQuality, career, family, health, friendship, romance, personalGrowth, fun, finance, environment],
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                }
            }
        });
    });
}

// Funktion zum Exportieren des Charts als PDF
const downloadBtn = document.getElementById('download-pdf');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
        const canvas = document.getElementById('lifeWheelChart');
        if (!canvas) {
            alert('Kein Chart gefunden — bitte erst das Lebensrad generieren.');
            return;
        }

        // Prefer Chart.js built-in exporter when available
        let imgData = null;
        try {
            if (lifeWheelChart && typeof lifeWheelChart.toBase64Image === 'function') {
                imgData = lifeWheelChart.toBase64Image(); // returns PNG dataURL
            } else {
                // fallback to canvas.toDataURL (PNG recommended)
                imgData = canvas.toDataURL('image/png');
            }
        } catch (err) {
            console.error('Fehler beim Erzeugen des Bildes aus dem Canvas:', err);
            alert('Fehler beim Erzeugen des Bildes. Öffne die Konsole für Details.');
            return;
        }

        // ensure jsPDF is available (UMD build exposes window.jspdf.jsPDF)
        let PDFClass = null;
        if (window.jspdf && window.jspdf.jsPDF) {
            PDFClass = window.jspdf.jsPDF;
        } else if (typeof jsPDF !== 'undefined') {
            PDFClass = jsPDF;
        } else {
            alert('jsPDF library ist nicht geladen. Bitte die jsPDF-Script-Tag in index.html prüfen.');
            return;
        }

        try {
            // create PDF and fit image into the page while keeping aspect ratio
            const pdf = new PDFClass();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const availableWidth = pageWidth - margin * 2;
            const availableHeight = pageHeight - margin * 2 - 20; // leave room for title

            // get image natural dimensions from the canvas
            const img = new Image();
            img.onload = function() {
                let imgWidth = availableWidth;
                let imgHeight = (img.height / img.width) * imgWidth;

                // if image is too tall, scale by height instead
                if (imgHeight > availableHeight) {
                    imgHeight = availableHeight;
                    imgWidth = (img.width / img.height) * imgHeight;
                }

                pdf.setFontSize(20);
                pdf.text("Dein Lebensrad", margin, 15);
                const x = (pageWidth - imgWidth) / 2; // center horizontally
                const y = 20;
                // addImage accepts a dataURL; use PNG to preserve transparency if any
                pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                pdf.save('Lebensrad.pdf');
            };
            img.onerror = function(e) {
                console.error('Fehler beim Laden des erzeugten Bildes:', e);
                alert('Fehler beim Verarbeiten des Bildes. Öffne die Konsole für Details.');
            };
            img.src = imgData;
        } catch (err) {
            console.error('Fehler beim Erstellen des PDF:', err);
            alert('Fehler beim Erstellen des PDF. Öffne die Konsole für Details.');
        }
    });
} else {
    console.warn('Download button #download-pdf not found.');
}
