// Google Apps Script - Save as "Free job ads.gs"
// MUST write to "Free Job Ad" sheet

function doPost(e) {
  try {
    Logger.log('=== Form Submission Received ===');
    Logger.log('Event object: ' + JSON.stringify(e));
    
    // Check if e exists
    if (!e) {
      throw new Error('Event object is undefined - check deployment settings');
    }
    
    // Check if postData exists
    if (!e.postData) {
      throw new Error('postData is undefined. Event keys: ' + Object.keys(e).join(', '));
    }
    
    Logger.log('Request data: ' + e.postData.contents);
    
    // Parse incoming data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      throw new Error('Failed to parse JSON: ' + parseError.toString());
    }
    
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // Get the ACTIVE spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log('Spreadsheet name: ' + ss.getName());
    
    // Get the "Free Job Ad" sheet specifically
    const sheet = ss.getSheetByName('Free Job Ad');
    
    if (!sheet) {
      const allSheets = ss.getSheets().map(s => s.getName()).join(', ');
      throw new Error('Sheet "Free Job Ad" not found. Available sheets: ' + allSheets);
    }
    
    Logger.log('Target sheet: ' + sheet.getName());
    
    // Get all data
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length === 0) {
      throw new Error('Sheet is empty. Please add header row: timestamp, company_name, email, phone_number, hiring_status, click_register_pop_up_after_submit, click_login_pop_up_after_submit');
    }
    
    const headers = values[0];
    Logger.log('Headers found: ' + headers.join(', '));
    
    // Find column indices
    const emailCol = headers.indexOf('email');
    const phoneCol = headers.indexOf('phone_number');
    
    if (emailCol === -1 || phoneCol === -1) {
      throw new Error('Required columns missing. Need "email" and "phone_number". Found: ' + headers.join(', '));
    }
    
    // Check for duplicate
    let existingRow = -1;
    for (let i = 1; i < values.length; i++) {
      const rowEmail = String(values[i][emailCol]).trim();
      const rowPhone = String(values[i][phoneCol]).trim();
      const dataEmail = String(data.email || '').trim();
      const dataPhone = String(data.phone_number || '').trim();
      
      if (rowEmail === dataEmail && rowPhone === dataPhone) {
        existingRow = i + 1;
        Logger.log('Found duplicate at row: ' + existingRow);
        break;
      }
    }
    
    // Prepare row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.company_name || '',
      data.email || '',
      data.phone_number || '',
      data.hiring_status || '',
      data.click_register_pop_up_after_submit || 'no',
      data.click_login_pop_up_after_submit || 'no',
    ];
    
    if (existingRow > 0) {
      // UPDATE
      Logger.log('Updating existing row ' + existingRow);
      const existingData = sheet.getRange(existingRow, 1, 1, 7).getValues()[0];
      const mergedData = rowData.map((newVal, idx) => {
        const existingVal = existingData[idx] || '';
        if (idx === 0) return newVal; // timestamp
        if (idx >= 5 && idx <= 6) return existingVal === 'yes' ? 'yes' : newVal; // clicks
        return existingVal ? existingVal : newVal;
      });
      sheet.getRange(existingRow, 1, 1, 7).setValues([mergedData]);
      Logger.log('Updated successfully');
    } else {
      // APPEND
      Logger.log('Appending new row');
      sheet.appendRow(rowData);
      Logger.log('Appended successfully');
    }
    
    Logger.log('=== SUCCESS ===');
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        sheet: sheet.getName(),
        action: existingRow > 0 ? 'updated' : 'created'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('=== ERROR ===');
    Logger.log(error.toString());
    Logger.log(error.stack);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// For GET requests - to test if deployment is working
function doGet(e) {
  Logger.log('GET request received');
  return ContentService
    .createTextOutput(JSON.stringify({ 
      message: 'Apps Script is running. Use POST to submit data.',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function
function testDoPost() {
  Logger.log('=== Running Test ===');
  
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        company_name: 'Test Company',
        email: 'test@example.com',
        phone_number: '+60123456789',
        hiring_status: 'hiring full time & intern',
        click_register_pop_up_after_submit: 'yes',
        click_login_pop_up_after_submit: 'no',
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
}
