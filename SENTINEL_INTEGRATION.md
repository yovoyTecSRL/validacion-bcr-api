# Integración de Sentinel Dashboard con Validación BCR API

Este documento describe cómo integrar el módulo **Sentinel Dashboard** con el sistema de validación de tarjetas BCR existente.

## 🏗️ Estructura del Proyecto

```
validacion-bcr-api/
├── README.md                    # Documentación principal del proyecto BCR
├── index.html                   # Formulario de validación de tarjetas
├── azure-pipelines.yml         # Pipeline de CI/CD
├── sentinel/                    # 🆕 NUEVO MÓDULO SENTINEL
│   ├── README.md               # Documentación específica de Sentinel
│   ├── sentinel_dashboard.html # Dashboard principal
│   ├── app.py                  # Servidor Python/FastAPI
│   ├── requirements.txt        # Dependencias Python
│   ├── Dockerfile             # Containerización
│   ├── docker-compose.yml     # Orquestación de servicios
│   ├── install.sh             # Script de instalación automática
│   ├── test_sentinel.py       # Suite de tests
│   ├── config/
│   │   └── sentinel.json      # Configuración principal
│   ├── static/
│   │   ├── css/
│   │   │   └── sentinel.css   # Estilos del dashboard
│   │   └── js/
│   │       ├── sentinel.js    # Lógica principal
│   │       ├── charts.js      # Gráficos y visualización
│   │       └── network-monitor.js # Monitoreo de red
│   ├── templates/             # Plantillas adicionales
│   ├── api/                   # Módulos de API
│   ├── data/                  # Base de datos local
│   ├── logs/                  # Archivos de log
│   └── docs/                  # Documentación adicional
```

## 🚀 Instalación Rápida

### Opción 1: Instalación Automática (Recomendada)

```bash
# Navegar al directorio sentinel
cd validacion-bcr-api/sentinel

# Ejecutar instalación automática
./install.sh

# El script detectará automáticamente:
# - Sistema operativo (Linux/macOS)
# - Versión de Python
# - Dependencias disponibles
# - Configurará el entorno virtual
# - Instalará todas las dependencias
```

### Opción 2: Instalación Manual

```bash
# Crear entorno virtual
cd validacion-bcr-api/sentinel
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar archivo de configuración
cp config/sentinel.json config/sentinel.local.json

# Ejecutar aplicación
python app.py
```

### Opción 3: Instalación con Docker

```bash
# Construir y ejecutar con Docker Compose
cd validacion-bcr-api/sentinel
docker-compose up -d

# Ver logs
docker-compose logs -f sentinel
```

## 🔗 Integración con Sistema BCR Existente

### 1. Compartir Infraestructura

El módulo Sentinel puede monitorear la misma infraestructura que soporta el sistema de validación BCR:

```bash
# El sistema BCR actual puede ejecutarse en puerto 8100
uvicorn main:app --host 0.0.0.0 --port 8100 --reload

# Sentinel ejecutándose en puerto 8080
cd sentinel && python app.py
```

### 2. Monitoreo de APIs BCR

Configurar Sentinel para monitorear las APIs que utiliza el sistema de validación:

```json
{
  "network": {
    "ping_targets": [
      {
        "host": "api.ccss.sa.cr",
        "name": "API CCSS",
        "critical": true
      },
      {
        "host": "api.hacienda.go.cr", 
        "name": "API Hacienda",
        "critical": true
      },
      {
        "host": "gps.mimoto.express",
        "name": "Traccar GPS",
        "critical": false
      }
    ]
  }
}
```

### 3. Alertas para Fallos del Sistema

Configurar alertas cuando los servicios críticos del BCR fallen:

```json
{
  "alerts": {
    "email": {
      "to_addresses": [
        "admin-bcr@banco.cr",
        "desarrollo@yovoytech.com"
      ]
    },
    "webhook": {
      "url": "https://hooks.slack.com/services/BCR/ALERTS/TOKEN"
    }
  }
}
```

## 🎯 Casos de Uso Específicos para BCR

### 1. Monitoreo de Red Bancaria

- **Conectividad Internet**: Verificar que las APIs externas (CCSS, Hacienda) estén accesibles
- **Red LAN Interna**: Monitorear dispositivos en la sucursal bancaria
- **Firewall**: Asegurar que las reglas de seguridad estén activas
- **Proxy**: Controlar el tráfico web y bloquear sitios no autorizados

### 2. Seguridad de Transacciones

- **Detección de Anomalías**: Identificar patrones inusuales en el tráfico de red
- **Monitoreo de Puertos**: Verificar que solo los puertos necesarios estén abiertos
- **Análisis de Logs**: Revisar logs de firewall y proxy para amenazas
- **Alertas de Seguridad**: Notificaciones inmediatas de eventos críticos

### 3. Disponibilidad del Sistema

- **Uptime Monitoring**: Garantizar 99.9% de disponibilidad del sistema BCR
- **Performance Metrics**: Monitorear latencia y throughput de las APIs
- **Capacity Planning**: Análisis de tendencias para planificar crecimiento
- **Disaster Recovery**: Alertas tempranas para activar planes de contingencia

## 📊 Dashboard Integrado

### Acceso al Dashboard

Una vez instalado, el dashboard estará disponible en:

- **URL Principal**: http://localhost:8080
- **API REST**: http://localhost:8080/api/
- **WebSocket**: ws://localhost:8080/ws/network
- **Health Check**: http://localhost:8080/health

### Secciones del Dashboard

1. **🏠 Resumen General**
   - Estado global de la infraestructura BCR
   - Métricas de conectividad a APIs externas
   - Estado de servicios críticos

2. **🌐 Monitoreo de Red**
   - Topología de red de la sucursal
   - Ping a servidores críticos (CCSS, Hacienda, BCR)
   - Estado de dispositivos de red

3. **🔒 Centro de Seguridad**
   - Amenazas detectadas en tiempo real
   - Estado del firewall y proxy
   - Eventos de seguridad recientes

4. **🖥️ Dispositivos**
   - Inventario de dispositivos conectados
   - Estado de servidores y workstations
   - Dispositivos móviles y tablets

5. **⚠️ Alertas**
   - Notificaciones críticas
   - Alertas de sistemas BCR
   - Eventos de red y seguridad

6. **📈 Reportes**
   - Reportes de disponibilidad
   - Análisis de performance
   - Estadísticas de uso

## 🔧 Configuración para Ambiente BCR

### Variables de Entorno

```bash
# Configuración específica para BCR
export SENTINEL_ENV=production
export SENTINEL_BCR_MODE=true
export SENTINEL_API_KEY=bcr-sentinel-api-key
export SENTINEL_LOG_LEVEL=INFO

# Configuración de red BCR
export SENTINEL_NETWORK_RANGE=10.0.0.0/8
export SENTINEL_GATEWAY=10.0.0.1
export SENTINEL_DNS_PRIMARY=10.0.0.10
export SENTINEL_DNS_SECONDARY=8.8.8.8

# Alertas BCR
export SENTINEL_ALERT_EMAIL=alertas-ti@banco.cr
export SENTINEL_SLACK_WEBHOOK=https://hooks.slack.com/...
```

### Configuración de Red BCR

```json
{
  "network": {
    "subnet_ranges": [
      {
        "range": "10.0.0.0/8",
        "name": "Red Corporativa BCR",
        "scan_enabled": true
      },
      {
        "range": "192.168.100.0/24",
        "name": "Red Sucursal",
        "scan_enabled": true
      }
    ],
    "critical_hosts": [
      "core.banco.cr",
      "api-validation.banco.cr", 
      "backup.banco.cr"
    ]
  }
}
```

## 🚨 Alertas y Notificaciones

### Configuración de Alertas Críticas

```json
{
  "alerts": {
    "escalation_rules": {
      "critical": {
        "immediate": true,
        "channels": ["email", "sms", "webhook"],
        "recipients": [
          "gerencia-ti@banco.cr",
          "seguridad@banco.cr",
          "soporte-24x7@banco.cr"
        ]
      }
    }
  }
}
```

### Tipos de Alertas para BCR

- **🔴 CRÍTICAS**: Caída de servicios core, ataques de seguridad
- **🟡 ADVERTENCIAS**: Alto uso de recursos, latencia elevada
- **🔵 INFORMATIVAS**: Nuevos dispositivos, actualizaciones completadas

## 📈 Métricas y KPIs

### KPIs Principales para BCR

1. **Disponibilidad del Sistema**: > 99.9%
2. **Tiempo de Respuesta de APIs**: < 200ms
3. **Eventos de Seguridad**: 0 críticos por día
4. **Dispositivos Monitoreados**: 100% de cobertura
5. **Tiempo de Detección de Fallos**: < 30 segundos

### Reportes Automáticos

- **Diario**: Resumen de eventos y métricas
- **Semanal**: Análisis de tendencias y performance
- **Mensual**: Reporte ejecutivo con KPIs
- **Trimestral**: Evaluación de seguridad y capacidad

## 🔐 Seguridad y Cumplimiento

### Medidas de Seguridad

- **Autenticación**: JWT con expiración configurable
- **Autorización**: RBAC (Control de Acceso Basado en Roles)
- **Encriptación**: TLS 1.3 para todas las comunicaciones
- **Auditoría**: Log completo de todas las acciones
- **Backup**: Respaldo automático de configuraciones

### Cumplimiento Normativo

- **SUGEF**: Cumplimiento de regulaciones bancarias costarricenses
- **ISO 27001**: Estándares de seguridad de información
- **PCI DSS**: Seguridad de datos de tarjetas de pago
- **SOX**: Controles para reportes financieros

## 🛠️ Mantenimiento y Soporte

### Tareas de Mantenimiento

```bash
# Backup automático (diario)
0 2 * * * /opt/sentinel/backup.sh

# Limpieza de logs (semanal)  
0 3 * * 0 find /opt/sentinel/logs -name "*.log" -mtime +30 -delete

# Actualización de definiciones de amenazas (cada 4 horas)
0 */4 * * * /opt/sentinel/update-threats.sh

# Reporte de salud del sistema (diario)
0 8 * * * /opt/sentinel/health-report.sh
```

### Contacto de Soporte

- **YovoyTech SRL**: soporte@yovoytech.com
- **Teléfono 24/7**: +506 2234-5678
- **Slack**: #sentinel-support
- **Documentación**: https://docs.yovoytech.com/sentinel

## 🚀 Próximos Pasos

### Roadmap de Integración

1. **Fase 1** (Semana 1-2): Instalación y configuración básica
2. **Fase 2** (Semana 3-4): Integración con APIs BCR existentes
3. **Fase 3** (Semana 5-6): Configuración de alertas y reportes
4. **Fase 4** (Semana 7-8): Pruebas en ambiente de producción
5. **Fase 5** (Semana 9-10): Go-live y monitoreo 24/7

### Checklist de Implementación

- [ ] Instalar Sentinel en servidor de monitoreo
- [ ] Configurar rangos de red corporativa BCR
- [ ] Integrar con APIs existentes (CCSS, Hacienda)
- [ ] Configurar alertas para equipos de TI
- [ ] Establecer dashboards personalizados
- [ ] Configurar reportes automáticos
- [ ] Entrenar al personal de TI
- [ ] Documentar procedimientos operativos
- [ ] Establecer métricas y SLAs
- [ ] Activar monitoreo 24/7

---

**Desarrollado por YovoyTech SRL para el Banco de Costa Rica**  
*Versión: 1.0.0 | Fecha: Julio 2025*
