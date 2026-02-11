// SIMPLIFIED Google Apps Script for Free Job Ad submissions
// Copy this entire code into your Google Apps Script editor

function doPost(e) {
  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Free Job Ad');
    
    if (!sheet) {
      throw new Error('Sheet "Free Job Ad" not found');
    }
    
    // Parse the incoming data
    let data;
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received');
    }
    
    // Prepare the row
    const timestamp = data.timestamp || new Date().toISOString();
    const company_name = data.company_name || '';
    const email = data.email || '';
    const phone_number = data.phone_number || '';
    const hiring_status = data.hiring_status || '';
    const click_register = data.click_register_pop_up_after_submit || 'no';
    const click_login = data.click_login_pop_up_after_submit || 'no';
    
    // Check for duplicates by email AND phone
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    let existingRow = -1;
    
    // Search starting from row 2 (skip header)
    for (let i = 1; i < values.length; i++) {
      if (values[i][2] === email && values[i][3] === phone_number) {
        existingRow = i + 1;
        break;
      }
    }
    
    const rowData = [timestamp, company_name, email, phone_number, hiring_status, click_register, click_login];
    
    if (existingRow > 0) {
      // Update existing row
      const existingData = sheet.getRange(existingRow, 1, 1, 7).getValues()[0];
      const mergedData = rowData.map((newVal, idx) => {
        const existingVal = existingData[idx] || '';
        if (idx === 0) return newVal; // Update timestamp
        if (idx >= 5) return existingVal === 'yes' ? 'yes' : newVal; // Keep "yes" for clicks
        return existingVal || newVal;
      });
      sheet.getRange(existingRow, 1, 1, 7).setValues([mergedData]);
    } else {
      // Append new row
      sheet.appendRow(rowData);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this to verify it works
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        company_name: 'Test Company',
        email: 'test@example.com',
        phone_number: '+60123456789',
        hiring_status: 'hiring full time & intern',
        click_register_pop_up_after_submit: 'yes',
        click_login_pop_up_after_submit: 'no'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
