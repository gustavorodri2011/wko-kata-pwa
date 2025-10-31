import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configuración de Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// Configurar autenticación con Service Account
const getAuth = () => {
  // Intentar usar variable de entorno primero
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
  }
  
  // Fallback a archivo local
  return new google.auth.GoogleAuth({
    keyFile: './service-account-key.json',
    scopes: SCOPES,
  });
};

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || 'YOUR_DRIVE_FOLDER_ID';

const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

// Mapeo de nombres de archivo a cinturones reales
const BELT_FILE_MAPPING = {
  'Blanco': 'Blanco',
  'Naranja': 'Naranja', 
  'Azul': 'Azul',
  'AzulAmarillo': 'Azul barra Amarillo',
  'Amarillo': 'Amarillo',
  'AmarilloVerde': 'Amarillo barra Verde',
  'Verde': 'Verde',
  'VerdeMarron': 'Verde barra Marrón',
  'Marron': 'Marrón',
  'MarronNegro': 'Marrón barra Negro',
  'Negro1Dan': 'Negro 1er DAN',
  'Negro2Dan': 'Negro 2do DAN',
  'Negro3Dan': 'Negro 3er DAN',
  'Negro4Dan': 'Negro 4to DAN'
};

const parseFileName = (fileName) => {
  // Ejemplo: "01_Taikyoku_Sono_Ichi_AzulAmarillo.mp4"
  const parts = fileName.replace('.mp4', '').split('_');
  
  if (parts.length < 4) {
    console.warn(`Formato de archivo no reconocido: ${fileName}`);
    return null;
  }

  const order = parseInt(parts[0]);
  const kataName = parts.slice(1, -1).join(' ');
  const beltFileKey = parts[parts.length - 1];
  
  // Mapear nombre de archivo a cinturón real
  const beltLevel = BELT_FILE_MAPPING[beltFileKey];
  
  if (!beltLevel) {
    console.warn(`Cinturón no reconocido: ${beltFileKey} en archivo ${fileName}`);
    return null;
  }

  let category = 'Básicos';
  if (beltLevel.includes('Verde') || beltLevel.includes('Marrón')) {
    category = 'Avanzados';
  } else if (beltLevel.includes('Negro')) {
    category = 'Superiores';
  }

  return {
    order,
    kataName,
    beltLevel,
    category
  };
};

const generateKatasData = async () => {
  try {
      console.log('Iniciando generación de datos...');
    
    if (FOLDER_ID === 'YOUR_DRIVE_FOLDER_ID') {
      throw new Error('Por favor configura GOOGLE_DRIVE_FOLDER_ID en las variables de entorno');
    }
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !require('fs').existsSync('./service-account-key.json')) {
      throw new Error('Falta GOOGLE_SERVICE_ACCOUNT_KEY o service-account-key.json');
    }
    
    console.log('Conectando a Google Drive API...');
    
    // Listar archivos en la carpeta
    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and mimeType contains 'video/'`,
      fields: 'files(id, name, webViewLink)',
      orderBy: 'name'
    });

    const files = response.data.files;
    console.log(`Encontrados ${files.length} archivos de video`);

    const katas = [];

    for (const file of files) {
      const metadata = parseFileName(file.name);
      
      if (!metadata) continue;

      const kata = {
        id: file.id,
        kataName: metadata.kataName,
        beltLevel: metadata.beltLevel,
        driveId: file.id,
        driveUrl: file.webViewLink,
        category: metadata.category,
        order: metadata.order,
        description: `Kata ${metadata.kataName} para cinturón ${metadata.beltLevel}`
      };

      katas.push(kata);
    }

    // Ordenar por cinturón y orden
    katas.sort((a, b) => {
      if (a.beltLevel !== b.beltLevel) {
        return a.beltLevel.localeCompare(b.beltLevel);
      }
      return a.order - b.order;
    });

    // Guardar en archivo JSON
    const outputPath = path.join(process.cwd(), 'public', 'katas.json');
    await fs.writeFile(outputPath, JSON.stringify(katas, null, 2));

    console.log(`Generados ${katas.length} katas en ${outputPath}`);
    
    // Mostrar resumen por cinturón
    const summary = katas.reduce((acc, kata) => {
      acc[kata.beltLevel] = (acc[kata.beltLevel] || 0) + 1;
      return acc;
    }, {});

    console.log('\nResumen por cinturón:');
    Object.entries(summary).forEach(([belt, count]) => {
      console.log(`  ${belt}: ${count} katas`);
    });

  } catch (error) {
    console.error('Error generando datos:', error);
    process.exit(1);
  }
};

// Ejecutar directamente
generateKatasData().catch(console.error);