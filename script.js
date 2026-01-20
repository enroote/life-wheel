// Zeige die aktuellen Werte der Slider an
// PALETTE: assign 10 pale rainbow colors to the first 10 sliders
const PALETTE = [
    '#fb8296', // slider-1 Pale Rose
    '#f8b479', // slider-2 Pale Peach
    '#ffea75', // slider-3 Pale Lemon
    '#b3fd77', // slider-4 Pale Mint
    '#77f8d4', // slider-5 Pale Aqua
    '#7ac5fb', // slider-6 Pale Sky
    '#8d7ffa', // slider-7 Pale Periwinkle
    '#ca84f9', // slider-8 Pale Lavender
    '#f984b1', // slider-9 Pale Blush
    '#f8ba78'  // slider-10 Pale Sand (environment)
];

// expose colors as CSS variables on :root and add classes to the first 10 .slider elements
const sliders = document.querySelectorAll('.slider');
// PDF-Download: erzeugt ein PDF aus dem Canvas und lädt es herunter
const downloadBtn = document.getElementById('download-pdf');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
        if (!lifeWheelChart) {
            alert('Bitte zuerst das Lebensrad generieren.');
            return;
        }

        const canvas = document.getElementById('lifeWheelChart');
        if (!canvas) return;

        // conv to image
        const imgData = canvas.toDataURL('image/png');

        // use jsPDF (UMD exposes window.jspdf)
        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) {
            alert('jsPDF ist nicht geladen. PDF-Export nicht möglich.');
            return;
        }

        // create PDF and fit the image preserving aspect ratio
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        let imgWidth = pdfWidth;
        let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = (imgProps.width * imgHeight) / imgProps.height;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save('lebensrad.pdf');
    });
}


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

// small plugin that paints a white background behind the chart (helps visibility and PDF export)
const whiteBackgroundPlugin = {
    id: 'white_background_plugin',
    beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

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

        // Erstelle das neue Chart with explicit colors and background plugin
        lifeWheelChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Lebensqualität',
                    'Karriere',
                    'Familie & Freunde',
                    'Gesundheit',
                    'Freundschaften',
                    'Liebe',
                    'Persönliches Wachstum',
                    'Spaß & Erholung',
                    'Finanzielle Situation',
                    'Wohnsituation'
                ],
                datasets: [{
                    label: 'Dein Lebensrad',
                    data: [lifeQuality, career, family, health, friendship, romance, personalGrowth, fun, finance, environment],
                    backgroundColor: 'rgba(0, 123, 255, 0.22)', // semi-transparent fill
                    borderColor: 'rgba(0, 123, 255, 1)',        // strong border
                    pointBackgroundColor: PALETTE, // use each slider's color for its point
                    pointBorderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#222' // legend color
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: '#dfe6f0' // light grid lines
                        },
                        angleLines: {
                            color: '#e6e6e6' // light radial lines (was angleLines.display previously)
                        },
                        pointLabels: {
                            color: '#222' // category labels color
                        },
                        ticks: {
                            color: '#444',
                            stepSize: 2,
                            backdropColor: 'rgba(255,255,255,0)' // no dark backdrop
                        },
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                }
            },
            plugins: [whiteBackgroundPlugin]
        });
    });
}
