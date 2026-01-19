// Zeige die aktuellen Werte der Slider an
const sliders = document.querySelectorAll('.slider');
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
