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

    const fileResponse = await drive.files.get({
      fileId: id,
      fields: 'thumbnailLink,hasThumbnail'
    });

    const file = fileResponse.data;

    if (file.hasThumbnail && file.thumbnailLink) {
      res.status(200).json({ 
        thumbnailUrl: file.thumbnailLink,
        source: 'drive'
      });
    } else {
      res.status(404).json({ 
        error: 'No thumbnail available',
        source: 'none'
      });
    }

  } catch (error) {
    console.error('Error getting thumbnail:', error);
    res.status(500).json({ error: 'Failed to get thumbnail' });
  }
}