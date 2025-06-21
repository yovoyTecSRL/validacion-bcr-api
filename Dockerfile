# Imagen base con Python
FROM python:3.11-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Puerto por defecto de FastAPI
EXPOSE 8100

# Comando para arrancar la app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8100"]
