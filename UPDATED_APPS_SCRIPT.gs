// Google Apps Script - Updated to handle both POST and GET requests
// Save as "Free job ads.gs" in your Google Apps Script project

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    Logger.log('=== Request Received ===');
    Logger.log('Method: ' + (e ? (e.postData ? 'POST' : 'GET') : 'TEST'));
    
    let data = {};
    
    // Handle POST request with JSON or form data
    if (e && e.postData) {
      Logger.log('POST data type: ' + e.postData.type);
      Logger.log('POST data contents: ' + e.postData.contents);
      
      if (e.postData.type === 'application/json') {
        data = JSON.parse(e.postData.contents);
      } else if (e.postData.type === 'application/x-www-form-urlencoded') {
        // Parse form data
        const params = e.postData.contents.split('&');
        params.forEach(param => {
          const [key, value] = param.split('=');
          data[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
      } else {
        // Try parsing as JSON anyway
        try {
          data = JSON.parse(e.postData.contents);
        } catch (err) {
          Logger.log('Could not parse POST data');
        }
      }
    }
    
    // Handle GET request with query parameters
    if (e && e.parameter) {
      Logger.log('GET parameters: ' + JSON.stringify(e.parameter));
      data = e.parameter;
    }
    
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // Get the spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Free Job Ad');
    
    if (!sheet) {
      const allSheets = ss.getSheets().map(s => s.getName()).join(', ');
      throw new Error('Sheet "Free Job Ad" not found. Available: ' + allSheets);
    }
    
    Logger.log('Writing to sheet: ' + sheet.getName());
    
    // Get existing data
    const values = sheet.getDataRange().getValues();
    
    if (values.length === 0) {
      throw new Error('Sheet is empty - add headers first');
    }
    
    const headers = values[0];
    const emailCol = headers.indexOf('email');
    const phoneCol = headers.indexOf('phone_number');
    
    // Check for existing row
    let existingRow = -1;
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][emailCol]).trim() === String(data.email || '').trim() &&
          String(values[i][phoneCol]).trim() === String(data.phone_number || '').trim()) {
        existingRow = i + 1;
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
      Logger.log('Updating row: ' + existingRow);
      const existingData = sheet.getRange(existingRow, 1, 1, 7).getValues()[0];
      const mergedData = rowData.map((newVal, idx) => {
        const existingVal = existingData[idx] || '';
        if (idx === 0) return newVal;
        if (idx >= 5 && idx <= 6) return existingVal === 'yes' ? 'yes' : newVal;
        return existingVal ? existingVal : newVal;
      });
      sheet.getRange(existingRow, 1, 1, 7).setValues([mergedData]);
    } else {
      Logger.log('Appending new row');
      sheet.appendRow(rowData);
    }
    
    Logger.log('=== Success ===');
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Data saved to Free Job Ad sheet',
        row: existingRow > 0 ? existingRow : 'new'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('=== ERROR ===');
    Logger.log(error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function testScript() {
  const testEvent = {
    parameter: {
      timestamp: new Date().toISOString(),
      company_name: 'Test Company',
      email: 'test@example.com',
      phone_number: '+60123456789',
      hiring_status: 'hiring full time & intern',
      click_register_pop_up_after_submit: 'yes',
      click_login_pop_up_after_submit: 'no',
    }
  };
  
  const result = handleRequest(testEvent);
  Logger.log('Test result: ' + result.getContent());
}
