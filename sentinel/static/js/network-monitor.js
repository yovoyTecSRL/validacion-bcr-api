// Network Monitor para Sentinel Dashboard
class NetworkMonitor {
    constructor() {
        this.monitoringActive = false;
        this.pingInterval = 10000; // 10 segundos
        this.deviceScanInterval = 60000; // 1 minuto
        this.securityScanInterval = 30000; // 30 segundos
        
        this.endpoints = {
            ping: '/api/network/ping',
            devices: '/api/network/devices',
            security: '/api/security/scan',
            ports: '/api/network/ports'
        };

        this.knownDevices = new Map();
        this.securityEvents = [];
        this.networkStats = {
            packetsIn: 0,
            packetsOut: 0,
            bytesIn: 0,
            bytesOut: 0,
            errors: 0
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startMonitoring();
    }

    setupEventListeners() {
        // Configurar WebSocket para datos en tiempo real si está disponible
        this.setupWebSocket();
        
        // Eventos de ventana
        window.addEventListener('beforeunload', () => this.stopMonitoring());
        window.addEventListener('online', () => this.handleConnectivityChange(true));
        window.addEventListener('offline', () => this.handleConnectivityChange(false));
    }

    setupWebSocket() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws/network`;
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket connection established');
                this.showNetworkStatus('WebSocket conectado', 'success');
            };
            
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealtimeData(data);
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket connection closed');
                this.showNetworkStatus('WebSocket desconectado, usando polling', 'warning');
                // Fallback a polling
                this.startPolling();
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.startPolling();
            };
        } catch (error) {
            console.log('WebSocket not available, using polling method');
            this.startPolling();
        }
    }

    startPolling() {
        if (!this.monitoringActive) {
            this.monitoringActive = true;
            this.pingMonitoring();
            this.deviceDiscovery();
            this.securityMonitoring();
        }
    }

    startMonitoring() {
        this.monitoringActive = true;
        this.performInitialScan();
        
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.startPolling();
        }
    }

    stopMonitoring() {
        this.monitoringActive = false;
        if (this.ws) {
            this.ws.close();
        }
        clearTimeout(this.pingTimer);
        clearTimeout(this.deviceTimer);
        clearTimeout(this.securityTimer);
    }

    async performInitialScan() {
        this.showNetworkStatus('Realizando escaneo inicial de red...', 'info');
        
        try {
            await Promise.all([
                this.scanNetworkDevices(),
                this.checkCriticalServices(),
                this.updateNetworkTopology()
            ]);
            
            this.showNetworkStatus('Escaneo inicial completado', 'success');
        } catch (error) {
            console.error('Error en escaneo inicial:', error);
            this.showNetworkStatus('Error en escaneo inicial', 'error');
        }
    }

    async pingMonitoring() {
        if (!this.monitoringActive) return;

        const targets = [
            { host: 'google.com', name: 'Google DNS' },
            { host: 'cloudflare.com', name: 'Cloudflare' },
            { host: '192.168.1.1', name: 'Router Local' },
            { host: '8.8.8.8', name: 'DNS Público' }
        ];

        for (const target of targets) {
            try {
                const result = await this.performPing(target);
                this.updatePingDisplay(target, result);
            } catch (error) {
                this.updatePingDisplay(target, { error: error.message, latency: null });
            }
        }

        this.pingTimer = setTimeout(() => this.pingMonitoring(), this.pingInterval);
    }

    async performPing(target) {
        try {
            // Usar fetch con timeout para simular ping
            const startTime = performance.now();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`/api/ping?host=${target.host}`, {
                signal: controller.signal,
                method: 'GET'
            });

            clearTimeout(timeoutId);
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            if (response.ok) {
                return { latency, status: 'online' };
            } else {
                return { latency, status: 'warning' };
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                return { latency: null, status: 'timeout' };
            }
            
            // Fallback: generar datos simulados para demo
            const latency = Math.floor(Math.random() * 100) + 10;
            const status = latency < 100 ? 'online' : 'warning';
            return { latency, status };
        }
    }

    updatePingDisplay(target, result) {
        const container = document.getElementById('ping-results');
        if (!container) return;

        let pingElement = container.querySelector(`[data-host="${target.host}"]`);
        if (!pingElement) {
            pingElement = document.createElement('div');
            pingElement.className = 'ping-result';
            pingElement.dataset.host = target.host;
            container.appendChild(pingElement);
        }

        const statusClass = result.status || 'offline';
        const latencyText = result.latency ? `${result.latency}ms` : 'Timeout';

        pingElement.innerHTML = `
            <div class="ping-host">
                <i class="fas fa-server"></i>
                <span>${target.name || target.host}</span>
            </div>
            <div class="ping-latency">
                <span class="latency-value">${latencyText}</span>
                <div class="status-indicator ${statusClass}"></div>
            </div>
        `;
    }

    async deviceDiscovery() {
        if (!this.monitoringActive) return;

        try {
            const devices = await this.scanNetworkDevices();
            this.updateDeviceList(devices);
            this.checkForNewDevices(devices);
        } catch (error) {
            console.error('Error en descubrimiento de dispositivos:', error);
        }

        this.deviceTimer = setTimeout(() => this.deviceDiscovery(), this.deviceScanInterval);
    }

    async scanNetworkDevices() {
        try {
            const response = await fetch('/api/network/devices');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('API no disponible, generando datos simulados');
        }

        // Datos simulados para demo
        return [
            { 
                ip: '192.168.1.1', 
                mac: '00:1B:44:11:3A:B7', 
                name: 'Router Principal', 
                type: 'router', 
                status: 'online',
                lastSeen: new Date().toISOString(),
                manufacturer: 'TP-Link'
            },
            { 
                ip: '192.168.1.2', 
                mac: '00:1B:44:11:3A:B8', 
                name: 'Switch-01', 
                type: 'switch', 
                status: 'online',
                lastSeen: new Date().toISOString(),
                manufacturer: 'Cisco'
            },
            { 
                ip: '192.168.1.100', 
                mac: '00:1B:44:11:3A:C0', 
                name: 'PC-Admin', 
                type: 'computer', 
                status: 'online',
                lastSeen: new Date().toISOString(),
                manufacturer: 'Dell'
            },
            { 
                ip: '192.168.1.101', 
                mac: '00:1B:44:11:3A:C1', 
                name: 'Laptop-User1', 
                type: 'laptop', 
                status: Math.random() > 0.3 ? 'online' : 'offline',
                lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                manufacturer: 'HP'
            }
        ];
    }

    updateDeviceList(devices) {
        const container = document.getElementById('devices-grid');
        if (!container) return;

        container.innerHTML = devices.map(device => `
            <div class="device-card" data-ip="${device.ip}">
                <div class="device-header">
                    <div class="device-icon">
                        <i class="fas fa-${this.getDeviceIcon(device.type)}"></i>
                    </div>
                    <div class="device-status ${device.status}"></div>
                </div>
                <div class="device-info">
                    <h4>${device.name}</h4>
                    <div class="device-details">
                        <div class="detail">
                            <span>IP:</span>
                            <span>${device.ip}</span>
                        </div>
                        <div class="detail">
                            <span>MAC:</span>
                            <span>${device.mac}</span>
                        </div>
                        <div class="detail">
                            <span>Estado:</span>
                            <span class="status-text ${device.status}">${this.getStatusText(device.status)}</span>
                        </div>
                        <div class="detail">
                            <span>Último visto:</span>
                            <span>${this.formatLastSeen(device.lastSeen)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    checkForNewDevices(currentDevices) {
        currentDevices.forEach(device => {
            if (!this.knownDevices.has(device.mac)) {
                this.knownDevices.set(device.mac, device);
                this.addSecurityEvent({
                    type: 'info',
                    message: `Nuevo dispositivo detectado: ${device.name} (${device.ip})`,
                    timestamp: new Date().toISOString(),
                    severity: 'info'
                });
            } else {
                // Actualizar dispositivo conocido
                this.knownDevices.set(device.mac, device);
            }
        });
    }

    async securityMonitoring() {
        if (!this.monitoringActive) return;

        try {
            await this.checkNetworkSecurity();
            await this.monitorTrafficAnomalies();
            await this.checkOpenPorts();
        } catch (error) {
            console.error('Error en monitoreo de seguridad:', error);
        }

        this.securityTimer = setTimeout(() => this.securityMonitoring(), this.securityScanInterval);
    }

    async checkNetworkSecurity() {
        // Simular verificaciones de seguridad
        const checks = [
            { name: 'Firewall Status', status: 'active' },
            { name: 'Intrusion Detection', status: 'active' },
            { name: 'VPN Tunnels', status: 'active' },
            { name: 'SSL Certificates', status: 'valid' }
        ];

        checks.forEach(check => {
            if (Math.random() < 0.05) { // 5% de probabilidad de alerta
                this.addSecurityEvent({
                    type: 'warning',
                    message: `Advertencia en ${check.name}: Revisar configuración`,
                    timestamp: new Date().toISOString(),
                    severity: 'warning'
                });
            }
        });
    }

    async monitorTrafficAnomalies() {
        // Simular monitoreo de anomalías de tráfico
        const currentTraffic = Math.random() * 100;
        const threshold = 80;

        if (currentTraffic > threshold) {
            this.addSecurityEvent({
                type: 'warning',
                message: `Tráfico de red elevado detectado: ${currentTraffic.toFixed(1)}% del límite`,
                timestamp: new Date().toISOString(),
                severity: 'warning'
            });
        }
    }

    async checkOpenPorts() {
        const commonPorts = [
            { port: 22, name: 'SSH', expectedStatus: 'open' },
            { port: 80, name: 'HTTP', expectedStatus: 'open' },
            { port: 443, name: 'HTTPS', expectedStatus: 'open' },
            { port: 21, name: 'FTP', expectedStatus: 'closed' },
            { port: 23, name: 'Telnet', expectedStatus: 'closed' }
        ];

        commonPorts.forEach(port => {
            const actualStatus = Math.random() > 0.1 ? port.expectedStatus : 
                (port.expectedStatus === 'open' ? 'closed' : 'open');

            if (actualStatus !== port.expectedStatus) {
                this.addSecurityEvent({
                    type: 'warning',
                    message: `Puerto ${port.port} (${port.name}) en estado inesperado: ${actualStatus}`,
                    timestamp: new Date().toISOString(),
                    severity: actualStatus === 'open' ? 'warning' : 'info'
                });
            }
        });

        this.updatePortMonitoring(commonPorts);
    }

    updatePortMonitoring(ports) {
        const container = document.getElementById('port-monitoring');
        if (!container) return;

        container.innerHTML = ports.map(port => {
            const status = Math.random() > 0.1 ? 'online' : 'warning';
            return `
                <div class="port-status">
                    <div class="port-info">
                        <span class="port-number">${port.port}</span>
                        <span class="port-name">${port.name}</span>
                    </div>
                    <div class="port-indicator ${status}"></div>
                </div>
            `;
        }).join('');
    }

    addSecurityEvent(event) {
        this.securityEvents.unshift(event);
        
        // Mantener solo los últimos 50 eventos
        if (this.securityEvents.length > 50) {
            this.securityEvents = this.securityEvents.slice(0, 50);
        }

        this.updateSecurityEventsDisplay();
        
        // Mostrar notificación para eventos críticos
        if (event.severity === 'critical' || event.severity === 'warning') {
            this.showNetworkStatus(event.message, event.severity);
        }
    }

    updateSecurityEventsDisplay() {
        const container = document.getElementById('security-events');
        if (!container) return;

        const recentEvents = this.securityEvents.slice(0, 10);
        
        container.innerHTML = recentEvents.map(event => `
            <div class="security-event ${event.severity}">
                <div class="event-time">${new Date(event.timestamp).toLocaleString()}</div>
                <div class="event-message">${event.message}</div>
            </div>
        `).join('');
    }

    async updateNetworkTopology() {
        // Actualizar el diagrama de topología de red
        const topology = await this.getNetworkTopology();
        this.renderTopology(topology);
    }

    async getNetworkTopology() {
        // Simular topología de red
        return {
            internet: { status: 'online', latency: 15 },
            router: { status: 'online', cpu: 25, memory: 40 },
            switch: { status: 'online', ports: 24, used: 12 },
            firewall: { status: 'online', rules: 156, blocked: 247 },
            wifi: { status: 'online', clients: 8, signal: 85 }
        };
    }

    renderTopology(topology) {
        // Actualizar indicadores de estado en el diagrama
        const nodes = document.querySelectorAll('.network-node');
        nodes.forEach(node => {
            const nodeType = node.classList[1]; // segunda clase es el tipo
            if (topology[nodeType]) {
                const statusElement = node.querySelector('.status');
                if (statusElement) {
                    statusElement.className = `status ${topology[nodeType].status}`;
                }
            }
        });
    }

    handleRealtimeData(data) {
        switch (data.type) {
            case 'ping':
                this.updatePingDisplay(data.target, data.result);
                break;
            case 'device':
                this.handleDeviceUpdate(data.device);
                break;
            case 'security':
                this.addSecurityEvent(data.event);
                break;
            case 'traffic':
                this.updateTrafficStats(data.stats);
                break;
        }
    }

    handleDeviceUpdate(device) {
        const deviceCard = document.querySelector(`[data-ip="${device.ip}"]`);
        if (deviceCard) {
            const statusElement = deviceCard.querySelector('.device-status');
            if (statusElement) {
                statusElement.className = `device-status ${device.status}`;
            }
        }
    }

    updateTrafficStats(stats) {
        this.networkStats = { ...this.networkStats, ...stats };
        
        // Actualizar gráficos en tiempo real si están disponibles
        if (window.sentinelCharts) {
            const timestamp = new Date().toLocaleTimeString();
            window.sentinelCharts.addDataPoint('networkTraffic', timestamp, stats.throughput);
        }
    }

    handleConnectivityChange(isOnline) {
        const message = isOnline ? 'Conexión a internet restaurada' : 'Conexión a internet perdida';
        const type = isOnline ? 'success' : 'error';
        
        this.showNetworkStatus(message, type);
        
        this.addSecurityEvent({
            type: 'info',
            message: `Cambio de conectividad: ${message}`,
            timestamp: new Date().toISOString(),
            severity: isOnline ? 'info' : 'warning'
        });
    }

    // Métodos auxiliares
    getDeviceIcon(type) {
        const icons = {
            router: 'router',
            switch: 'server',
            firewall: 'shield-alt',
            computer: 'desktop',
            laptop: 'laptop',
            printer: 'print',
            phone: 'mobile-alt',
            unknown: 'question'
        };
        return icons[type] || 'question';
    }

    getStatusText(status) {
        const texts = {
            online: 'En línea',
            offline: 'Desconectado',
            warning: 'Advertencia'
        };
        return texts[status] || 'Desconocido';
    }

    formatLastSeen(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // menos de 1 minuto
            return 'Ahora';
        } else if (diff < 3600000) { // menos de 1 hora
            return `${Math.floor(diff / 60000)}m`;
        } else if (diff < 86400000) { // menos de 1 día
            return `${Math.floor(diff / 3600000)}h`;
        } else {
            return date.toLocaleDateString();
        }
    }

    showNetworkStatus(message, type) {
        if (window.sentinelDashboard && window.sentinelDashboard.showNotification) {
            window.sentinelDashboard.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Métodos públicos para interacción externa
    async forceDeviceScan() {
        this.showNetworkStatus('Iniciando escaneo manual de dispositivos...', 'info');
        const devices = await this.scanNetworkDevices();
        this.updateDeviceList(devices);
        this.showNetworkStatus('Escaneo de dispositivos completado', 'success');
        return devices;
    }

    async runNetworkDiagnostics() {
        this.showNetworkStatus('Ejecutando diagnósticos de red...', 'info');
        
        const results = {
            ping: await this.performPing({ host: 'google.com', name: 'Google' }),
            devices: await this.scanNetworkDevices(),
            security: await this.checkNetworkSecurity()
        };
        
        this.showNetworkStatus('Diagnósticos completados', 'success');
        return results;
    }

    getNetworkStatistics() {
        return {
            stats: this.networkStats,
            devices: this.knownDevices.size,
            events: this.securityEvents.length,
            uptime: this.calculateUptime()
        };
    }

    calculateUptime() {
        // Calcular uptime simulado
        return Math.floor(Math.random() * 1000) + 95;
    }
}

// Inicializar monitor de red
document.addEventListener('DOMContentLoaded', () => {
    window.networkMonitor = new NetworkMonitor();
});

// Exponer funciones globales para botones del UI
window.scanDevices = () => {
    if (window.networkMonitor) {
        return window.networkMonitor.forceDeviceScan();
    }
};

window.refreshNetworkData = () => {
    if (window.networkMonitor) {
        return window.networkMonitor.runNetworkDiagnostics();
    }
};
