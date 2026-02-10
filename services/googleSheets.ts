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
  try {
    console.log('[v0] Calling API with data:', data);
    console.log('[v0] API endpoint: /api/google-sheets');
    
    const response = await fetch('/api/google-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('[v0] Response status:', response.status);
    console.log('[v0] Response ok:', response.ok);

    const responseText = await response.text();
    console.log('[v0] Response body:', responseText);

    if (!response.ok) {
      console.error('[v0] Failed to append to sheet. Status:', response.status, 'Body:', responseText);
      
      let errorMessage = 'Unknown error';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || responseText;
      } catch {
        errorMessage = responseText || `HTTP ${response.status}`;
      }
      
      alert(`Failed to submit to Google Sheets:\n\nStatus: ${response.status}\nError: ${errorMessage}`);
      return false;
    }

    try {
      const result = JSON.parse(responseText);
      console.log('[v0] Successfully appended to sheet:', result);
      
      if (result.success === false) {
        alert(`Google Sheets API returned error: ${result.error}`);
        return false;
      }
      
      return true;
    } catch (parseError) {
      console.error('[v0] Error parsing response:', parseError);
      alert(`Error parsing API response: ${parseError}`);
      return false;
    }
  } catch (error) {
    console.error('[v0] Error appending to sheet:', error);
    alert(`Network error: ${error}`);
    return false;
  }
}
