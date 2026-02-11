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
  
  console.log('[v0] Google Sheets submission starting...');
  
  if (!APPS_SCRIPT_URL) {
    console.warn('[v0] ⚠️ VITE_GOOGLE_APPS_SCRIPT_URL not configured - skipping Google Sheets sync');
    console.warn('[v0] Form data:', data);
    console.warn('[v0] To enable Google Sheets: See CODE_FOR_APPS_SCRIPT.gs and STEP_BY_STEP_FIX.md');
    return true; // Don't block form submission
  }
  
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    console.log('[v0] ✓ Data sent to Google Sheets');
    return true;
    
  } catch (error) {
    console.error('[v0] ⚠️ Google Sheets error (non-blocking):', error);
    return true; // Don't block form submission
  }
}
