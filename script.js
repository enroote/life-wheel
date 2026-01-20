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
                    pointBackgroundColor: 'rgba(0, 123, 255, 1)',
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
