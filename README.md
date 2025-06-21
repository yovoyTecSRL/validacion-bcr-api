# # 🏦 Validación BCR API

Sistema automatizado de validación para solicitudes de tarjetas del Banco de Costa Rica (✨ desarrollado por **YovoyTech SRL**).

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

## 🚀 Tecnologías utilizadas

- **FastAPI** (framework backend)  
- **HTML5 + JavaScript** (formulario con validaciones y mapa)  
- **Python 3.11+**  
- **Odoo 16 Community** (vía XML-RPC)  
- **Traccar API** (ubicación GPS)  
- **Docker** (opcional para empaquetado/despliegue)  
- **GitHub Actions** (para CI/CD en Azure)

---

## ⚙️ Instalación local

```bash
git clone https://github.com/YovoyTecSRL/validacion-bcr-api.git
cd validacion-bcr-api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8100 --reload
