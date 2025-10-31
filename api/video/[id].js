import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const getAuth = () => {
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
    const drive = google.drive({ version: 'v3', auth });

    // Generar URL de descarga directa con token de acceso
    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();

    // URL directa para streaming del video
    const streamUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&access_token=${accessToken.token}`;

    res.status(200).json({ 
      url: streamUrl,
      expires: new Date(Date.now() + 3600000).toISOString() // 1 hora
    });

  } catch (error) {
    console.error('Error getting video URL:', error);
    res.status(500).json({ error: 'Failed to get video URL' });
  }
}