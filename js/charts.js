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

// Item-Level Statistics calculated from NEXUS7_Escape_Room_Datensatz.xlsx
// 
// INTEREST SCALE (Pre α=0.80, Post α=0.76)
// Item                    Cohen's d   Pre r    Post r   α if deleted (Pre/Post)
// Elektronik              d=0.14      r=0.76   r=0.72   α=0.70/0.63
// Interaktiv              d=0.11      r=0.51   r=0.49   α=0.79/0.72
// Arduino lernen          d=0.06      r=0.42   r=0.38   α=0.81/0.76
// Freizeit                d=0.10      r=0.71   r=0.53   α=0.72/0.71
// Technik fuer mich       d=0.14      r=0.52   r=0.50   α=0.78/0.72
//
// EFFICACY SCALE (2 items: Pre α=0.53, Post α=0.59)
// Item                    Cohen's d   Pre r    Post r
// Zutrauen                d=0.21      r=0.37   r=0.45
// Lernen koennte          d=0.51      r=0.37   r=0.45

Chart.defaults.color = chartColors.text;
Chart.defaults.font.family = "'Inter', sans-serif";

function initCharts() {
    // Destroy existing charts
    if (interestChart) { interestChart.destroy(); interestChart = null; }
    if (efficacyChart) { efficacyChart.destroy(); efficacyChart = null; }

    const interestCtx = document.getElementById('interestChart');
    const efficacyCtx = document.getElementById('efficacyChart');
    if (!interestCtx || !efficacyCtx) return;

    // Interest Chart - Labels now include both d (effect size) and r (item-total correlation)
    interestChart = new Chart(interestCtx, {
        type: 'bar',
        data: {
            labels: ['Elektronik\nd=0.14 | r=.76', 'Interaktiv\nd=0.11 | r=.51', 'Arduino\nd=0.06 | r=.42', 'Freizeit\nd=0.10 | r=.71', 'Technik\nd=0.14 | r=.52'],
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
                            const rValuesPre = [0.76, 0.51, 0.42, 0.71, 0.52];
                            const rValuesPost = [0.72, 0.49, 0.38, 0.53, 0.50];
                            const i = context[0].dataIndex;
                            return [
                                "Cohen's d: " + dValues[i].toFixed(2) + " (klein)",
                                "Item-Total r: Pre=" + rValuesPre[i].toFixed(2) + ", Post=" + rValuesPost[i].toFixed(2)
                            ];
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, max: 5, grid: { color: chartColors.grid }, ticks: { stepSize: 1 } },
                x: { grid: { display: false }, ticks: { font: { size: 8 } } }
            }
        }
    });

    // Efficacy Chart - 2-item scale: Zutrauen + Lernen
    efficacyChart = new Chart(efficacyCtx, {
        type: 'bar',
        data: {
            labels: ['Zutrauen (d=0.21 | r=.37)', 'Lernen (d=0.51 | r=.45)'],
            datasets: [
                { label: 'Pre', data: [2.69, 4.00], backgroundColor: chartColors.pre, borderColor: chartColors.preBorder, borderWidth: 2, borderRadius: 6 },
                { label: 'Post', data: [2.94, 4.44], backgroundColor: chartColors.post, borderColor: chartColors.postBorder, borderWidth: 2, borderRadius: 6 }
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
                            const dValues = [0.21, 0.51];
                            const labels = ['klein', 'mittel'];
                            const rValues = [0.37, 0.45];
                            const i = context[0].dataIndex;
                            return [
                                "Cohen's d: " + dValues[i].toFixed(2) + " (" + labels[i] + ")",
                                "Item-Korrelation r = " + rValues[i].toFixed(2)
                            ];
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
