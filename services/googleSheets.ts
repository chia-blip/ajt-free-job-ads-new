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
    
    // Use redirect: 'follow' to handle Apps Script redirects
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Apps Script prefers text/plain for CORS
      },
      body: JSON.stringify(data),
      redirect: 'follow',
    });

    console.log('[v0] Response status:', response.status);
    console.log('[v0] Response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('[v0] Response text:', responseText);
    
    if (!response.ok) {
      console.error('[v0] Failed to submit. Status:', response.status);
      alert(`Failed to submit to Google Sheets:\nStatus: ${response.status}\nResponse: ${responseText}`);
      return false;
    }
    
    try {
      const result = JSON.parse(responseText);
      if (result.success === false) {
        console.error('[v0] Apps Script returned error:', result.error);
        alert(`Google Sheets error: ${result.error}`);
        return false;
      }
      console.log('[v0] Successfully submitted to Google Sheets');
      return true;
    } catch (parseError) {
      // If response isn't JSON, assume success
      console.log('[v0] Non-JSON response, assuming success');
      return true;
    }
    
  } catch (error) {
    console.error('[v0] Error sending to Google Sheets:', error);
    alert(`Network error: ${error}`);
    return false;
  }
}
