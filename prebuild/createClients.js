import { google } from 'googleapis';
import { GoogleAuth } from "google-auth-library";

export default async function createClients(credentials) {
    const scopes = [
        'https://www.googleapis.com/auth/spreadsheets', 
        'https://www.googleapis.com/auth/documents.readonly',
        'https://www.googleapis.com/auth/drive.readonly'
    ];
    const auth = new GoogleAuth({ credentials, scopes });
    const client = await auth.getClient();  

    const sheets = google.sheets({ version: 'v4', auth: client });
    const docs = google.docs({ version: 'v1', auth: client });
    const drive = google.drive({ version: 'v3', auth: client });

    return { sheets, docs, drive }
}