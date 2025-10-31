import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const getAuth = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
  }
  
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    const auth = getAuth();
    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();

    // Hacer fetch del video desde Google Drive
    const videoResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.token}`
        }
      }
    );

    if (!videoResponse.ok) {
      throw new Error(`Drive API error: ${videoResponse.status}`);
    }

    // Configurar headers para el video
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');

    // Obtener el content-length si está disponible
    const contentLength = videoResponse.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    // Stream el video directamente
    if (videoResponse.body) {
      const reader = videoResponse.body.getReader();
      
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(Buffer.from(value));
        return pump();
      };
      
      await pump();
    } else {
      const videoBuffer = await videoResponse.arrayBuffer();
      res.send(Buffer.from(videoBuffer));
    }

  } catch (error) {
    console.error('Error proxying video:', error);
    res.status(500).json({ error: 'Failed to proxy video' });
  }
}