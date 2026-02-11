import type { VercelRequest, VercelResponse } from '@vercel/node';

const SPREADSHEET_ID = '1kppk_NJn7U3xdj1yYGPPsGiHS1LXCVTv7HldkyJbHlo';
const SHEET_NAME = 'Free Job Ad';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/* ===============================
   AUTH – GET ACCESS TOKEN
================================ */
async function getAccessToken(): Promise<string> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google credentials');
  }

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const claim = {
    iss: clientEmail,
    scope: SCOPES.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64urlEncode = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

  const headerEncoded = base64urlEncode(header);
  const claimEncoded = base64urlEncode(claim);
  const signatureInput = `${headerEncoded}.${claimEncoded}`;

  const crypto = await import('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);

  const signature = sign
    .sign(privateKey, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const jwt = `${signatureInput}.${signature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(await tokenResponse.text());
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

/* ===============================
   FIND ROW (EMAIL + PHONE)
================================ */
async function findRowByEmailAndPhone(
  accessToken: string,
  email: string,
  phone: string
): Promise<number | null> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:G`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return null;

  const rows = (await response.json()).values || [];

  for (let i = 1; i < rows.length; i++) {
    const rowEmail = (rows[i][2] || '').trim(); // C
    const rowPhone = (rows[i][3] || '').trim(); // D

    if (rowEmail === email.trim() && rowPhone === phone.trim()) {
      return i + 1; // 1-indexed
    }
  }

  return null;
}

/* ===============================
   GET ROW DATA
================================ */
async function getRowData(accessToken: string, row: number): Promise<string[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A${row}:G${row}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return [];
  return (await res.json()).values?.[0] || [];
}

/* ===============================
   UPDATE ROW
================================ */
async function updateRow(
  accessToken: string,
  row: number,
  newData: string[]
): Promise<void> {
  const existing = await getRowData(accessToken, row);

  const merged = newData.map((val, i) => {
    const old = existing[i] || '';

    // Always update timestamp
    if (i === 0) return val;

    // Click columns F & G
    if (i === 5 || i === 6) {
      return old === 'yes' ? 'yes' : val;
    }

    return old || val;
  });

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A${row}:G${row}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [merged] }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

/* ===============================
   APPEND ROW
================================ */
async function appendRow(accessToken: string, rowData: string[]): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:G:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [rowData] }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

/* ===============================
   API HANDLER
================================ */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  try {
    const accessToken = await getAccessToken();
    const data = req.body;

    const rowData = [
      data.timestamp || new Date().toISOString(), // A
      data.company_name || '',                    // B
      data.email || '',                           // C
      data.phone_number || '',                    // D
      data.hiring_status || '',                   // E
      data.click_register_pop_up_after_submit || 'no', // F
      data.click_login_pop_up_after_submit || 'no',    // G
    ];

    const existingRow = await findRowByEmailAndPhone(
      accessToken,
      data.email,
      data.phone_number
    );

    if (existingRow) {
      await updateRow(accessToken, existingRow, rowData);
    } else {
      await appendRow(accessToken, rowData);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}
