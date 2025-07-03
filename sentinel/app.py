#!/usr/bin/env python3
"""
Sentinel Dashboard - Servidor de Monitoreo de Red
Desarrollado por YovoyTech SRL para BCR
"""

import json
import asyncio
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sentinel Dashboard",
    description="Dashboard de Monitoreo de Red para BCR",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración global
config = {}
connected_clients = set()

def load_config():
    """Cargar configuración desde archivo JSON"""
    global config
    config_path = Path(__file__).parent / "config" / "sentinel.json"
    
    if config_path.exists():
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
    else:
        # Configuración por defecto
        config = {
            "application": {"port": 8080, "host": "0.0.0.0"},
            "network": {"scan_interval": 60},
            "dashboard": {"refresh_interval": 30}
        }
    
    logger.info(f"Configuración cargada: {config.get('application', {}).get('name', 'Sentinel')}")

class NetworkMonitor:
    """Clase para monitoreo de red"""
    
    def __init__(self):
        self.devices = []
        self.network_stats = {
            "packets_in": 0,
            "packets_out": 0,
            "bytes_in": 0,
            "bytes_out": 0,
            "errors": 0
        }
        self.security_events = []
        
    async def scan_devices(self):
        """Simular escaneo de dispositivos"""
        import random
        
        # Dispositivos simulados
        mock_devices = [
            {
                "ip": "192.168.1.1",
                "mac": "00:1B:44:11:3A:B7",
                "name": "Router Principal",
                "type": "router",
                "status": "online",
                "manufacturer": "TP-Link",
                "last_seen": datetime.now().isoformat()
            },
            {
                "ip": "192.168.1.2", 
                "mac": "00:1B:44:11:3A:B8",
                "name": "Switch-01",
                "type": "switch",
                "status": "online",
                "manufacturer": "Cisco",
                "last_seen": datetime.now().isoformat()
            },
            {
                "ip": "192.168.1.3",
                "mac": "00:1B:44:11:3A:B9", 
                "name": "Firewall",
                "type": "firewall",
                "status": "online",
                "manufacturer": "SonicWall",
                "last_seen": datetime.now().isoformat()
            },
            {
                "ip": f"192.168.1.{random.randint(100, 200)}",
                "mac": f"00:1B:44:11:3A:{random.randint(10, 99):02X}",
                "name": f"PC-{random.randint(1, 50):03d}",
                "type": "computer",
                "status": random.choice(["online", "offline", "warning"]),
                "manufacturer": random.choice(["Dell", "HP", "Lenovo"]),
                "last_seen": (datetime.now() - timedelta(minutes=random.randint(0, 60))).isoformat()
            }
        ]
        
        self.devices = mock_devices
        return self.devices
    
    async def ping_host(self, host: str):
        """Simular ping a host"""
        import random
        await asyncio.sleep(0.1)  # Simular latencia
        
        latency = random.randint(10, 150)
        status = "online" if latency < 100 else "warning"
        
        return {
            "host": host,
            "latency": latency,
            "status": status,
            "timestamp": datetime.now().isoformat()
        }
    
    def get_network_stats(self):
        """Obtener estadísticas de red"""
        import random
        
        # Simular estadísticas en tiempo real
        self.network_stats.update({
            "packets_in": random.randint(1000, 5000),
            "packets_out": random.randint(800, 4000),
            "bytes_in": random.randint(1024000, 10240000),
            "bytes_out": random.randint(512000, 8192000),
            "errors": random.randint(0, 10),
            "timestamp": datetime.now().isoformat()
        })
        
        return self.network_stats

class SecurityMonitor:
    """Clase para monitoreo de seguridad"""
    
    def __init__(self):
        self.threats = []
        self.firewall_stats = {
            "blocked_connections": 0,
            "active_rules": 156,
            "status": "active"
        }
    
    def scan_threats(self):
        """Escanear amenazas de seguridad"""
        import random
        
        # Simular detección ocasional de amenazas
        if random.random() < 0.1:  # 10% de probabilidad
            threat = {
                "type": random.choice(["malware", "phishing", "intrusion"]),
                "source_ip": f"192.168.1.{random.randint(1, 254)}",
                "severity": random.choice(["low", "medium", "high"]),
                "description": "Actividad sospechosa detectada",
                "timestamp": datetime.now().isoformat()
            }
            self.threats.append(threat)
            
            # Mantener solo las últimas 100 amenazas
            if len(self.threats) > 100:
                self.threats = self.threats[-100:]
        
        return self.threats
    
    def get_firewall_stats(self):
        """Obtener estadísticas del firewall"""
        import random
        
        self.firewall_stats.update({
            "blocked_connections": random.randint(1000, 2000),
            "active_rules": random.randint(150, 160),
            "status": "active",
            "last_update": datetime.now().isoformat()
        })
        
        return self.firewall_stats

# Instancias globales
network_monitor = NetworkMonitor()
security_monitor = SecurityMonitor()

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Servir dashboard principal"""
    dashboard_path = Path(__file__).parent / "sentinel_dashboard.html"
    
    if dashboard_path.exists():
        with open(dashboard_path, 'r', encoding='utf-8') as f:
            return HTMLResponse(content=f.read())
    else:
        return HTMLResponse("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sentinel Dashboard</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: #0f1419; 
                    color: #fff; 
                    text-align: center; 
                    padding: 50px; 
                }
                .error { 
                    background: #f44336; 
                    padding: 20px; 
                    border-radius: 8px; 
                    display: inline-block; 
                }
            </style>
        </head>
        <body>
            <div class="error">
                <h1>⚠️ Sentinel Dashboard</h1>
                <p>Archivo dashboard no encontrado</p>
                <p>Ubicación esperada: sentinel_dashboard.html</p>
            </div>
        </body>
        </html>
        """)

@app.get("/health")
async def health_check():
    """Verificación de salud del sistema"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "uptime": "running"
    }

@app.get("/api/overview")
async def get_overview():
    """Obtener resumen general del sistema"""
    return {
        "internet_status": "Conectado",
        "internet_latency": "15ms",
        "router_status": "Operativo", 
        "router_cpu": "25%",
        "router_ram": "40%",
        "proxy_status": "Protegido",
        "threats_blocked": 247,
        "lan_devices": f"{len(network_monitor.devices)} dispositivos",
        "lan_traffic": "1.2 Mbps",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/network/devices")
async def get_devices():
    """Obtener lista de dispositivos"""
    devices = await network_monitor.scan_devices()
    return {
        "devices": devices,
        "total": len(devices),
        "online": len([d for d in devices if d["status"] == "online"]),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/network/ping")
async def ping_host(host: str):
    """Hacer ping a un host específico"""
    if not host:
        raise HTTPException(status_code=400, detail="Host parameter required")
    
    result = await network_monitor.ping_host(host)
    return result

@app.get("/api/network/stats")
async def get_network_stats():
    """Obtener estadísticas de red"""
    stats = network_monitor.get_network_stats()
    return stats

@app.get("/api/security/threats")
async def get_threats():
    """Obtener amenazas de seguridad"""
    threats = security_monitor.scan_threats()
    return {
        "threats": threats,
        "total": len(threats),
        "critical": len([t for t in threats if t.get("severity") == "high"]),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/security/firewall")
async def get_firewall_status():
    """Obtener estado del firewall"""
    stats = security_monitor.get_firewall_stats()
    return stats

@app.post("/api/network/scan")
async def scan_network():
    """Ejecutar escaneo manual de red"""
    devices = await network_monitor.scan_devices()
    threats = security_monitor.scan_threats()
    
    # Notificar a clientes WebSocket
    if connected_clients:
        scan_result = {
            "type": "scan_complete",
            "devices": len(devices),
            "threats": len(threats),
            "timestamp": datetime.now().isoformat()
        }
        
        for client in connected_clients.copy():
            try:
                await client.send_text(json.dumps(scan_result))
            except:
                connected_clients.discard(client)
    
    return {
        "status": "completed",
        "devices_found": len(devices),
        "threats_detected": len(threats),
        "timestamp": datetime.now().isoformat()
    }

@app.websocket("/ws/network")
async def websocket_endpoint(websocket: WebSocket):
    """Endpoint WebSocket para datos en tiempo real"""
    await websocket.accept()
    connected_clients.add(websocket)
    
    try:
        while True:
            # Enviar datos de red en tiempo real
            network_data = {
                "type": "network_update",
                "stats": network_monitor.get_network_stats(),
                "timestamp": datetime.now().isoformat()
            }
            
            await websocket.send_text(json.dumps(network_data))
            await asyncio.sleep(5)  # Enviar cada 5 segundos
            
    except WebSocketDisconnect:
        connected_clients.discard(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        connected_clients.discard(websocket)

async def background_monitor():
    """Tarea de fondo para monitoreo continuo"""
    while True:
        try:
            # Escanear dispositivos periódicamente
            await network_monitor.scan_devices()
            
            # Verificar amenazas de seguridad
            security_monitor.scan_threats()
            
            # Notificar a clientes conectados
            if connected_clients:
                update_data = {
                    "type": "periodic_update",
                    "devices": len(network_monitor.devices),
                    "threats": len(security_monitor.threats),
                    "timestamp": datetime.now().isoformat()
                }
                
                for client in connected_clients.copy():
                    try:
                        await client.send_text(json.dumps(update_data))
                    except:
                        connected_clients.discard(client)
            
            # Esperar intervalo configurado
            interval = config.get("network", {}).get("scan_interval", 60)
            await asyncio.sleep(interval)
            
        except Exception as e:
            logger.error(f"Error en monitoreo de fondo: {e}")
            await asyncio.sleep(10)

@app.on_event("startup")
async def startup_event():
    """Eventos de inicio de la aplicación"""
    logger.info("🚀 Iniciando Sentinel Dashboard...")
    
    # Cargar configuración
    load_config()
    
    # Crear directorios necesarios
    os.makedirs("data", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    os.makedirs("backups", exist_ok=True)
    
    # Iniciar monitoreo de fondo
    asyncio.create_task(background_monitor())
    
    logger.info("✅ Sentinel Dashboard iniciado correctamente")

@app.on_event("shutdown")
async def shutdown_event():
    """Eventos de cierre de la aplicación"""
    logger.info("🛑 Cerrando Sentinel Dashboard...")
    
    # Cerrar conexiones WebSocket
    for client in connected_clients.copy():
        try:
            await client.close()
        except:
            pass
    connected_clients.clear()
    
    logger.info("✅ Sentinel Dashboard cerrado correctamente")

if __name__ == "__main__":
    # Cargar configuración
    load_config()
    
    # Configuración del servidor
    host = config.get("application", {}).get("host", "0.0.0.0")
    port = config.get("application", {}).get("port", 8080)
    
    print(f"""
    🛡️  SENTINEL DASHBOARD
    ═══════════════════════════════════════
    
    🌐 Servidor iniciado en: http://{host}:{port}
    📊 Dashboard disponible en: http://localhost:{port}
    🔧 Configuración: config/sentinel.json
    📁 Datos: data/
    📋 Logs: logs/
    
    ═══════════════════════════════════════
    Desarrollado por YovoyTech SRL para BCR
    """)
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
