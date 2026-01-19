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
    '#FFF3E6'  // slider-10 Pale Sand (new)
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
    valueSpan.textContent = slider.value;

    slider.addEventListener('input', function() {
        valueSpan.textContent = this.value;
    });
});

// Variable für das Chart, damit es später zerstört werden kann
let lifeWheelChart = null;

// Generiere das Lebensrad beim Absenden des Formulars
document.getElementById('lifeWheelForm').addEventListener('submit', function(event) {
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
                borderColor: 'rgba(0, 123, 255, 255)',
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

// Funktion zum Exportieren des Charts als PDF
document.getElementById('download-pdf').addEventListener('click', function() {
    const canvas = document.getElementById('lifeWheelChart');
    const canvasImage = canvas.toDataURL('image/jpeg', 1.0);
    
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text("Dein Lebensrad", 10, 10);
    pdf.addImage(canvasImage, 'JPEG', 10, 20, 180, 160); // Position und Größe im PDF anpassen
    pdf.save('Lebensrad.pdf');
});
