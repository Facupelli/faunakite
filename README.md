# Fauna Kite - Sitio Web Oficial

Sistema de registro de estudiantes, gestión de contenido y verificación de membresías para escuela de kite surf.

## 🚀 Características

- **Landing page multilingüe** (español/inglés) con Astro y i18n
- **Sistema de registro post-pago**: Formulario multi-paso para estudiantes
- **Generación automática de QR codes** para verificación de membresía
- **Integración con Google Sheets** para almacenamiento de datos
- **Creación automática de eventos** en Google Calendar
- **CMS con Sanity** para noticias y aliados
- **Newsletter con Sender.net** via API
- **Página de verificación**: Valida estado de membresía escaneando QR
- **Páginas dedicadas**: Servicios, Sobre Nosotros, Spot, Aliados

## 🛠️ Tecnologías

- **Framework**: Astro 4.x
- **CMS**: Sanity.io
- **Deploy**: Vercel
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Email**: Google Cloud Platform SMTP
- **Hojas de Cálculo**: Google Sheets API

## 📋 Requisitos Previos

- Node.js 18+
- Cuenta de Sanity.io con proyecto creado
- Cuenta de Vercel con acceso al proyecto
- Cuenta de Google Cloud Platform con Sheets y Calendar API habilitadas
- Cuenta de Sender.net con API key
- Dominio configurado en Cloudflare (DNS)

## 🔧 Instalación

```bash
# Clonar repositorio
git clone [repo-url]
cd fauna-kite-web

# Instalar dependencias
npm install

# Variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Desarrollo local
npm run dev

# Build para producción
npm run build
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── layouts/            # Layouts de Astro
│   ├── pages/              # Páginas y rutas
│   │   ├── [lang]/         # Rutas por idioma
│   │   │   ├── index.astro
│   │   │   ├── servicios.astro
│   │   │   ├── aliados.astro
│   │   │   └── verificar/
│   │   │       └── [id].astro  # Página de verificación QR
│   │   └── api/            # Endpoints API
│   │       ├── register.ts # Registro de estudiantes
│   │       └── verify.ts   # Verificación de membresía
│   ├── lib/
│   │   ├── sanity.ts       # Cliente Sanity
│   │   ├── sender.ts       # Cliente Sender.net
│   │   └── google.ts       # Sheets & Calendar APIs
│   └── i18n/               # Traducciones
├── sanity/
│   ├── schemaTypes/        # Esquemas: noticia, aliado
│   └── sanity.config.ts
└── public/                 # Assets estáticos
```

## 🔐 Variables de Entorno

```bash
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID="your-project-id"
PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-sanity-token"

# Sender.net
SENDER_API_KEY="your-sender-api-key"
SENDER_LIST_ID="your-list-id"

# Google Cloud
GOOGLE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n"
GOOGLE_SHEET_ID="your-sheet-id"
GOOGLE_CALENDAR_ID="your-calendar-id"

# Base URL para QR codes
PUBLIC_SITE_URL="https://yourdomain.com"
```

## 🎨 Esquemas de Sanity

### Noticia

```typescript
{
  title: { type: 'string', required: true },
  slug: { type: 'slug', required: true },
  excerpt: { type: 'text' },
  content: { type: 'array', of: [{type: 'block'}] },
  image: { type: 'image' },
  publishedAt: { type: 'datetime' },
  language: { type: 'string', options: {list: ['es', 'en']} }
}
```

### Aliado

```typescript
{
  name: { type: 'string', required: true },
  category: { type: 'string', options: {list: ['hotel', 'restaurante', 'servicio']} },
  description: { type: 'text' },
  benefits: { type: 'array', of: [{type: 'string'}] },
  contact: { type: 'string' },
  logo: { type: 'image' },
  language: { type: 'string', options: {list: ['es', 'en']} }
}
```

## 🌐 Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "vercel --prod",
    "sanity:dev": "sanity dev",
    "sanity:deploy": "sanity deploy"
  }
}
```

## 📊 Google Sheets

La hoja debe tener las siguientes columnas:

- `id` (UUID autogenerado)
- `timestamp`
- `name`
- `email`
- `course`
- `startDate`
- `endDate`
- `qrCodeUrl`
- `status` (active/expired)

## 📧 Flujo de Email

1. Usuario completa formulario de registro
2. Se genera QR con URL: `https://yourdomain.com/verify/{id}`
3. Se envía email via Gmail SMTP (GCP)
4. Adjunto: QR code PNG
5. Body: Detalles del curso + instrucciones

## 🔍 Verificación QR

La página `/verify/{id}`:

- Lee el UUID desde la URL
- Consulta Google Sheets
- Compara fechas con fecha actual
- Muestra estado: ✅ Activo / ⏳ Expirado

## 📄 Licencia

Proyecto privado - Fauna Kite Surf School

---

**versión**: 1.0.0
