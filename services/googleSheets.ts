export interface SheetData {
  timestamp: string;
  company_name: string;
  email: string;
  phone_number: string;
  hiring_status: string;
  click_register_pop_up_after_submit: string;
  click_login_pop_up_after_submit: string;
}

export async function appendToSheet(data: SheetData): Promise<boolean> {
  // Get the Apps Script URL from environment variable or use a placeholder
  const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
  
  if (!APPS_SCRIPT_URL) {
    console.error('[v0] VITE_GOOGLE_APPS_SCRIPT_URL not set');
    alert('Google Apps Script URL is not configured. Please set VITE_GOOGLE_APPS_SCRIPT_URL environment variable.');
    return false;
  }
  
  try {
    console.log('[v0] Calling Apps Script with data:', data);
    console.log('[v0] Apps Script URL:', APPS_SCRIPT_URL);
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors mode
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('[v0] Response received (no-cors mode)');
    
    // With no-cors mode, we can't read the response, but no error means success
    console.log('[v0] Successfully sent to Google Sheets');
    return true;
    
  } catch (error) {
    console.error('[v0] Error sending to Google Sheets:', error);
    alert(`Network error: ${error}`);
    return false;
  }
}
