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
  const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
  
  console.log('[v0] === Google Sheets Submission ===');
  console.log('[v0] URL configured:', !!APPS_SCRIPT_URL);
  
  if (!APPS_SCRIPT_URL) {
    console.error('[v0] VITE_GOOGLE_APPS_SCRIPT_URL not set');
    alert('Apps Script URL not configured.\n\nFollow DEPLOYMENT_CHECKLIST.md to:\n1. Deploy Apps Script\n2. Add URL to environment variables');
    return false;
  }
  
  console.log('[v0] URL:', APPS_SCRIPT_URL);
  console.log('[v0] Data:', JSON.stringify(data, null, 2));
  
  try {
    console.log('[v0] Sending request...');
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log('[v0] Response type:', response.type);
    
    // With no-cors, we get an opaque response
    // If no error thrown, the request was sent successfully
    if (response.type === 'opaque') {
      console.log('[v0] ✓ Request sent (opaque response is normal)');
      console.log('[v0] Check your Google Sheet to confirm data');
      return true;
    }
    
    console.log('[v0] ✓ Request completed');
    return true;
    
  } catch (error) {
    console.error('[v0] ✗ Error:', error);
    console.error('[v0] Details:', error instanceof Error ? error.message : String(error));
    
    alert(`Failed to submit:\n${error instanceof Error ? error.message : String(error)}\n\nCheck:\n1. Apps Script URL is correct\n2. Apps Script is deployed\n3. Console for details`);
    return false;
  }
}
