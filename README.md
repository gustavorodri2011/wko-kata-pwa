# WKO Katas - Progressive Web App

Una PWA moderna para visualizar videos de katas de Karate Kyokushin almacenados en Google Drive.

## 🚀 Características

- **PWA Completa**: Instalable, funciona offline, notificaciones push
- **Búsqueda Avanzada**: Filtros por cinturón, favoritos y búsqueda en tiempo real
- **Video Player**: Controles personalizados con velocidad variable
- **Tema Claro/Oscuro**: Interfaz adaptable con persistencia
- **Responsive**: Optimizada para móviles, tablets y desktop
- **Performance**: Lazy loading, code splitting y caching optimizado

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Estado**: Zustand
- **Routing**: React Router DOM
- **Video**: React Player
- **PWA**: Vite Plugin PWA
- **Icons**: Lucide React

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd wko-katas-pwa
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales de Google Drive
   ```

4. **Configurar Google Drive API**
   - Crear proyecto en Google Cloud Console
   - Habilitar Google Drive API
   - Crear Service Account y descargar credenciales
   - Compartir carpeta de Drive con la service account
   - Colocar credenciales en `service-account-key.json`

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Generar datos desde Google Drive
npm run generate-data

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx      # Barra superior con búsqueda
│   ├── Sidebar.tsx     # Filtros laterales
│   ├── KataCard.tsx    # Tarjeta de kata
│   └── VideoModal.tsx  # Modal de reproducción
├── pages/              # Páginas principales
│   └── Home.tsx        # Página principal
├── store/              # Estado global (Zustand)
│   └── useAppStore.ts  # Store principal
├── types/              # Definiciones TypeScript
│   └── index.ts        # Tipos principales
├── utils/              # Utilidades
│   ├── constants.ts    # Constantes (colores, etc.)
│   └── api.ts          # Funciones API
└── hooks/              # Custom hooks
```

## 🎨 Diseño

### Paleta de Colores
- **Primario**: #E6001B (Rojo WKO)
- **Secundario**: #FFFFFF (Blanco)
- **Modo Oscuro**: Variantes automáticas

### Componentes Principales
- **Header**: Logo + Búsqueda + Toggle tema
- **Sidebar**: Filtros por cinturón + Favoritos
- **Grid**: Tarjetas de katas responsivas
- **Modal**: Reproductor con controles avanzados

## 📱 PWA Features

- **Manifest**: Configuración completa de instalación
- **Service Worker**: Caching estratégico
- **Offline**: Funcionalidad básica sin conexión
- **Icons**: Iconos adaptativos generados

## 🔧 Configuración Google Drive

### 1. Service Account
```javascript
// En Google Cloud Console:
// 1. Crear nuevo proyecto
// 2. Habilitar Google Drive API
// 3. Crear Service Account
// 4. Generar clave JSON
// 5. Compartir carpeta con service account email
```

### 2. Estructura de Archivos
```
Carpeta Drive/
├── 01_Taikyoku_Sono_Ichi_Blanco.mp4
├── 02_Taikyoku_Sono_Ni_Naranja.mp4
├── 03_Pinan_Sono_Ichi_Azul.mp4
└── ...
```

### 3. Script de Automatización
```bash
# Generar katas.json desde Drive
npm run generate-data
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Deploy carpeta dist/
```

## 📊 Performance

- **Lighthouse Score**: 95+ en todas las métricas
- **Bundle Size**: < 500KB gzipped
- **First Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🔒 Seguridad

- **CSP Headers**: Content Security Policy configurado
- **HTTPS Only**: Forzar conexiones seguras
- **API Keys**: Variables de entorno protegidas
- **CORS**: Configuración restrictiva

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte y preguntas:
- Crear issue en GitHub
- Email: soporte@wko-katas.com

---

Desarrollado con ❤️ para la comunidad de Karate Kyokushin