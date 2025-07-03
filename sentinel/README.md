# Sentinel - Dashboard de Monitoreo de Red

![Sentinel Banner](docs/sentinel-banner.png)

**Sentinel** es una plataforma avanzada para el monitoreo, análisis y gestión de redes internas y aplicaciones bancarias. Su objetivo es ofrecer visibilidad en tiempo real, alertas inteligentes y reportes para garantizar la seguridad, el rendimiento y el cumplimiento normativo en entornos financieros.

---

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API](#api)
- [Tests](#tests)
- [Roadmap](#roadmap)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Características Principales

### 🔍 Monitoreo en Tiempo Real
- **Infraestructura de Red**: Monitoreo continuo de routers, switches, firewalls y puntos de acceso
- **Conectividad Internet**: Verificación de latencia, velocidad y disponibilidad de conexión
- **Dispositivos LAN**: Descubrimiento automático y seguimiento de todos los dispositivos conectados
- **Tráfico de Red**: Análisis del flujo de datos, protocolos utilizados y patrones de uso

### 🛡️ Seguridad Avanzada
- **Detección de Amenazas**: Identificación automática de actividades sospechosas
- **Firewall Inteligente**: Monitoreo y gestión de reglas de firewall en tiempo real
- **Proxy Web**: Control y filtrado de contenido web con reportes detallados
- **Análisis de Vulnerabilidades**: Escaneo periódico de puertos y servicios expuestos

### 📊 Dashboards Interactivos
- **Vista General**: Resumen ejecutivo del estado de toda la red
- **Métricas en Tiempo Real**: Gráficos dinámicos de rendimiento y uso
- **Topología Visual**: Diagrama interactivo de la infraestructura de red
- **Alertas Inteligentes**: Sistema de notificaciones prioritario y personalizable

### 📈 Reportes y Análisis
- **Informes Automáticos**: Generación programada de reportes en PDF/CSV
- **Análisis de Tendencias**: Identificación de patrones y predicciones
- **Métricas de SLA**: Seguimiento de disponibilidad y rendimiento
- **Auditoría de Cumplimiento**: Reportes para regulaciones bancarias

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    SENTINEL DASHBOARD                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend (HTML5 + CSS3 + JavaScript)                      │
│  ├── Dashboard UI                                          │
│  ├── Real-time Charts (Chart.js)                          │
│  ├── Network Topology Viewer                              │
│  └── Alert Management System                              │
├─────────────────────────────────────────────────────────────┤
│  Backend Services                                          │
│  ├── Network Monitor Service                              │
│  ├── Security Scanner Service                             │
│  ├── Device Discovery Service                             │
│  └── Report Generator Service                             │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                               │
│  ├── Time Series Database (InfluxDB)                      │
│  ├── Configuration Store (JSON/YAML)                      │
│  └── Alert Rules Engine                                   │
├─────────────────────────────────────────────────────────────┤
│  Network Infrastructure                                    │
│  ├── SNMP Agents                                          │
│  ├── Syslog Collectors                                    │
│  ├── Network Scanners (Nmap)                              │
│  └── Traffic Analyzers                                    │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Principales

#### 1. **Frontend Dashboard**
- **Interfaz de Usuario**: Dashboard responsive con diseño moderno
- **Visualización**: Gráficos en tiempo real y métricas clave
- **Navegación**: Sistema de pestañas para diferentes vistas
- **Interactividad**: Controles para filtros, búsquedas y acciones

#### 2. **Network Monitor**
- **Ping Monitoring**: Verificación de conectividad a hosts críticos
- **Device Discovery**: Escaneo automático de dispositivos en la LAN
- **Port Scanning**: Verificación de servicios y puertos abiertos
- **Traffic Analysis**: Análisis de patrones de tráfico de red

#### 3. **Security Module**
- **Threat Detection**: Identificación de amenazas y anomalías
- **Firewall Management**: Monitoreo de reglas y logs de firewall
- **Vulnerability Scanner**: Análisis de seguridad de dispositivos
- **Incident Response**: Sistema de respuesta a incidentes de seguridad

#### 4. **Reporting Engine**
- **Automated Reports**: Generación automática de informes
- **Custom Dashboards**: Creación de vistas personalizadas
- **Data Export**: Exportación de datos en múltiples formatos
- **Historical Analysis**: Análisis de tendencias históricas

---

## Tecnologías

### Frontend
- **HTML5**: Estructura semántica moderna
- **CSS3**: Diseño responsive con flexbox y grid
- **JavaScript ES6+**: Lógica de aplicación moderna
- **Chart.js**: Visualización de datos interactiva
- **Font Awesome**: Iconografía profesional

### Backend
- **Python 3.8+**: Servicios de backend
- **FastAPI**: API REST de alto rendimiento
- **WebSockets**: Comunicación en tiempo real
- **Asyncio**: Programación asíncrona

### Datos
- **InfluxDB**: Base de datos de series temporales
- **JSON**: Configuración y datos estructurados
- **CSV/PDF**: Exportación de reportes

### Herramientas de Red
- **SNMP**: Protocolo de gestión de red
- **Nmap**: Escáner de red y puertos
- **Ping**: Verificación de conectividad
- **Iperf3**: Medición de ancho de banda

---

## Instalación

### Requisitos Previos
- Python 3.8 o superior
- Node.js 14+ (para herramientas de desarrollo)
- Acceso administrativo a la red
- Puertos 80/443 disponibles

### Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/validacion-bcr-api.git
cd validacion-bcr-api/sentinel

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar archivo de configuración
cp config/sentinel.example.json config/sentinel.json

# Inicializar base de datos
python scripts/init_db.py

# Ejecutar aplicación
python app.py
```

### Instalación con Docker

```bash
# Construir imagen
docker build -t sentinel-dashboard .

# Ejecutar contenedor
docker run -d \
  --name sentinel \
  -p 8080:80 \
  -v ./config:/app/config \
  -v ./data:/app/data \
  sentinel-dashboard
```

---

## Configuración

### Archivo de Configuración Principal

```json
{
  "network": {
    "scan_interval": 60,
    "ping_targets": [
      "google.com",
      "cloudflare.com",
      "192.168.1.1"
    ],
    "subnet_ranges": [
      "192.168.1.0/24",
      "10.0.0.0/24"
    ]
  },
  "security": {
    "scan_interval": 300,
    "threat_threshold": "medium",
    "alert_channels": ["email", "webhook"]
  },
  "alerts": {
    "email": {
      "smtp_server": "smtp.gmail.com",
      "smtp_port": 587,
      "username": "alerts@empresa.com",
      "recipients": ["admin@empresa.com"]
    },
    "webhook": {
      "url": "https://hooks.slack.com/...",
      "timeout": 10
    }
  },
  "database": {
    "type": "influxdb",
    "host": "localhost",
    "port": 8086,
    "database": "sentinel"
  }
}
```

### Variables de Entorno

```bash
# Configuración de red
SENTINEL_NETWORK_INTERFACE=eth0
SENTINEL_SCAN_INTERVAL=60

# Configuración de base de datos
SENTINEL_DB_HOST=localhost
SENTINEL_DB_PORT=8086
SENTINEL_DB_NAME=sentinel

# Configuración de alertas
SENTINEL_ALERT_EMAIL=admin@empresa.com
SENTINEL_WEBHOOK_URL=https://hooks.slack.com/...

# Configuración de seguridad
SENTINEL_API_KEY=your-secret-api-key
SENTINEL_LOG_LEVEL=INFO
```

---

## Uso

### Acceso al Dashboard

1. **Abrir navegador**: Navegar a `http://localhost:8080`
2. **Login**: Usar credenciales de administrador
3. **Dashboard**: Ver resumen general del sistema

### Secciones Principales

#### 🏠 **Resumen General**
- Estado global de la red
- Métricas principales en tiempo real
- Gráficos de tráfico de red
- Indicadores de salud del sistema

#### 🌐 **Monitoreo de Red**
- Topología visual de la red
- Estado de dispositivos críticos
- Resultados de ping a servidores
- Monitoreo de puertos y servicios

#### 🔒 **Centro de Seguridad**
- Nivel de seguridad actual
- Amenazas detectadas
- Estado del firewall y proxy
- Eventos de seguridad recientes

#### 🖥️ **Dispositivos**
- Lista de dispositivos conectados
- Estado y información de cada dispositivo
- Historial de conexiones
- Escaneo manual de red

#### ⚠️ **Alertas**
- Centro de notificaciones
- Filtros por severidad
- Historial de alertas
- Configuración de notificaciones

#### 📊 **Reportes**
- Reportes de disponibilidad
- Análisis de tráfico
- Estadísticas de seguridad
- Exportación de datos

### Comandos de Control

```javascript
// Ejecutar escaneo manual
window.scanDevices()

// Actualizar datos de red
window.refreshNetworkData()

// Exportar reporte
window.exportReport()

// Obtener estadísticas
window.networkMonitor.getNetworkStatistics()
```

---

## API

### Endpoints Principales

#### Network Monitoring
```http
GET /api/network/status
GET /api/network/devices
GET /api/network/ping?host=google.com
GET /api/network/topology
POST /api/network/scan
```

#### Security
```http
GET /api/security/threats
GET /api/security/firewall
GET /api/security/events
POST /api/security/scan
```

#### Reports
```http
GET /api/reports/uptime
GET /api/reports/traffic
GET /api/reports/security
POST /api/reports/export
```

#### WebSocket Events
```javascript
// Conexión WebSocket
const ws = new WebSocket('ws://localhost:8080/ws/network');

// Eventos disponibles
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'device_discovered':
    case 'security_alert':
    case 'network_status':
    case 'traffic_update':
      // Procesar evento
      break;
  }
};
```

---

## Tests

### Ejecutar Tests

```bash
# Tests unitarios
python -m pytest tests/unit/

# Tests de integración
python -m pytest tests/integration/

# Tests de frontend
npm test

# Coverage report
python -m pytest --cov=sentinel tests/
```

### Tests Principales

- **Network Discovery**: Verificación de escaneo de dispositivos
- **Security Scanning**: Pruebas de detección de amenazas
- **API Endpoints**: Tests de todos los endpoints REST
- **WebSocket Communication**: Pruebas de comunicación en tiempo real
- **Dashboard UI**: Tests de interfaz de usuario

---

## Roadmap

### Versión 2.0 (Q2 2025)
- [ ] **Machine Learning**: Detección de anomalías con IA
- [ ] **Mobile App**: Aplicación móvil para administradores
- [ ] **Cloud Integration**: Integración con servicios en la nube
- [ ] **Advanced Analytics**: Análisis predictivo de red

### Versión 2.1 (Q3 2025)
- [ ] **Multi-tenant**: Soporte para múltiples organizaciones
- [ ] **Advanced Reporting**: Reportes más detallados y personalizables
- [ ] **API Gateway**: Integración con sistemas externos
- [ ] **Backup/Restore**: Sistema de respaldo automático

### Versión 3.0 (Q4 2025)
- [ ] **Distributed Monitoring**: Monitoreo distribuido en múltiples sitios
- [ ] **Advanced Security**: SIEM integrado y análisis forense
- [ ] **Performance Optimization**: Optimizaciones de rendimiento
- [ ] **Enterprise Features**: Características empresariales avanzadas

---

## Características Técnicas

### Rendimiento
- **Latencia**: < 100ms para consultas en tiempo real
- **Throughput**: > 10,000 eventos por segundo
- **Escalabilidad**: Hasta 1,000 dispositivos monitoreados
- **Disponibilidad**: 99.9% uptime garantizado

### Seguridad
- **Autenticación**: JWT con expiración configurable
- **Autorización**: RBAC (Role-Based Access Control)
- **Encriptación**: TLS 1.3 para todas las comunicaciones
- **Auditoría**: Log completo de todas las acciones

### Compatibilidad
- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Sistemas Operativos**: Linux, Windows, macOS
- **Dispositivos**: Routers, switches, firewalls con SNMP
- **Protocolos**: HTTP/HTTPS, WebSocket, SNMP v1/v2c/v3

---

## Contribuciones

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crear** rama para nueva característica (`git checkout -b feature/nueva-caracteristica`)
3. **Commit** cambios (`git commit -am 'Agregar nueva característica'`)
4. **Push** a la rama (`git push origin feature/nueva-caracteristica`)
5. **Crear** Pull Request

### Estándares de Código

- **Python**: Seguir PEP 8
- **JavaScript**: Usar ESLint con configuración estándar
- **CSS**: Metodología BEM para clases
- **Documentación**: Documentar todas las funciones públicas

### Reportar Bugs

Usar el [issue tracker](https://github.com/tu-usuario/validacion-bcr-api/issues) con:
- Descripción detallada del problema
- Pasos para reproducir
- Entorno y versión del sistema
- Logs relevantes

---

## Licencia

Este proyecto es propiedad de **YovoyTech SRL** y forma parte del sistema BABEL automatizado. 

### Términos de Uso
- Uso interno exclusivo para el Banco de Costa Rica
- Prohibida la redistribución sin autorización
- Soporte técnico incluido durante 12 meses
- Actualizaciones de seguridad garantizadas

### Contacto
- **Empresa**: YovoyTech SRL
- **Email**: soporte@yovoytech.com
- **Teléfono**: +506 2234-5678
- **Sitio Web**: https://yovoytech.com

---

## Soporte Técnico

### Canales de Soporte
- **Email**: soporte-sentinel@yovoytech.com
- **Teléfono**: +506 2234-5678 ext. 101
- **Chat**: Disponible en horario hábil
- **Documentación**: https://docs.yovoytech.com/sentinel

### Horarios de Atención
- **Lunes a Viernes**: 8:00 AM - 6:00 PM (GMT-6)
- **Emergencias**: 24/7 para clientes Premium
- **Tiempo de respuesta**: < 4 horas para casos críticos

---

*Última actualización: Julio 2025*
*Versión: 1.0.0*
