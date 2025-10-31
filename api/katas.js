import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const getAuth = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
  }
  
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
  } catch (error) {
    throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format');
  }
};

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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      throw new Error('GOOGLE_DRIVE_FOLDER_ID not configured');
    }
    
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });
    
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'video/'`,
      fields: 'files(id, name, webViewLink)',
      orderBy: 'name'
    });

    const files = response.data.files;
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

    katas.sort((a, b) => {
      if (a.beltLevel !== b.beltLevel) {
        return a.beltLevel.localeCompare(b.beltLevel);
      }
      return a.order - b.order;
    });

    res.status(200).json(katas);
  } catch (error) {
    console.error('Error fetching katas:', error);
    res.status(500).json({ error: 'Failed to fetch katas' });
  }
}