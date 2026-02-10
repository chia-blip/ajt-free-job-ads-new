import type { VercelRequest, VercelResponse } from '@vercel/node';

const SPREADSHEET_ID = '1kppk_NJn7U3xdj1yYGPPsGiHS1LXCVTv7HldkyJbHlo';
const SHEET_NAME = 'Free Job Ad';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Create JWT and get access token
async function getAccessToken(): Promise<string> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google credentials');
  }

  // Create JWT header and claim
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: clientEmail,
    scope: SCOPES.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  // Base64url encode
  const base64urlEncode = (obj: object) => {
    const str = JSON.stringify(obj);
    const base64 = Buffer.from(str).toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const headerEncoded = base64urlEncode(header);
  const claimEncoded = base64urlEncode(claim);
  const signatureInput = `${headerEncoded}.${claimEncoded}`;

  // Sign with private key
  const crypto = await import('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey, 'base64');
  const signatureEncoded = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const jwt = `${signatureInput}.${signatureEncoded}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Find row by email AND phone number to prevent duplicates
async function findRowByEmailAndPhone(accessToken: string, email: string, phone: string): Promise<number | null> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:G`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const rows = data.values || [];
  
  // Find row with matching email AND phone number
  // email is column C (index 2), phone is column D (index 3)
  console.log('[v0] Searching for email:', email, 'phone:', phone);
  console.log('[v0] Total rows to search:', rows.length);
  
  for (let i = 1; i < rows.length; i++) { // Start at 1 to skip header
    const rowEmail = (rows[i][2] || '').trim(); // Column C
    const rowPhone = (rows[i][3] || '').trim(); // Column D
    
    console.log(`[v0] Row ${i + 1}: email="${rowEmail}" phone="${rowPhone}"`);
    
    if (rowEmail === email.trim() && rowPhone === phone.trim()) {
      console.log('[v0] MATCH FOUND at row:', i + 1);
      return i + 1; // Return 1-indexed row number
    }
  }
  
  console.log('[v0] No matching row found');
  
  return null;
}

// Get existing row data
async function getRowData(accessToken: string, rowNumber: number): Promise<string[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A${rowNumber}:G${rowNumber}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.values?.[0] || [];
}

// Update existing row (merge: only update empty cells or specific columns)
async function updateRow(accessToken: string, rowNumber: number, newData: string[]): Promise<void> {
  console.log('[v0] Fetching existing row data...');
  const existingData = await getRowData(accessToken, rowNumber);
  console.log('[v0] Existing row data:', existingData);
  
  // Merge logic: 
  // - Always update timestamp (column A / index 0)
  // - Update click columns (F-G: click_register_pop_up_after_submit, click_login_pop_up_after_submit) - keep "yes" if already set
  // - For other columns: only fill if currently empty
  const mergedData = newData.map((newValue, index) => {
    const existingValue = existingData[index] || '';
    
    // Always update timestamp
    if (index === 0) {
      return newValue;
    }
    
    // Click tracking columns (F-G: indices 5-6) - keep "yes" if already set
    if (index >= 5 && index <= 6) {
      return existingValue === 'yes' ? 'yes' : newValue;
    }
    
    // For all other columns: keep existing value if not empty, otherwise use new value
    return existingValue ? existingValue : newValue;
  });
  
  console.log('[v0] Merged row data:', mergedData);
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A${rowNumber}:G${rowNumber}?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [mergedData],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update row: ${errorText}`);
  }
  
  console.log('[v0] Row updated successfully');
}

// Append new row to Google Sheet
async function appendToSheet(accessToken: string, rowData: string[]): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:G:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [rowData],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to append to sheet: ${errorText}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  console.log('[v0] API route called');

  try {
    const data = req.body;
    console.log('[v0] Received data:', JSON.stringify(data));

    // Check environment variables
    const hasEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const hasKey = !!process.env.GOOGLE_PRIVATE_KEY;
    console.log('[v0] Has service account email:', hasEmail);
    console.log('[v0] Has private key:', hasKey);

    if (!hasEmail || !hasKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Google credentials. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.',
      });
    }

    // Get access token
    console.log('[v0] Getting access token...');
    const accessToken = await getAccessToken();
    console.log('[v0] Got access token');

    // Prepare row data matching the headers (A-G)
    // Headers: timestamp, company_name, email, phone_number, hiring_status, click_register_pop_up_after_submit, click_login_pop_up_after_submit
    const rowData = [
      data.timestamp || new Date().toISOString(),               // A: timestamp
      data.company_name || '',                                   // B: company_name
      data.email || '',                                          // C: email (unique key 1)
      data.phone_number || '',                                   // D: phone_number (unique key 2)
      data.hiring_status || '',                                  // E: hiring_status
      data.click_register_pop_up_after_submit || 'no',          // F: click_register_pop_up_after_submit
      data.click_login_pop_up_after_submit || 'no',             // G: click_login_pop_up_after_submit
    ];
    console.log('[v0] Row data prepared');

    // Check if row exists for this email AND phone number
    console.log('[v0] Checking for existing row by email and phone...');
    const existingRow = await findRowByEmailAndPhone(accessToken, data.email, data.phone_number);
    
    if (existingRow) {
      // Update existing row
      console.log('[v0] Found existing row:', existingRow, '- Updating...');
      await updateRow(accessToken, existingRow, rowData);
      console.log('[v0] Successfully updated row');
    } else {
      // Append new row
      console.log('[v0] No existing row found - Appending new row...');
      await appendToSheet(accessToken, rowData);
      console.log('[v0] Successfully appended to sheet');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[v0] Error submitting to Google Sheets:', error);
    return res.status(500).json({
      success: false,
      error: String(error),
    });
  }
}
