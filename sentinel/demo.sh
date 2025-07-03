#!/bin/bash

# Script de demostración de Sentinel Dashboard
# Ejecuta una demostración completa del sistema

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                    SENTINEL DASHBOARD                         ║
║                      DEMOSTRACIÓN                             ║
║                                                               ║
║              🛡️ Dashboard de Monitoreo de Red 🛡️              ║
║                                                               ║
║                Desarrollado por YovoyTech SRL                 ║
║                        Para BCR                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${GREEN}🚀 Iniciando demostración de Sentinel Dashboard...${NC}"

# Verificar si estamos en el directorio correcto
if [[ ! -f "sentinel_dashboard.html" ]]; then
    echo -e "${RED}❌ Error: No se encuentra sentinel_dashboard.html${NC}"
    echo -e "${YELLOW}💡 Asegúrese de ejecutar este script desde el directorio sentinel${NC}"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python 3 encontrado${NC}"

# Verificar si el entorno virtual existe
if [[ ! -d "venv" ]]; then
    echo -e "${YELLOW}📦 Creando entorno virtual...${NC}"
    python3 -m venv venv
fi

# Activar entorno virtual
echo -e "${GREEN}🔌 Activando entorno virtual...${NC}"
source venv/bin/activate

# Instalar dependencias básicas si no están instaladas
echo -e "${GREEN}📥 Verificando dependencias...${NC}"
pip install --quiet fastapi uvicorn websockets aiofiles jinja2 2>/dev/null || {
    echo -e "${YELLOW}⚠️ Instalando dependencias básicas...${NC}"
    pip install fastapi uvicorn websockets aiofiles jinja2
}

# Crear archivo de configuración básico si no existe
if [[ ! -f "config/sentinel.json" ]]; then
    echo -e "${YELLOW}⚙️ Creando configuración básica...${NC}"
    mkdir -p config
    cat > config/sentinel.json << 'EOF'
{
  "application": {
    "name": "Sentinel Dashboard Demo",
    "version": "1.0.0",
    "port": 8080,
    "host": "0.0.0.0",
    "debug": true
  },
  "network": {
    "scan_interval": 30,
    "ping_interval": 10
  },
  "dashboard": {
    "refresh_interval": 15
  }
}
EOF
fi

# Crear directorios necesarios
mkdir -p data logs backups

# Función para limpiar al salir
cleanup() {
    echo -e "\n${YELLOW}🧹 Limpiando procesos...${NC}"
    pkill -f "python.*app.py" 2>/dev/null || true
    echo -e "${GREEN}✅ Demostración finalizada${NC}"
}
trap cleanup EXIT

# Verificar si el puerto está en uso
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️ El puerto 8080 está en uso. Intentando liberar...${NC}"
    pkill -f "python.*app.py" 2>/dev/null || true
    sleep 2
fi

# Iniciar el servidor
echo -e "${GREEN}🌐 Iniciando servidor Sentinel...${NC}"
python app.py &
SERVER_PID=$!

# Esperar a que el servidor inicie
echo -e "${BLUE}⏳ Esperando que el servidor esté listo...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Servidor iniciado correctamente!${NC}"
        break
    fi
    sleep 1
done

# Verificar que el servidor está funcionando
if ! curl -s http://localhost:8080/health >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: El servidor no pudo iniciarse${NC}"
    exit 1
fi

echo -e "${GREEN}"
cat << "EOF"

╔═══════════════════════════════════════════════════════════════╗
║                     🎉 DEMO ACTIVA 🎉                        ║
╚═══════════════════════════════════════════════════════════════╝

🌐 Dashboard disponible en:
   👉 http://localhost:8080

📊 API REST disponible en:
   👉 http://localhost:8080/api/overview
   👉 http://localhost:8080/api/network/devices
   👉 http://localhost:8080/api/security/threats

🔧 Endpoints de prueba:
   👉 http://localhost:8080/health
   👉 http://localhost:8080/api/network/stats

EOF
echo -e "${NC}"

# Mostrar información de demostración
echo -e "${BLUE}📋 CARACTERÍSTICAS DE LA DEMOSTRACIÓN:${NC}"
echo "   ✅ Monitoreo de red en tiempo real"
echo "   ✅ Dashboard interactivo con gráficos"
echo "   ✅ Simulación de dispositivos de red"
echo "   ✅ Alertas de seguridad"
echo "   ✅ API REST completa"
echo "   ✅ WebSocket para datos en tiempo real"
echo ""

# Función para mostrar estadísticas en tiempo real
show_stats() {
    while true; do
        clear
        echo -e "${BLUE}📊 ESTADÍSTICAS EN TIEMPO REAL${NC}"
        echo "=================================="
        
        # Obtener datos de la API
        OVERVIEW=$(curl -s http://localhost:8080/api/overview 2>/dev/null || echo "{}")
        DEVICES=$(curl -s http://localhost:8080/api/network/devices 2>/dev/null || echo "{}")
        THREATS=$(curl -s http://localhost:8080/api/security/threats 2>/dev/null || echo "{}")
        
        echo -e "${GREEN}🌐 Estado de Internet:${NC} Conectado"
        echo -e "${GREEN}📡 Router Principal:${NC} Operativo"
        echo -e "${GREEN}🛡️ Firewall:${NC} Activo"
        echo -e "${GREEN}🔗 Proxy:${NC} Funcionando"
        echo ""
        echo -e "${BLUE}📊 Dispositivos Monitoreados:${NC}"
        echo "   - Dispositivos en línea: $(echo $DEVICES | grep -o '"online"' | wc -l || echo '4')"
        echo "   - Total de dispositivos: $(echo $DEVICES | jq '.total // 6' 2>/dev/null || echo '6')"
        echo ""
        echo -e "${YELLOW}⚠️ Seguridad:${NC}"
        echo "   - Amenazas detectadas: $(echo $THREATS | jq '.total // 0' 2>/dev/null || echo '0')"
        echo "   - Estado del sistema: SEGURO"
        echo ""
        echo -e "${GREEN}🌐 Para abrir el dashboard, visite:${NC}"
        echo -e "   ${BLUE}👉 http://localhost:8080${NC}"
        echo ""
        echo -e "${YELLOW}Presione Ctrl+C para detener la demostración${NC}"
        echo "=================================="
        
        sleep 5
    done
}

# Ofrecer abrir el navegador automáticamente
echo -e "${YELLOW}¿Desea abrir el dashboard en su navegador? (y/N)${NC}"
read -t 10 -r response || response=""
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${GREEN}🌐 Abriendo dashboard...${NC}"
    
    # Detectar sistema operativo y abrir navegador
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:8080
    elif command -v open > /dev/null; then
        open http://localhost:8080
    elif command -v start > /dev/null; then
        start http://localhost:8080
    else
        echo -e "${YELLOW}⚠️ No se pudo abrir automáticamente. Abra manualmente: http://localhost:8080${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🔄 Iniciando monitoreo en tiempo real...${NC}"
echo -e "${YELLOW}💡 Tip: Abra http://localhost:8080 en su navegador para ver el dashboard completo${NC}"
echo ""

# Mostrar estadísticas o mantener el servidor corriendo
if [[ "$1" == "--stats" ]]; then
    show_stats
else
    echo -e "${BLUE}🔄 Servidor ejecutándose... Presione Ctrl+C para detener${NC}"
    
    # Mantener el script corriendo
    while true; do
        sleep 1
        # Verificar si el servidor sigue corriendo
        if ! kill -0 $SERVER_PID 2>/dev/null; then
            echo -e "${RED}❌ El servidor se detuvo inesperadamente${NC}"
            exit 1
        fi
    done
fi
