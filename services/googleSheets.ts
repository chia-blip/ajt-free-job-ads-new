export interface SheetData {
  timestamp: string;
  company_name: string;
  email: string;
  phone_number: string;
  hiring_status: string;
  click_register: string;
  click_login: string;
}

export async function appendToSheet(data: SheetData): Promise<boolean> {
  try {
    const response = await fetch('/api/google-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('[v0] Failed to append to sheet:', await response.text());
      return false;
    }

    const result = await response.json();
    console.log('[v0] Successfully appended to sheet:', result);
    return true;
  } catch (error) {
    console.error('[v0] Error appending to sheet:', error);
    return false;
  }
}
