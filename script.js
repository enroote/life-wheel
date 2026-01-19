document.getElementById('lifeWheelForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get user input
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

    // Create radar chart
    const ctx = document.getElementById('lifeWheelChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Life Quality',
                'Career',
                'Family',
                'Health',
                'Friendship',
                'Romance',
                'Personal Growth',
                'Fun & Recreation',
                'Financial Situation',
                'Living Environment'
            ],
            datasets: [{
                label: 'Your Life Wheel',
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
