# Configuración de Google Drive API

## 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Drive API**:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google Drive API"
   - Haz clic en "Enable"

## 2. Crear Service Account

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "Service Account"
3. Completa los detalles:
   - **Name**: `wko-katas-service`
   - **Description**: `Service account for WKO Katas PWA`
4. Haz clic en "Create and Continue"
5. Asigna el rol: **Viewer** (solo lectura)
6. Haz clic en "Done"

## 3. Generar Clave JSON

1. En la lista de Service Accounts, haz clic en el que acabas de crear
2. Ve a la pestaña "Keys"
3. Haz clic en "Add Key" > "Create New Key"
4. Selecciona "JSON" y haz clic en "Create"
5. Se descargará un archivo JSON con las credenciales

## 4. Configurar Carpeta de Drive

1. Ve a [Google Drive](https://drive.google.com/)
2. Crea una carpeta para los videos (ej: "WKO Katas Videos")
3. Haz clic derecho en la carpeta > "Share"
4. Agrega el email del Service Account (está en el JSON descargado)
5. Asigna permisos de **Viewer**
6. Copia el ID de la carpeta desde la URL:
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID]
   ```

## 5. Estructura de Archivos en Drive

Organiza los videos con este formato de nombres:
```
01_Taikyoku_Sono_Ichi_Blanco.mp4
02_Taikyoku_Sono_Ni_Naranja.mp4
03_Pinan_Sono_Ichi_Azul.mp4
04_Pinan_Sono_Ni_Azul_barra_Amarillo.mp4
05_Pinan_Sono_San_Amarillo.mp4
...
```

**Formato:** `[ORDEN]_[NOMBRE_KATA]_[CINTURON].mp4`

## 6. Configurar Variables de Entorno

### Para Desarrollo Local:
Crea `.env` con:
```bash
GOOGLE_DRIVE_FOLDER_ID=tu_folder_id_aqui
'https://drive.google.com/drive/folders/1OjkYQFDL7jZ8w6ZcqVNaiPo_PrPnopp7?usp=sharing'
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"tu-proyecto",...}'
```

### Para Vercel (Producción):
1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Agrega:
   - `GOOGLE_DRIVE_FOLDER_ID`: El ID de tu carpeta
   - `GOOGLE_SERVICE_ACCOUNT_KEY`: Todo el contenido del JSON (como string)

## 7. Generar Datos

Ejecuta el script para generar `katas.json`:
```bash
npm run generate-data
```

## 8. Deploy a Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Troubleshooting

### Error: "Access denied"
- Verifica que el Service Account tenga acceso a la carpeta
- Revisa que las credenciales estén correctas

### Error: "Folder not found"
- Verifica el FOLDER_ID en las variables de entorno
- Asegúrate de que la carpeta exista y sea accesible

### Videos no se reproducen
- Verifica que los archivos sean videos válidos (.mp4, .webm, .mov)
- Revisa que los nombres sigan el formato correcto