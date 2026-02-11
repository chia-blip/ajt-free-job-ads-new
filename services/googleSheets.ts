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
  
  console.log('[v0] Calling Apps Script with data:', data);
  console.log('[v0] Apps Script URL:', APPS_SCRIPT_URL);
  
  try {
    // Apps Script web apps work best with form data or query params
    // Create URL with query parameters as fallback method
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
      params.append(key, String(data[key as keyof SheetData]));
    });
    
    console.log('[v0] Sending request...');
    
    // Try POST with form data
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors for POST
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    console.log('[v0] Request sent (no-cors mode - cannot read response)');
    
    // With no-cors, we can't check the response, but if no error was thrown, consider it successful
    console.log('[v0] Assuming success - data sent to Google Sheets');
    
    // Wait a bit to ensure the request completes
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
    
  } catch (error) {
    console.error('[v0] Network error:', error);
    
    // Try GET fallback with query params
    console.log('[v0] Trying GET fallback method...');
    try {
      const params = new URLSearchParams();
      Object.keys(data).forEach(key => {
        params.append(key, String(data[key as keyof SheetData]));
      });
      
      const getUrl = `${APPS_SCRIPT_URL}?${params.toString()}`;
      console.log('[v0] GET URL:', getUrl);
      
      await fetch(getUrl, {
        method: 'GET',
        mode: 'no-cors',
      });
      
      console.log('[v0] GET request sent successfully');
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
      
    } catch (fallbackError) {
      console.error('[v0] Both POST and GET failed:', fallbackError);
      alert(`Failed to submit to Google Sheets. Please check:\n1. Apps Script URL is correct\n2. Script is deployed as web app\n3. Access is set to "Anyone"`);
      return false;
    }
  }
}
