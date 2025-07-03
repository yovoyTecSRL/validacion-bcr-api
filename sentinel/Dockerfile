# Dockerfile para Sentinel Dashboard
FROM python:3.11-slim

# Información del mantenedor
LABEL maintainer="YovoyTech SRL <soporte@yovoytech.com>"
LABEL description="Sentinel Dashboard - Monitoreo de Red para BCR"
LABEL version="1.0.0"

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV SENTINEL_ENV=production

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpcap-dev \
    nmap \
    iputils-ping \
    net-tools \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root
RUN groupadd -r sentinel && useradd -r -g sentinel sentinel

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Crear directorios necesarios
RUN mkdir -p data logs backups config static/css static/js templates

# Establecer permisos
RUN chown -R sentinel:sentinel /app

# Cambiar a usuario no-root
USER sentinel

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["python", "app.py"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
