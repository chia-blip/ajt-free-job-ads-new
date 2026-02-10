import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Google Sheets configuration
const SPREADSHEET_ID = '1kppk_NJn7U3xdj1yYGPPsGiHS1LXCVTv7HldkyJbHlo';
const SHEET_NAME = 'Free Job Ad';
const RANGE = `${SHEET_NAME}!A:G`; // Columns A through G

// Service account credentials
const CREDENTIALS = {
  type: 'service_account',
  project_id: 'christmas-promo',
  client_email: 'ajobthing-promo@christmas-promo.iam.gserviceaccount.com',
  // This should be stored as an environment variable
  private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timestamp, company_name, email, phone_number, hiring_status, click_register, click_login } = req.body;

    // Validate required fields
    if (!company_name || !email || !phone_number || !hiring_status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare the row data
    const values = [[
      timestamp || new Date().toISOString(),
      company_name,
      email,
      phone_number,
      hiring_status,
      click_register || 'no',
      click_login || 'no',
    ]];

    // Append the data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    console.log('[v0] Appended to sheet:', response.data);

    return res.status(200).json({
      success: true,
      updatedRange: response.data.updates?.updatedRange,
      updatedRows: response.data.updates?.updatedRows,
    });
  } catch (error) {
    console.error('[v0] Error appending to Google Sheets:', error);
    return res.status(500).json({
      error: 'Failed to append to sheet',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
