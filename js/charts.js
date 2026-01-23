/* NEXUS-7 PRESENTATION - CHART.JS CONFIGURATIONS */
/* Data calculated from NEXUS7_Escape_Room_Datensatz.xlsx (N=16) */

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

// Cohen's d values calculated from raw data (pooled SD)
// Interest items:
//   Elektronik: d=0.14 (small), Interaktiv: d=0.11 (small), Arduino: d=0.06 (negligible)
//   Freizeit: d=0.10 (small), Technik: d=0.14 (small)
// Efficacy items:
//   Zutrauen: d=0.21 (small), Lernen: d=0.51 (medium), Überfordert: d=-0.26 (small, inverted)

Chart.defaults.color = chartColors.text;
Chart.defaults.font.family = "'Inter', sans-serif";

function initCharts() {
    // Destroy existing charts
    if (interestChart) { interestChart.destroy(); interestChart = null; }
    if (efficacyChart) { efficacyChart.destroy(); efficacyChart = null; }

    const interestCtx = document.getElementById('interestChart');
    const efficacyCtx = document.getElementById('efficacyChart');
    if (!interestCtx || !efficacyCtx) return;

    // Interest Chart - Real data from xlsx
    // Labels include Cohen's d values
    interestChart = new Chart(interestCtx, {
        type: 'bar',
        data: {
            labels: ['Elektronik\nd=0.14', 'Interaktiv\nd=0.11', 'Arduino\nd=0.06', 'Freizeit\nd=0.10', 'Technik\nd=0.14'],
            datasets: [
                { label: 'Pre', data: [2.88, 3.00, 3.13, 2.81, 3.13], backgroundColor: chartColors.pre, borderColor: chartColors.preBorder, borderWidth: 2, borderRadius: 6 },
                { label: 'Post', data: [3.06, 3.13, 3.19, 2.94, 3.31], backgroundColor: chartColors.post, borderColor: chartColors.postBorder, borderWidth: 2, borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1500, easing: 'easeOutQuart' },
            plugins: {
                legend: { position: 'top', labels: { padding: 15, usePointStyle: true, pointStyle: 'circle' } },
                tooltip: {
                    callbacks: {
                        afterBody: function (context) {
                            const dValues = [0.14, 0.11, 0.06, 0.10, 0.14];
                            return "Cohen's d: " + dValues[context[0].dataIndex].toFixed(2) + " (klein)";
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, max: 5, grid: { color: chartColors.grid }, ticks: { stepSize: 1 } },
                x: { grid: { display: false }, ticks: { font: { size: 9 } } }
            }
        }
    });

    // Efficacy Chart - Real data from xlsx
    // Note: "Nicht überfordert" is inverted (6 - raw value) so higher = better
    efficacyChart = new Chart(efficacyCtx, {
        type: 'bar',
        data: {
            labels: ['Zutrauen (d=0.21)', 'Lernen (d=0.51)', 'Nicht überfordert (d=0.26)'],
            datasets: [
                { label: 'Pre', data: [2.69, 4.00, 3.12], backgroundColor: chartColors.pre, borderColor: chartColors.preBorder, borderWidth: 2, borderRadius: 6 },
                { label: 'Post', data: [2.94, 4.44, 3.37], backgroundColor: chartColors.post, borderColor: chartColors.postBorder, borderWidth: 2, borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            animation: { duration: 1500, easing: 'easeOutQuart', delay: 300 },
            plugins: {
                legend: { position: 'top', labels: { padding: 15, usePointStyle: true, pointStyle: 'circle' } },
                tooltip: {
                    callbacks: {
                        afterBody: function (context) {
                            const dValues = [0.21, 0.51, 0.26];
                            const labels = ['klein', 'mittel', 'klein'];
                            return "Cohen's d: " + dValues[context[0].dataIndex].toFixed(2) + " (" + labels[context[0].dataIndex] + ")";
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, max: 5, grid: { color: chartColors.grid }, ticks: { stepSize: 1 } },
                y: { grid: { display: false } }
            }
        }
    });
}
