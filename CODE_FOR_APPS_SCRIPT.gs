/**
 * GOOGLE APPS SCRIPT CODE
 * 
 * HOW TO USE:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1kppk_NJn7U3xdj1yYGPPsGiHS1LXCVTv7HldkyJbHlo/edit
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code
 * 4. Paste this ENTIRE file
 * 5. Click Save (disk icon)
 * 6. Click Deploy > New deployment
 * 7. Click "Select type" > Web app
 * 8. Settings:
 *    - Description: "Free Job Ads Form Handler"
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 9. Click Deploy
 * 10. Copy the Web app URL
 * 11. Add it to VITE_GOOGLE_APPS_SCRIPT_URL environment variable in your Vercel project
 */

const SHEET_NAME = 'Free Job Ad'; // EXACT sheet name - must match your sheet

function doPost(e) {
  try {
    // Get the spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" not found');
    }
    
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get all existing data
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    
    // Find email and phone columns
    const emailCol = headers.indexOf('email');
    const phoneCol = headers.indexOf('phone_number');
    
    // Check for duplicate (same email AND phone)
    let rowToUpdate = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][emailCol] === data.email && 
          allData[i][phoneCol] === data.phone_number) {
        rowToUpdate = i + 1; // 1-indexed
        break;
      }
    }
    
    // Prepare new row data
    const newRow = [
      data.timestamp || new Date().toISOString(),
      data.company_name || '',
      data.email || '',
      data.phone_number || '',
      data.hiring_status || '',
      data.click_register_pop_up_after_submit || 'no',
      data.click_login_pop_up_after_submit || 'no'
    ];
    
    if (rowToUpdate > 0) {
      // UPDATE existing row
      const existingRow = sheet.getRange(rowToUpdate, 1, 1, 7).getValues()[0];
      
      // Merge: keep "yes" for clicks, update timestamp
      const mergedRow = newRow.map((val, idx) => {
        if (idx === 0) return val; // Always update timestamp
        if (idx >= 5) return existingRow[idx] === 'yes' ? 'yes' : val; // Keep "yes"
        return existingRow[idx] || val; // Keep existing if not empty
      });
      
      sheet.getRange(rowToUpdate, 1, 1, 7).setValues([mergedRow]);
    } else {
      // APPEND new row
      sheet.appendRow(newRow);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - Run this to test the script
function testScript() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        company_name: 'Test Company ' + Date.now(),
        email: 'test@example.com',
        phone_number: '+60123456789',
        hiring_status: 'hiring full time & intern',
        click_register_pop_up_after_submit: 'yes',
        click_login_pop_up_after_submit: 'no'
      })
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
  Logger.log('Check the "Free Job Ad" sheet for the test entry');
}
