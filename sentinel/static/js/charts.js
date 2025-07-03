// Charts JavaScript para Sentinel Dashboard
class SentinelCharts {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#00e676',
            secondary: '#283593',
            warning: '#ffc107',
            danger: '#f44336',
            info: '#2196f3',
            success: '#00c853'
        };
        this.init();
    }

    init() {
        // Configuración global de Chart.js
        Chart.defaults.color = '#ffffff';
        Chart.defaults.borderColor = '#444';
        Chart.defaults.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        
        this.initializeCharts();
    }

    initializeCharts() {
        this.createNetworkTrafficChart();
        this.createBandwidthChart();
        this.createUptimeChart();
        this.createTrafficAnalysisChart();
    }

    createNetworkTrafficChart() {
        const ctx = document.getElementById('networkTrafficChart');
        if (!ctx) return;

        // Generar datos de las últimas 24 horas
        const labels = [];
        const downloadData = [];
        const uploadData = [];
        
        for (let i = 23; i >= 0; i--) {
            const time = new Date();
            time.setHours(time.getHours() - i);
            labels.push(time.getHours() + ':00');
            
            // Simular datos de tráfico con patrones realistas
            const baseDownload = 20 + Math.sin((time.getHours() - 9) * Math.PI / 12) * 15;
            const baseUpload = 8 + Math.sin((time.getHours() - 9) * Math.PI / 12) * 5;
            
            downloadData.push(Math.max(0, baseDownload + (Math.random() - 0.5) * 10));
            uploadData.push(Math.max(0, baseUpload + (Math.random() - 0.5) * 4));
        }

        this.charts.networkTraffic = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Descarga (Mbps)',
                        data: downloadData,
                        borderColor: this.chartColors.primary,
                        backgroundColor: this.chartColors.primary + '20',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Subida (Mbps)',
                        data: uploadData,
                        borderColor: this.chartColors.info,
                        backgroundColor: this.chartColors.info + '20',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#444'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + ' Mbps';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: '#444'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutCubic'
                }
            }
        });
    }

    createBandwidthChart() {
        const ctx = document.getElementById('bandwidthChart');
        if (!ctx) return;

        const currentUsage = Math.floor(Math.random() * 40) + 30;
        const available = 100 - currentUsage;

        this.charts.bandwidth = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Usado', 'Disponible'],
                datasets: [{
                    data: [currentUsage, available],
                    backgroundColor: [
                        this.chartColors.primary,
                        '#333333'
                    ],
                    borderColor: [
                        this.chartColors.primary,
                        '#555555'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });

        // Actualizar el centro del gráfico con el porcentaje
        this.addCenterText(ctx, currentUsage + '%', 'Uso Actual');
    }

    createUptimeChart() {
        const ctx = document.getElementById('uptimeChart');
        if (!ctx) return;

        // Generar datos de uptime de los últimos 30 días
        const labels = [];
        const uptimeData = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }));
            
            // Simular uptime (generalmente alto con algunas caídas ocasionales)
            const uptime = Math.random() < 0.95 ? 
                Math.random() * 2 + 98 : // 95% del tiempo entre 98-100%
                Math.random() * 20 + 80; // 5% del tiempo entre 80-100%
            
            uptimeData.push(Math.min(100, uptime));
        }

        this.charts.uptime = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Uptime (%)',
                    data: uptimeData,
                    backgroundColor: uptimeData.map(value => 
                        value >= 99 ? this.chartColors.success :
                        value >= 95 ? this.chartColors.warning :
                        this.chartColors.danger
                    ),
                    borderColor: uptimeData.map(value => 
                        value >= 99 ? this.chartColors.success :
                        value >= 95 ? this.chartColors.warning :
                        this.chartColors.danger
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#444'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutCubic'
                }
            }
        });
    }

    createTrafficAnalysisChart() {
        const ctx = document.getElementById('trafficAnalysisChart');
        if (!ctx) return;

        // Datos de análisis de tráfico por protocolo
        const protocols = ['HTTP/HTTPS', 'FTP', 'SSH', 'DNS', 'Email', 'Otros'];
        const trafficData = [45, 8, 12, 15, 10, 10]; // Porcentajes

        this.charts.trafficAnalysis = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: protocols,
                datasets: [{
                    data: trafficData,
                    backgroundColor: [
                        this.chartColors.primary,
                        this.chartColors.secondary,
                        this.chartColors.info,
                        this.chartColors.warning,
                        this.chartColors.success,
                        '#9c27b0'
                    ],
                    borderColor: '#1a1a1a',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }

    addCenterText(canvas, text, subtext) {
        const chart = Chart.getChart(canvas);
        if (!chart) return;

        Chart.register({
            id: 'centerText',
            afterDraw: function(chart) {
                if (chart.config.type === 'doughnut') {
                    const ctx = chart.ctx;
                    const width = chart.width;
                    const height = chart.height;

                    ctx.restore();
                    const fontSize = (height / 114).toFixed(2);
                    ctx.font = `bold ${fontSize}em sans-serif`;
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ffffff';

                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height / 2 - 10;

                    ctx.fillText(text, textX, textY);

                    // Subtexto
                    ctx.font = `${fontSize * 0.6}em sans-serif`;
                    ctx.fillStyle = '#b0bec5';
                    const subtextX = Math.round((width - ctx.measureText(subtext).width) / 2);
                    const subtextY = height / 2 + 15;

                    ctx.fillText(subtext, subtextX, subtextY);
                    ctx.save();
                }
            }
        });
    }

    updateCharts() {
        // Actualizar datos de los gráficos
        if (this.charts.networkTraffic) {
            this.updateNetworkTrafficChart();
        }
        if (this.charts.bandwidth) {
            this.updateBandwidthChart();
        }
    }

    updateNetworkTrafficChart() {
        const chart = this.charts.networkTraffic;
        const now = new Date();
        
        // Agregar nuevo punto de datos
        const newLabel = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
        chart.data.labels.push(newLabel);
        
        // Simular nuevos datos
        const newDownload = 20 + Math.sin((now.getHours() - 9) * Math.PI / 12) * 15 + (Math.random() - 0.5) * 10;
        const newUpload = 8 + Math.sin((now.getHours() - 9) * Math.PI / 12) * 5 + (Math.random() - 0.5) * 4;
        
        chart.data.datasets[0].data.push(Math.max(0, newDownload));
        chart.data.datasets[1].data.push(Math.max(0, newUpload));
        
        // Mantener solo los últimos 24 puntos
        if (chart.data.labels.length > 24) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
        }
        
        chart.update('none');
    }

    updateBandwidthChart() {
        const chart = this.charts.bandwidth;
        const newUsage = Math.floor(Math.random() * 40) + 30;
        const available = 100 - newUsage;
        
        chart.data.datasets[0].data = [newUsage, available];
        chart.update();
    }

    createRealTimeChart(containerId, title, dataSource) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Crear canvas dinámicamente
        const canvas = document.createElement('canvas');
        canvas.id = containerId + 'Canvas';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: title,
                    data: [],
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.chartColors.primary + '20',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#444'
                        }
                    },
                    x: {
                        grid: {
                            color: '#444'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 0 // Sin animación para tiempo real
                }
            }
        });
    }

    addDataPoint(chartId, label, data) {
        const chart = this.charts[chartId];
        if (!chart) return;

        chart.data.labels.push(label);
        chart.data.datasets[0].data.push(data);

        // Mantener solo los últimos 20 puntos
        if (chart.data.labels.length > 20) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.update('none');
    }

    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }

    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    // Método para exportar datos de gráficos
    exportChartData(chartId) {
        const chart = this.charts[chartId];
        if (!chart) return null;

        return {
            labels: chart.data.labels,
            datasets: chart.data.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data
            }))
        };
    }

    // Método para generar gráfico de red en tiempo real
    startNetworkMonitoring() {
        setInterval(() => {
            this.updateCharts();
        }, 5000); // Actualizar cada 5 segundos
    }
}

// Inicializar gráficos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.sentinelCharts = new SentinelCharts();
    
    // Iniciar monitoreo en tiempo real
    setTimeout(() => {
        window.sentinelCharts.startNetworkMonitoring();
    }, 2000);
});

// Redimensionar gráficos cuando cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    if (window.sentinelCharts) {
        window.sentinelCharts.resizeCharts();
    }
});
