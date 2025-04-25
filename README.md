#  Gestor de Tareas Fullstack (Flask + React)

Este es un proyecto web **fullstack** que permite a los usuarios registrarse, iniciar sesión y gestionar sus tareas de forma segura. El backend está desarrollado en **Flask (Python)** y el frontend en **React (JavaScript)**. Ambos se comunican mediante una API REST protegida con autenticación JWT en cookies.


## 🚀 Tecnologías utilizadas

### Backend (Flask)
- Python 3.10+
- Flask
- Flask-JWT-Extended
- Flask-CORS
- Flask-SQLAlchemy
- PyJWT
- SQLite

### Frontend (React)
- React
- React Router DOM
- Axios
- Bootstrap o Tailwind CSS (opcional)

---

## 🔐 Funcionalidades

- Registro y login de usuarios
- Autenticación mediante JWT en cookies seguras
- CRUD completo de tareas personales
- Base de datos SQLite persistente
- API REST protegida con rutas privadas

---

## 🧪 Cómo ejecutar el proyecto localmente

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/aprenderFullStack.git
cd aprenderFullStack

2. Backend - Flask

cd backend
python -m venv venv
source venv/bin/activate   # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

Esto levantará el servidor backend en http://localhost:5000

3. Frontend - React

En otra terminal:

cd frontend
npm install
npm start

Esto levantará el frontend en http://localhost:3000 y se conectará con el backend automáticamente.