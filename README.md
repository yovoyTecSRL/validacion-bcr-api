Validación BCR API

Sistema automatizado de validación para solicitudes de tarjetas del Banco de Costa Rica (✨ desarrollado por YovoyTech SRL).

Este proyecto valida en tiempo real a un cliente mediante APIs de instituciones costarricenses (CCSS, Hacienda, SUGEF, Protectora, BCR), y si es aprobado:

Crea un lead en Odoo

Genera orden de entrega de tarjeta con posición GPS

Permite al usuario seleccionar su ubicación con un mapa

Integra con Traccar para rastreo y entrega

🚀 Tecnologías utilizadas

FastAPI

HTML5 + JS (Frontend con mapa y validación de formularios)

Python 3.8+

Odoo 16 Community (vía XML-RPC)

Traccar API (rastreo de ubicación por GPS)

Docker (opcional para despliegue)

⚙️ Instalación local

git clone https://github.com/YovoyTecSRL/validacion-bcr-api.git
cd validacion-bcr-api
pip install -r requirements.txt

Archivos importantes:

main.py → Lógica principal y rutas FastAPI

templates/formulario_validacion.html → Formulario web con estilo y JS

static/validacion.js → Validaciones de campos

traccar_client.py → Cliente REST para conectarse a Traccar

🔍 Endpoints principales

GET /formulario

Muestra el formulario de solicitud de tarjeta con validación visual.

POST /procesar

Procesa la solicitud, verifica APIs externas y responde si fue aprobada.

GET /rastreo

Consulta la última ubicación GPS de un dispositivo en Traccar.

Ejemplo:

/rastreo?usuario=enriquemata2@hotmail.com&clave=Services2024@&device_id=23477888&servidor=https://gps.mimoto.express

📚 Pruebas automatizadas

python -m unittest discover -s tests

Incluye pruebas para:

Cliente Traccar (tests/test_traccar_client.py)

Validaciones de formularios (pendiente incluir más casos)

🌍 Enlace a entorno en vivo (DevTunnel)

https://3p4h3r7p2-8100.use2.devtunnels.ms

Asegurate de que FastAPI esté corriendo:

uvicorn main:app --host 0.0.0.0 --port 8100 --reload

📄 Licencia

Este proyecto es propiedad de YovoyTech SRL y forma parte del sistema BABEL automatizado. Todos los derechos reservados.

