# 🏦 Validación BCR API + Sentinel Dashboard

Sistema automatizado de validación para solicitudes de tarjetas del Banco de Costa Rica (✨ desarrollado por **YovoyTech SRL**).

## 🏦 Sistema Principal BCR

Este proyecto valida en tiempo real a un cliente mediante APIs de instituciones costarricenses (CCSS, Hacienda, SUGEF, Protectora, BCR), y si es aprobado:

✅ Crea un lead en **Odoo**  
✅ Genera orden de entrega de tarjeta con posición **GPS**  
✅ Permite seleccionar ubicación con un **mapa interactivo**  
✅ Integra con **Traccar** para el rastreo de la tarjeta  

---

## 🔌 Instituciones conectadas vía API

- **CCSS** (Seguridad social)  
- **Ministerio de Hacienda** (Situación fiscal)  
- **SUGEF** (Riesgo financiero)  
- **Protectora de Crédito**  
- **Banco de Costa Rica** (Evaluación interna)

---

## ️ Nuevo Módulo: Sentinel Dashboard

**Sentinel** es un dashboard avanzado de monitoreo de red que se integra con el sistema BCR para proporcionar:

- **🔍 Monitoreo en Tiempo Real**: Supervisión continua de la infraestructura de red
- **🌐 Control de Conectividad**: Verificación de APIs externas (CCSS, Hacienda, BCR)
- **🔒 Seguridad Avanzada**: Detección de amenazas y análisis de firewall/proxy
- **📊 Dashboards Interactivos**: Visualización de métricas y KPIs en tiempo real
- **⚠️ Alertas Inteligentes**: Notificaciones automáticas para eventos críticos
- **📈 Reportes Automáticos**: Informes de disponibilidad y rendimiento

### 🚀 Acceso Rápido a Sentinel

```bash
# Navegar al módulo Sentinel
cd sentinel/

# Ejecutar demostración rápida
./demo.sh

# O instalación completa
./install.sh
```

**Dashboard disponible en**: http://localhost:8080

---

## 🚀 Tecnologías utilizadas

**Sistema BCR:**

- **FastAPI** (framework backend)  
- **HTML5 + JavaScript** (formulario con validaciones y mapa)  
- **Python 3.11+**  
- **Odoo 16 Community** (vía XML-RPC)  
- **Traccar API** (ubicación GPS)  
- **Docker** (opcional para empaquetado/despliegue)  
- **GitHub Actions** (para CI/CD en Azure)

---

<<<<<<< HEAD
## ⚙️ Instalación local
=======
Odoo 16 Community (vía XML-RPC)

Traccar API (rastreo de ubicación por GPS)

Docker (opcional para despliegue)

**Sentinel:**
Python 3.8+

Dash (para dashboards interactivos)

Requests (para llamadas a APIs)

SQLAlchemy (para gestión de base de datos)

Prometheus y Grafana (opcional, para monitoreo y alertas avanzadas)

⚙️ Instalación local
>>>>>>> f140457 (Actualiza el archivo deploy.yml para usar secretos de Azure y modifica main.yml para establecer el directorio de trabajo. Mejora el formulario en index.html con etiquetas for para accesibilidad.)

```bash
git clone https://github.com/YovoyTecSRL/validacion-bcr-api.git
cd validacion-bcr-api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8100 --reload
````

---

## 🧩 Archivos importantes

* `main.py` → Lógica principal y rutas FastAPI
* `templates/formulario_validacion.html` → Formulario web con estilo y JS
* `static/validacion.js` → Validaciones de campos
* `traccar_client.py` → Cliente REST para conectarse a Traccar

---

## 🔍 Endpoints principales

* `GET /formulario` → Muestra el formulario de solicitud con validación visual
* `POST /procesar` → Verifica APIs externas y determina si fue aprobado
* `GET /rastreo` → Consulta la última ubicación GPS de un dispositivo

**Ejemplo de rastreo:**

```
/rastreo?usuario=enriquemata2@hotmail.com&clave=Services2024@&device_id=23477888&servidor=https://gps.mimoto.express
```

---

## 🧪 Pruebas automatizadas

```bash
python -m unittest discover -s tests
```

Incluye:

* Pruebas para cliente Traccar → `tests/test_traccar_client.py`
* (Pendiente) Validaciones de formularios

---

## 🌍 Enlace a entorno en vivo (DevTunnel)

[https://3p4h3r7p2-8100.use2.devtunnels.ms](https://3p4h3r7p2-8100.use2.devtunnels.ms)

*Asegúrate de que FastAPI esté corriendo:*

```bash
uvicorn main:app --host 0.0.0.0 --port 8100 --reload
```



## 📄 Licencia

Este proyecto es propiedad de **YovoyTech SRL** y forma parte del sistema **BABEL automatizado**.
Todos los derechos reservados.

