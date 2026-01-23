/* NEXUS-7 PRESENTATION - CHART.JS CONFIGURATIONS */

let interestChart = null;
let efficacyChart = null;

const chartColors = {
    pre: 'rgba(139, 92, 246, 0.7)',
    preBorder: 'rgba(139, 92, 246, 1)',
    post: 'rgba(16, 185, 129, 0.7)',
    postBorder: 'rgba(16, 185, 129, 1)',
    grid: 'rgba(255, 255, 255, 0.1)',
    text: 'rgba(255, 255, 255, 0.7)'
};

Chart.defaults.color = chartColors.text;
Chart.defaults.font.family = "'Inter', sans-serif";

function initCharts() {
    // Destroy existing charts
    if (interestChart) { interestChart.destroy(); interestChart = null; }
    if (efficacyChart) { efficacyChart.destroy(); efficacyChart = null; }

    const interestCtx = document.getElementById('interestChart');
    const efficacyCtx = document.getElementById('efficacyChart');
    if (!interestCtx || !efficacyCtx) return;

    // Interest Chart
    interestChart = new Chart(interestCtx, {
        type: 'bar',
        data: {
            labels: ['Elektronik', 'Interaktive Proj.', 'Arduino lernen', 'Freizeit-Proj.', 'Technik für mich'],
            datasets: [
                { label: 'Pre', data: [3.1, 3.3, 3.0, 2.8, 3.2], backgroundColor: chartColors.pre, borderColor: chartColors.preBorder, borderWidth: 2, borderRadius: 6 },
                { label: 'Post', data: [3.5, 3.7, 3.4, 3.1, 3.5], backgroundColor: chartColors.post, borderColor: chartColors.postBorder, borderWidth: 2, borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1500, easing: 'easeOutQuart' },
            plugins: { legend: { position: 'top', labels: { padding: 15, usePointStyle: true, pointStyle: 'circle' } } },
            scales: {
                y: { beginAtZero: true, max: 5, grid: { color: chartColors.grid }, ticks: { stepSize: 1 } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });

    // Efficacy Chart
    efficacyChart = new Chart(efficacyCtx, {
        type: 'bar',
        data: {
            labels: ['Zutrauen Programm', 'Überzeugung lernen', 'Nicht überfordert'],
            datasets: [
                { label: 'Pre', data: [2.9, 3.2, 3.0], backgroundColor: chartColors.pre, borderColor: chartColors.preBorder, borderWidth: 2, borderRadius: 6 },
                { label: 'Post', data: [3.3, 3.5, 3.2], backgroundColor: chartColors.post, borderColor: chartColors.postBorder, borderWidth: 2, borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            animation: { duration: 1500, easing: 'easeOutQuart', delay: 300 },
            plugins: { legend: { position: 'top', labels: { padding: 15, usePointStyle: true, pointStyle: 'circle' } } },
            scales: {
                x: { beginAtZero: true, max: 5, grid: { color: chartColors.grid }, ticks: { stepSize: 1 } },
                y: { grid: { display: false } }
            }
        }
    });
}
