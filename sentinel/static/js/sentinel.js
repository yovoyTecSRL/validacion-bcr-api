// Sentinel Dashboard JavaScript
class SentinelDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.refreshInterval = 30000; // 30 segundos
        this.autoRefreshEnabled = true;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoRefresh();
        this.updateLastUpdateTime();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item a');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(sectionName) {
        // Ocultar sección actual
        const currentSection = document.querySelector('.dashboard-section.active');
        if (currentSection) {
            currentSection.classList.remove('active');
        }

        // Mostrar nueva sección
        const newSection = document.getElementById(sectionName);
        if (newSection) {
            newSection.classList.add('active');
        }

        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).parentElement.classList.add('active');

        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }

    setupEventListeners() {
        // Filtros de alertas
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterAlerts(btn.dataset.filter);
            });
        });

        // Botones de acción
        window.refreshNetworkData = () => this.refreshNetworkData();
        window.scanDevices = () => this.scanDevices();
        window.exportReport = () => this.exportReport();
    }

    loadInitialData() {
        this.loadOverviewData();
        this.loadNetworkData();
        this.loadSecurityData();
        this.loadDevicesData();
        this.loadAlertsData();
        this.loadReportsData();
    }

    loadSectionData(section) {
        switch (section) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'network':
                this.loadNetworkData();
                break;
            case 'security':
                this.loadSecurityData();
                break;
            case 'devices':
                this.loadDevicesData();
                break;
            case 'alerts':
                this.loadAlertsData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
        }
    }

    async loadOverviewData() {
        try {
            // Simular datos de la API
            const data = await this.fetchData('/api/overview');
            this.updateOverviewMetrics(data);
        } catch (error) {
            console.error('Error loading overview data:', error);
            this.showNotification('Error al cargar datos generales', 'error');
        }
    }

    updateOverviewMetrics(data = null) {
        // Datos simulados si no hay respuesta de API
        const mockData = {
            internetStatus: 'Conectado',
            internetLatency: Math.floor(Math.random() * 50) + 10 + 'ms',
            routerStatus: 'Operativo',
            routerCpu: Math.floor(Math.random() * 40) + 20 + '%',
            routerRam: Math.floor(Math.random() * 30) + 30 + '%',
            proxyStatus: 'Protegido',
            threatsBlocked: Math.floor(Math.random() * 100) + 200,
            lanDevices: Math.floor(Math.random() * 10) + 20 + ' dispositivos',
            lanTraffic: (Math.random() * 2 + 0.5).toFixed(1) + ' Mbps'
        };

        const finalData = data || mockData;

        // Actualizar elementos del DOM
        this.updateElement('internet-status', finalData.internetStatus);
        this.updateElement('internet-latency', finalData.internetLatency);
        this.updateElement('router-status', finalData.routerStatus);
        this.updateElement('router-cpu', finalData.routerCpu);
        this.updateElement('router-ram', finalData.routerRam);
        this.updateElement('proxy-status', finalData.proxyStatus);
        this.updateElement('threats-blocked', finalData.threatsBlocked);
        this.updateElement('lan-devices', finalData.lanDevices);
        this.updateElement('lan-traffic', finalData.lanTraffic);
    }

    async loadNetworkData() {
        try {
            const pingData = await this.performPingTests();
            this.updatePingResults(pingData);
            
            const portData = await this.checkPorts();
            this.updatePortMonitoring(portData);
        } catch (error) {
            console.error('Error loading network data:', error);
        }
    }

    async performPingTests() {
        const targets = [
            { host: 'google.com', port: 80 },
            { host: 'cloudflare.com', port: 80 },
            { host: '192.168.1.1', port: 80, name: 'Router Local' },
            { host: '8.8.8.8', port: 53, name: 'DNS Google' }
        ];

        const results = [];
        for (const target of targets) {
            const latency = Math.floor(Math.random() * 100) + 10;
            const status = latency < 100 ? 'online' : 'warning';
            results.push({
                ...target,
                latency: latency + 'ms',
                status: status
            });
        }
        return results;
    }

    updatePingResults(results) {
        const container = document.getElementById('ping-results');
        if (!container) return;

        container.innerHTML = results.map(result => `
            <div class="ping-result">
                <div class="ping-host">
                    <i class="fas fa-server"></i>
                    <span>${result.name || result.host}</span>
                </div>
                <div class="ping-latency">
                    <span class="latency-value">${result.latency}</span>
                    <div class="status-indicator ${result.status}"></div>
                </div>
            </div>
        `).join('');
    }

    async checkPorts() {
        const ports = [
            { port: 80, name: 'HTTP', status: 'online' },
            { port: 443, name: 'HTTPS', status: 'online' },
            { port: 22, name: 'SSH', status: 'online' },
            { port: 21, name: 'FTP', status: 'offline' },
            { port: 3389, name: 'RDP', status: 'warning' }
        ];
        return ports;
    }

    updatePortMonitoring(ports) {
        const container = document.getElementById('port-monitoring');
        if (!container) return;

        container.innerHTML = ports.map(port => `
            <div class="port-status">
                <div class="port-info">
                    <span class="port-number">${port.port}</span>
                    <span class="port-name">${port.name}</span>
                </div>
                <div class="port-indicator ${port.status}"></div>
            </div>
        `).join('');
    }

    loadSecurityData() {
        const events = [
            {
                time: new Date(Date.now() - 300000).toLocaleString(),
                type: 'info',
                message: 'Firewall: Regla actualizada para bloquear tráfico sospechoso'
            },
            {
                time: new Date(Date.now() - 600000).toLocaleString(),
                type: 'warning',
                message: 'Proxy: Intento de acceso a sitio bloqueado desde 192.168.1.45'
            },
            {
                time: new Date(Date.now() - 900000).toLocaleString(),
                type: 'info',
                message: 'Sistema: Backup de configuración completado exitosamente'
            }
        ];

        this.updateSecurityEvents(events);
        this.updateSecurityMetrics();
    }

    updateSecurityEvents(events) {
        const container = document.getElementById('security-events');
        if (!container) return;

        container.innerHTML = events.map(event => `
            <div class="security-event ${event.type}">
                <div class="event-time">${event.time}</div>
                <div class="event-message">${event.message}</div>
            </div>
        `).join('');
    }

    updateSecurityMetrics() {
        this.updateElement('blocked-connections', Math.floor(Math.random() * 500) + 1000);
        this.updateElement('active-rules', Math.floor(Math.random() * 50) + 150);
        this.updateElement('blocked-sites', Math.floor(Math.random() * 20) + 40);
        this.updateElement('active-filters', Math.floor(Math.random() * 5) + 10);
        this.updateElement('cache-hit', Math.floor(Math.random() * 20) + 80 + '%');
    }

    loadDevicesData() {
        const devices = [
            { name: 'Router Principal', ip: '192.168.1.1', type: 'router', status: 'online', mac: '00:1B:44:11:3A:B7' },
            { name: 'Switch-01', ip: '192.168.1.2', type: 'switch', status: 'online', mac: '00:1B:44:11:3A:B8' },
            { name: 'Firewall', ip: '192.168.1.3', type: 'firewall', status: 'online', mac: '00:1B:44:11:3A:B9' },
            { name: 'PC-Admin', ip: '192.168.1.100', type: 'computer', status: 'online', mac: '00:1B:44:11:3A:C0' },
            { name: 'Laptop-User1', ip: '192.168.1.101', type: 'laptop', status: 'online', mac: '00:1B:44:11:3A:C1' },
            { name: 'Impresora-Red', ip: '192.168.1.200', type: 'printer', status: 'warning', mac: '00:1B:44:11:3A:D0' }
        ];

        this.updateDevicesGrid(devices);
    }

    updateDevicesGrid(devices) {
        const container = document.getElementById('devices-grid');
        if (!container) return;

        container.innerHTML = devices.map(device => `
            <div class="device-card">
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
                    </div>
                </div>
            </div>
        `).join('');
    }

    getDeviceIcon(type) {
        const icons = {
            router: 'router',
            switch: 'server',
            firewall: 'shield-alt',
            computer: 'desktop',
            laptop: 'laptop',
            printer: 'print',
            phone: 'mobile-alt'
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

    loadAlertsData() {
        const alerts = [
            {
                id: 1,
                type: 'info',
                title: 'Actualización de firmware disponible',
                message: 'Hay una nueva versión de firmware disponible para el router principal.',
                time: new Date(Date.now() - 1800000).toLocaleString(),
                severity: 'info'
            },
            {
                id: 2,
                type: 'warning',
                title: 'Alto uso de ancho de banda',
                message: 'El dispositivo 192.168.1.45 está utilizando más del 80% del ancho de banda disponible.',
                time: new Date(Date.now() - 3600000).toLocaleString(),
                severity: 'warning'
            },
            {
                id: 3,
                type: 'info',
                title: 'Nuevo dispositivo conectado',
                message: 'Se ha detectado un nuevo dispositivo en la red: Smartphone-Android.',
                time: new Date(Date.now() - 7200000).toLocaleString(),
                severity: 'info'
            }
        ];

        this.updateAlertsContainer(alerts);
    }

    updateAlertsContainer(alerts) {
        const container = document.getElementById('alerts-container');
        if (!container) return;

        container.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <div class="alert-header">
                    <div class="alert-icon">
                        <i class="fas fa-${this.getAlertIcon(alert.severity)}"></i>
                    </div>
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
                <div class="alert-message">${alert.message}</div>
            </div>
        `).join('');
    }

    getAlertIcon(severity) {
        const icons = {
            critical: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[severity] || 'info-circle';
    }

    filterAlerts(filter) {
        const alerts = document.querySelectorAll('.alert-item');
        alerts.forEach(alert => {
            if (filter === 'all' || alert.classList.contains(filter)) {
                alert.style.display = 'block';
            } else {
                alert.style.display = 'none';
            }
        });
    }

    loadReportsData() {
        // Los gráficos se cargarán en charts.js
        console.log('Loading reports data...');
    }

    async refreshNetworkData() {
        this.showNotification('Actualizando datos de red...', 'info');
        await this.loadNetworkData();
        this.showNotification('Datos de red actualizados', 'success');
    }

    async scanDevices() {
        this.showNotification('Escaneando dispositivos en la red...', 'info');
        // Simular escaneo
        setTimeout(() => {
            this.loadDevicesData();
            this.showNotification('Escaneo de dispositivos completado', 'success');
        }, 3000);
    }

    exportReport() {
        this.showNotification('Generando reporte...', 'info');
        // Simular generación de reporte
        setTimeout(() => {
            this.downloadReport();
            this.showNotification('Reporte generado exitosamente', 'success');
        }, 2000);
    }

    downloadReport() {
        const reportData = {
            timestamp: new Date().toISOString(),
            uptime: '99.8%',
            devices: 24,
            threats_blocked: 247,
            bandwidth_usage: '1.2 Mbps'
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `sentinel-report-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    startAutoRefresh() {
        if (this.autoRefreshEnabled) {
            setInterval(() => {
                this.loadSectionData(this.currentSection);
                this.updateLastUpdateTime();
            }, this.refreshInterval);
        }
    }

    updateLastUpdateTime() {
        const element = document.getElementById('last-update');
        if (element) {
            element.textContent = new Date().toLocaleString('es-ES');
        }
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`API endpoint ${endpoint} not available, using mock data`);
            return null;
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Agregar estilos si no existen
        if (!document.querySelector('.notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: #ffffff;
                    font-weight: 500;
                    z-index: 1000;
                    animation: slideIn 0.3s ease-out;
                }
                .notification-success { background: linear-gradient(135deg, #00e676 0%, #00c853 100%); }
                .notification-error { background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); }
                .notification-warning { background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: #000; }
                .notification-info { background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); }
                .notification-content { display: flex; align-items: center; gap: 0.5rem; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.sentinelDashboard = new SentinelDashboard();
});

// Agregar estilos CSS adicionales para elementos dinámicos
const additionalStyles = `
    .ping-result {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem;
        margin-bottom: 0.5rem;
        background-color: #333;
        border-radius: 6px;
        transition: background-color 0.3s ease;
    }

    .ping-result:hover {
        background-color: #444;
    }

    .ping-host {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #ffffff;
    }

    .ping-latency {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .latency-value {
        font-weight: 600;
        color: #00e676;
    }

    .port-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem;
        margin-bottom: 0.5rem;
        background-color: #333;
        border-radius: 6px;
    }

    .port-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .port-number {
        font-weight: 600;
        color: #00e676;
        min-width: 40px;
    }

    .port-name {
        color: #ffffff;
    }

    .port-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .port-indicator.online {
        background-color: #00e676;
    }

    .port-indicator.warning {
        background-color: #ffc107;
    }

    .port-indicator.offline {
        background-color: #f44336;
    }

    .security-event {
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 6px;
        border-left: 4px solid #2196f3;
    }

    .security-event.warning {
        border-left-color: #ffc107;
        background-color: rgba(255, 193, 7, 0.1);
    }

    .security-event.info {
        border-left-color: #2196f3;
        background-color: rgba(33, 150, 243, 0.1);
    }

    .event-time {
        font-size: 0.8rem;
        color: #b0bec5;
        margin-bottom: 0.3rem;
    }

    .event-message {
        color: #ffffff;
        line-height: 1.4;
    }

    .device-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .device-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .device-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #283593 0%, #1a237e 100%);
        border-radius: 50%;
        color: #00e676;
        font-size: 1.2rem;
    }

    .device-status {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .device-status.online {
        background-color: #00e676;
    }

    .device-status.warning {
        background-color: #ffc107;
    }

    .device-status.offline {
        background-color: #f44336;
    }

    .device-info h4 {
        color: #ffffff;
        margin-bottom: 0.8rem;
        font-size: 1rem;
    }

    .device-details {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .detail {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
    }

    .detail span:first-child {
        color: #b0bec5;
    }

    .detail span:last-child {
        color: #ffffff;
        font-weight: 500;
    }

    .alert-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }

    .alert-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #283593;
        color: #ffffff;
    }

    .alert-title {
        flex: 1;
        font-weight: 600;
        color: #ffffff;
    }

    .alert-time {
        font-size: 0.8rem;
        color: #b0bec5;
    }

    .alert-message {
        color: #e0e0e0;
        line-height: 1.4;
        padding-left: 3.5rem;
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
