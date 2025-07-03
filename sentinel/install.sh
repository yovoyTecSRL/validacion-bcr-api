#!/bin/bash

# Script de instalación para Sentinel Dashboard
# Desarrollado por YovoyTech SRL para BCR

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                      SENTINEL DASHBOARD                       ║
║                    Instalación Automática                     ║
║                                                               ║
║                  Desarrollado por YovoyTech SRL               ║
║                        Para BCR                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Verificar sistema operativo
print_step "Verificando sistema operativo..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    print_message "Sistema operativo: Linux"
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    print_message "Sistema operativo: macOS"
    OS="macos"
else
    print_error "Sistema operativo no soportado: $OSTYPE"
    exit 1
fi

# Verificar permisos de administrador
print_step "Verificando permisos..."
if [[ $EUID -eq 0 ]]; then
    print_warning "Ejecutándose como root. Se recomienda usar un usuario regular."
fi

# Verificar Python
print_step "Verificando Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_message "Python encontrado: $PYTHON_VERSION"
    
    # Verificar versión mínima (3.8)
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    
    if [[ $PYTHON_MAJOR -lt 3 ]] || [[ $PYTHON_MAJOR -eq 3 && $PYTHON_MINOR -lt 8 ]]; then
        print_error "Se requiere Python 3.8 o superior. Versión actual: $PYTHON_VERSION"
        exit 1
    fi
else
    print_error "Python 3 no encontrado. Por favor instale Python 3.8 o superior."
    exit 1
fi

# Verificar pip
print_step "Verificando pip..."
if command -v pip3 &> /dev/null; then
    print_message "pip3 encontrado"
else
    print_error "pip3 no encontrado. Instalando..."
    if [[ "$OS" == "linux" ]]; then
        sudo apt-get update && sudo apt-get install -y python3-pip
    elif [[ "$OS" == "macos" ]]; then
        curl https://bootstrap.pypa.io/get-pip.py | python3
    fi
fi

# Verificar Node.js (opcional)
print_step "Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_message "Node.js encontrado: $NODE_VERSION"
else
    print_warning "Node.js no encontrado. Algunas características avanzadas pueden no estar disponibles."
fi

# Verificar Docker (opcional)
print_step "Verificando Docker..."
if command -v docker &> /dev/null; then
    print_message "Docker encontrado"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker no encontrado. La instalación con contenedores no estará disponible."
    DOCKER_AVAILABLE=false
fi

# Crear directorio de instalación
print_step "Creando estructura de directorios..."
mkdir -p data logs backups config static/css static/js templates docs

# Crear entorno virtual
print_step "Creando entorno virtual de Python..."
python3 -m venv venv
source venv/bin/activate

# Actualizar pip
print_step "Actualizando pip..."
pip install --upgrade pip

# Instalar dependencias
print_step "Instalando dependencias de Python..."
if [[ -f "requirements.txt" ]]; then
    pip install -r requirements.txt
    print_message "Dependencias instaladas correctamente"
else
    print_warning "Archivo requirements.txt no encontrado. Instalando dependencias básicas..."
    pip install fastapi uvicorn websockets aiofiles
fi

# Instalar dependencias del sistema
print_step "Instalando dependencias del sistema..."
if [[ "$OS" == "linux" ]]; then
    if command -v apt-get &> /dev/null; then
        print_message "Instalando con apt-get..."
        sudo apt-get update
        sudo apt-get install -y nmap iputils-ping net-tools curl
    elif command -v yum &> /dev/null; then
        print_message "Instalando con yum..."
        sudo yum install -y nmap iputils net-tools curl
    fi
elif [[ "$OS" == "macos" ]]; then
    if command -v brew &> /dev/null; then
        print_message "Instalando con Homebrew..."
        brew install nmap
    else
        print_warning "Homebrew no encontrado. Algunas características pueden no funcionar."
    fi
fi

# Configurar archivo de configuración
print_step "Configurando aplicación..."
if [[ ! -f "config/sentinel.json" ]]; then
    print_message "Creando archivo de configuración..."
    cp config/sentinel.example.json config/sentinel.json 2>/dev/null || true
fi

# Configurar permisos
print_step "Configurando permisos..."
chmod +x app.py
chmod -R 755 static/
chmod -R 644 config/

# Crear servicio systemd (Linux)
if [[ "$OS" == "linux" ]] && command -v systemctl &> /dev/null; then
    print_step "Creando servicio systemd..."
    
    CURRENT_DIR=$(pwd)
    USER=$(whoami)
    
    sudo tee /etc/systemd/system/sentinel.service > /dev/null <<EOF
[Unit]
Description=Sentinel Dashboard - Monitoreo de Red
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$CURRENT_DIR
Environment=PATH=$CURRENT_DIR/venv/bin
ExecStart=$CURRENT_DIR/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable sentinel
    print_message "Servicio systemd creado y habilitado"
fi

# Crear script de inicio
print_step "Creando scripts de control..."
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando Sentinel Dashboard..."
source venv/bin/activate
python app.py
EOF

cat > stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Deteniendo Sentinel Dashboard..."
pkill -f "python app.py"
echo "✅ Sentinel Dashboard detenido"
EOF

chmod +x start.sh stop.sh

# Verificar instalación
print_step "Verificando instalación..."
source venv/bin/activate
python -c "import fastapi, uvicorn; print('✅ Dependencias principales verificadas')"

# Información final
print_message "
╔═══════════════════════════════════════════════════════════════╗
║                   INSTALACIÓN COMPLETADA                      ║
╚═══════════════════════════════════════════════════════════════╝

📁 Directorio de instalación: $(pwd)
🐍 Entorno virtual: $(pwd)/venv
📋 Configuración: $(pwd)/config/sentinel.json
📊 Dashboard: http://localhost:8080

🚀 COMANDOS DE USO:
   Iniciar aplicación:     ./start.sh
   Detener aplicación:     ./stop.sh
   Ver logs:               tail -f logs/sentinel.log

🐳 DOCKER (si está disponible):
   Construir imagen:       docker build -t sentinel .
   Ejecutar contenedor:    docker-compose up -d
   Ver logs:               docker-compose logs -f

🔧 CONFIGURACIÓN:
   1. Edite config/sentinel.json según sus necesidades
   2. Configure las credenciales de email para alertas
   3. Ajuste los rangos de red a monitorear
   4. Configure webhooks para notificaciones

⚠️  SEGURIDAD:
   - Cambie las credenciales por defecto
   - Configure firewall para el puerto 8080
   - Use HTTPS en producción
   - Revise los logs regularmente

📞 SOPORTE:
   Email: soporte@yovoytech.com
   Teléfono: +506 2234-5678
   Web: https://yovoytech.com

Desarrollado por YovoyTech SRL para BCR
"

if [[ "$DOCKER_AVAILABLE" == true ]]; then
    echo -e "${BLUE}¿Desea iniciar con Docker? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_step "Iniciando con Docker..."
        docker-compose up -d
        print_message "Sentinel Dashboard iniciado en modo Docker"
        print_message "Dashboard disponible en: http://localhost:8080"
    fi
else
    echo -e "${BLUE}¿Desea iniciar la aplicación ahora? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_step "Iniciando aplicación..."
        ./start.sh &
        sleep 3
        print_message "Sentinel Dashboard iniciado"
        print_message "Dashboard disponible en: http://localhost:8080"
    fi
fi

print_message "🎉 ¡Instalación completada exitosamente!"
