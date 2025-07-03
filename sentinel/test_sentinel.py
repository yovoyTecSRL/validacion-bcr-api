#!/usr/bin/env python3
"""
Tests para Sentinel Dashboard
"""

import unittest
import asyncio
import json
from unittest.mock import Mock, patch
from pathlib import Path
import sys

# Agregar el directorio padre al path para importar app
sys.path.append(str(Path(__file__).parent))

try:
    from app import NetworkMonitor, SecurityMonitor, app
    from fastapi.testclient import TestClient
except ImportError as e:
    print(f"Error importando módulos: {e}")
    print("Ejecute: pip install -r requirements.txt")
    sys.exit(1)

class TestNetworkMonitor(unittest.TestCase):
    """Tests para NetworkMonitor"""
    
    def setUp(self):
        self.monitor = NetworkMonitor()
    
    def test_init(self):
        """Test inicialización del monitor"""
        self.assertIsInstance(self.monitor.devices, list)
        self.assertIsInstance(self.monitor.network_stats, dict)
        self.assertIsInstance(self.monitor.security_events, list)
    
    async def test_scan_devices(self):
        """Test escaneo de dispositivos"""
        devices = await self.monitor.scan_devices()
        self.assertIsInstance(devices, list)
        self.assertGreater(len(devices), 0)
        
        # Verificar estructura del dispositivo
        device = devices[0]
        required_fields = ['ip', 'mac', 'name', 'type', 'status']
        for field in required_fields:
            self.assertIn(field, device)
    
    async def test_ping_host(self):
        """Test ping a host"""
        result = await self.monitor.ping_host("google.com")
        self.assertIsInstance(result, dict)
        self.assertIn('host', result)
        self.assertIn('latency', result)
        self.assertIn('status', result)
        self.assertEqual(result['host'], "google.com")
    
    def test_get_network_stats(self):
        """Test obtener estadísticas de red"""
        stats = self.monitor.get_network_stats()
        self.assertIsInstance(stats, dict)
        required_stats = ['packets_in', 'packets_out', 'bytes_in', 'bytes_out']
        for stat in required_stats:
            self.assertIn(stat, stats)

class TestSecurityMonitor(unittest.TestCase):
    """Tests para SecurityMonitor"""
    
    def setUp(self):
        self.monitor = SecurityMonitor()
    
    def test_init(self):
        """Test inicialización del monitor de seguridad"""
        self.assertIsInstance(self.monitor.threats, list)
        self.assertIsInstance(self.monitor.firewall_stats, dict)
    
    def test_scan_threats(self):
        """Test escaneo de amenazas"""
        threats = self.monitor.scan_threats()
        self.assertIsInstance(threats, list)
    
    def test_get_firewall_stats(self):
        """Test obtener estadísticas del firewall"""
        stats = self.monitor.get_firewall_stats()
        self.assertIsInstance(stats, dict)
        self.assertIn('blocked_connections', stats)
        self.assertIn('active_rules', stats)
        self.assertIn('status', stats)

class TestAPIEndpoints(unittest.TestCase):
    """Tests para endpoints de la API"""
    
    def setUp(self):
        self.client = TestClient(app)
    
    def test_health_check(self):
        """Test endpoint de health check"""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("timestamp", data)
        self.assertIn("version", data)
    
    def test_overview_endpoint(self):
        """Test endpoint de overview"""
        response = self.client.get("/api/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        required_fields = [
            'internet_status', 'router_status', 'proxy_status', 
            'threats_blocked', 'lan_devices'
        ]
        for field in required_fields:
            self.assertIn(field, data)
    
    def test_devices_endpoint(self):
        """Test endpoint de dispositivos"""
        response = self.client.get("/api/network/devices")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("devices", data)
        self.assertIn("total", data)
        self.assertIn("online", data)
        self.assertIsInstance(data["devices"], list)
    
    def test_ping_endpoint(self):
        """Test endpoint de ping"""
        response = self.client.get("/api/network/ping?host=google.com")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("host", data)
        self.assertIn("latency", data)
        self.assertIn("status", data)
    
    def test_ping_endpoint_without_host(self):
        """Test endpoint de ping sin parámetro host"""
        response = self.client.get("/api/network/ping")
        self.assertEqual(response.status_code, 400)
    
    def test_network_stats_endpoint(self):
        """Test endpoint de estadísticas de red"""
        response = self.client.get("/api/network/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        required_stats = ['packets_in', 'packets_out', 'bytes_in', 'bytes_out']
        for stat in required_stats:
            self.assertIn(stat, data)
    
    def test_threats_endpoint(self):
        """Test endpoint de amenazas"""
        response = self.client.get("/api/security/threats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("threats", data)
        self.assertIn("total", data)
        self.assertIn("critical", data)
    
    def test_firewall_endpoint(self):
        """Test endpoint de firewall"""
        response = self.client.get("/api/security/firewall")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("blocked_connections", data)
        self.assertIn("active_rules", data)
        self.assertIn("status", data)
    
    def test_scan_network_endpoint(self):
        """Test endpoint de escaneo de red"""
        response = self.client.post("/api/network/scan")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "completed")
        self.assertIn("devices_found", data)
        self.assertIn("threats_detected", data)

class TestConfiguration(unittest.TestCase):
    """Tests para configuración"""
    
    def test_config_file_exists(self):
        """Test que el archivo de configuración existe"""
        config_path = Path(__file__).parent / "config" / "sentinel.json"
        if config_path.exists():
            with open(config_path, 'r') as f:
                config = json.load(f)
                self.assertIsInstance(config, dict)
                self.assertIn("application", config)

class TestUtilities(unittest.TestCase):
    """Tests para funciones utilitarias"""
    
    def test_device_icon_mapping(self):
        """Test mapeo de iconos de dispositivos"""
        from app import NetworkMonitor
        monitor = NetworkMonitor()
        
        # Mock del método getDeviceIcon si existe
        device_types = ['router', 'switch', 'firewall', 'computer', 'laptop']
        for device_type in device_types:
            # Este test asume que existe un método para obtener iconos
            # Se puede adaptar según la implementación real
            pass

def run_async_test(coro):
    """Helper para ejecutar tests asíncronos"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()

class AsyncTestCase(unittest.TestCase):
    """Clase base para tests asíncronos"""
    
    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
    
    def tearDown(self):
        self.loop.close()
    
    def async_test(self, coro):
        return self.loop.run_until_complete(coro)

class TestAsyncFunctionality(AsyncTestCase):
    """Tests para funcionalidad asíncrona"""
    
    def test_async_device_scan(self):
        """Test escaneo asíncrono de dispositivos"""
        monitor = NetworkMonitor()
        devices = self.async_test(monitor.scan_devices())
        self.assertIsInstance(devices, list)
    
    def test_async_ping(self):
        """Test ping asíncrono"""
        monitor = NetworkMonitor()
        result = self.async_test(monitor.ping_host("localhost"))
        self.assertIsInstance(result, dict)

def run_performance_tests():
    """Tests de rendimiento básicos"""
    import time
    
    print("🔬 Ejecutando tests de rendimiento...")
    
    # Test velocidad de escaneo de dispositivos
    monitor = NetworkMonitor()
    start_time = time.time()
    
    async def performance_test():
        devices = await monitor.scan_devices()
        return len(devices)
    
    devices_count = run_async_test(performance_test())
    end_time = time.time()
    
    scan_time = end_time - start_time
    print(f"✅ Escaneo de {devices_count} dispositivos: {scan_time:.2f}s")
    
    # Test velocidad de ping
    start_time = time.time()
    result = run_async_test(monitor.ping_host("google.com"))
    ping_time = time.time() - start_time
    
    print(f"✅ Ping a Google: {ping_time:.2f}s (latencia: {result.get('latency', 'N/A')})")

def run_integration_tests():
    """Tests de integración"""
    print("🔗 Ejecutando tests de integración...")
    
    client = TestClient(app)
    
    # Test flujo completo
    print("  - Verificando health check...")
    health_response = client.get("/health")
    assert health_response.status_code == 200
    
    print("  - Obteniendo overview...")
    overview_response = client.get("/api/overview")
    assert overview_response.status_code == 200
    
    print("  - Escaneando dispositivos...")
    devices_response = client.get("/api/network/devices")
    assert devices_response.status_code == 200
    
    print("  - Ejecutando escaneo manual...")
    scan_response = client.post("/api/network/scan")
    assert scan_response.status_code == 200
    
    print("✅ Tests de integración completados")

if __name__ == "__main__":
    print("🧪 SENTINEL DASHBOARD - SUITE DE TESTS")
    print("=" * 50)
    
    # Ejecutar tests unitarios
    print("📋 Ejecutando tests unitarios...")
    unittest.main(argv=[''], exit=False, verbosity=2)
    
    # Ejecutar tests de rendimiento
    run_performance_tests()
    
    # Ejecutar tests de integración
    run_integration_tests()
    
    print("\n🎉 Todos los tests completados!")
    print("📊 Para ver cobertura de código, ejecute:")
    print("   pip install coverage")
    print("   coverage run test_sentinel.py")
    print("   coverage report -m")
