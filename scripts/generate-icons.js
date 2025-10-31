// Script para generar iconos PWA desde el logo existente
// Requiere instalar: npm install sharp

import sharp from 'sharp';
import fs from 'fs';

const generateIcons = async () => {
  const logoPath = './public/images/logo_wko_kokoro.jpg';
  
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Logo no encontrado en:', logoPath);
    return;
  }

  try {
    // Generar icono 192x192
    await sharp(logoPath)
      .resize(192, 192)
      .png()
      .toFile('./public/pwa-192x192.png');
    
    // Generar icono 512x512
    await sharp(logoPath)
      .resize(512, 512)
      .png()
      .toFile('./public/pwa-512x512.png');
    
    // Generar favicon
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile('./public/favicon.png');
    
    console.log('✅ Iconos PWA generados correctamente');
    
  } catch (error) {
    console.error('❌ Error generando iconos:', error);
    console.log('💡 Instala sharp: npm install sharp');
  }
};

generateIcons();