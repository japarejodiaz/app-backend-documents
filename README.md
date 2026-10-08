<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 📄 Backend de Análisis Documental
Sistema profesional de análisis documental con IA (OpenAI), análisis por reglas, extracción de texto desde PDF, consolidación de resultados y arquitectura limpia.

---

## 🚀 Tecnologías principales

- **Node.js + NestJS**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**
- **OpenAI (gpt-4o-mini)**
- **Poppler-utils** (extracción de texto PDF)
- **JWT Authentication**
- **Arquitectura Hexagonal / Clean Architecture**

---

## 📦 Requisitos del sistema

### 🔹 Node.js
Versión recomendada: **18+**

### 🔹 PostgreSQL
Versión recomendada: **14+**

### 🔹 Poppler (para extracción de texto PDF)

#### Ubuntu / Debian
```bash
sudo apt-get install poppler-utils
brew install poppler

#### Windows
```bash
Descargar desde: https://blog.alivate.com.au/poppler-windows/ (blog.alivate.com.au in Bing)
Agregar pdftotext.exe al PATH.

#### Estructura del proyecto
src/
 ├─ Application/
 │   ├─ analysis/
 │   │   ├─ run-analysis.usecase.ts
 │   │   ├─ ai-analysis.port.ts
 │   │   └─ rule-analysis.service.ts
 │   ├─ documents/
 │   └─ users/
 │
 ├─ Domain/
 │   ├─ analysis/
 │   ├─ documents/
 │   └─ users/
 │
 ├─ Infrastructure/
 │   ├─ adapters/
 │   │   ├─ openai/
 │   │   │   └─ openai.adapter.ts
 │   │   ├─ pdf/
 │   │   │   └─ poppler.adapter.ts
 │   │   └─ rule-engine/
 │   ├─ persistence/
 │   │   ├─ entities/
 │   │   └─ repositories/
 │   └─ http/
 │       ├─ controllers/
 │       └─ dto/
 │
 └─ main.ts


Arquitectura limpia basada en puertos y adaptadores.

⚙️ Variables de entorno
Crear un archivo .env:
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=documents

# JWT
JWT_SECRET=supersecretkey

# OpenAI
AI_API_KEY=tu_api_key
AI_MODEL=gpt-4o-mini

# Storage
UPLOAD_DIR=./uploads



📦 Instalación
npm install



▶️ Ejecutar en desarrollo
npm run start:dev



🧪 Scripts disponibles
"scripts": {
  "start": "nest start",
  "start:dev": "nest start --watch",
  "build": "nest build",
  "format": "prettier --write \"src/**/*.ts\"",
  "lint": "eslint \"src/**/*.ts\" --fix"
}



📄 Flujo de análisis documental
1. Subida del documento
- Se guarda en disco
- Se crea registro en DB
- Estado inicial: PENDING
2. Extracción de texto
- Usando Poppler (pdftotext)
3. Validación
- Estado debe ser OK
- Usuario debe ser dueño del documento
4. Análisis por reglas
- Extracción de entidades
- Términos técnicos
- Riesgos básicos
- Texto crudo
- Confianza estimada
5. Análisis por IA (OpenAI)
- Summary
- Keywords
- Topics
- Clauses
- Risks
- JSON limpio (sin bloques ```)
6. Consolidación
- Se combinan IA + reglas
- Se guarda en DB
7. Respuesta final
- JSON completo con ambos análisis

🔥 Endpoints principales
🔐 Autenticación
POST /auth/register
POST /auth/login


📄 Documentos
POST /documents/upload
GET  /documents
GET  /documents/:id
DELETE /documents/:id


🧠 Análisis
POST /analysis/run/:documentId
GET  /analysis/:id
GET  /analysis/document/:documentId
DELETE /analysis/:id



🧠 IA — OpenAI Adapter
Características:
- Modelo: gpt-4o-mini
- Respuesta siempre en JSON válido
- Limpieza automática de bloques ```json
- Fallback seguro si la IA falla
- Consolidación con análisis por reglas
Funciones:
- analyze(text)
- analyzeText(text)
- safeCall()
- cleanJsonResponse()

📚 Dependencias principales (package.json)
{
  "dependencies": {
    "@nestjs/common": "^10.x",
    "@nestjs/core": "^10.x",
    "@nestjs/jwt": "^10.x",
    "@nestjs/passport": "^10.x",
    "@nestjs/platform-express": "^10.x",
    "openai": "^4.x",
    "passport": "^0.7.x",
    "passport-jwt": "^4.x",
    "pg": "^8.x",
    "poppler-simple": "^1.x",
    "typeorm": "^0.3.x"
  }
}



🧩 tsconfig.json (resumen)
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist"
  }
}



🛡 Seguridad
- JWT para autenticación
- Guards para proteger endpoints
- Validación de usuario dueño del documento
- Sanitización de entrada
- IA encapsulada en adapter seguro

🧭 Roadmap
- [x] Extracción PDF
- [x] IA integrada
- [x] Análisis por reglas
- [x] Consolidación
- [x] Persistencia
- [x] Logs profesionales
- [ ] CRUD de análisis (ajustar con frontend)
- [ ] Dashboard Angular
- [ ] Roles (opcional)

👨‍💻 Autor
Jesús Parejo — Backend Architect
Sistema de análisis documental con IA + reglas.

---
