# Google Apps Script Setup Guide

This guide will help you set up a Google Apps Script to receive form submissions and write them to your Google Sheet.

## Step 1: Open Your Google Sheet

1. Go to your spreadsheet: https://docs.google.com/spreadsheets/d/1kppk_NJn7U3xdj1yYGPPsGiHS1LXCVTv7HldkyJbHlo/edit
2. Make sure the sheet named "Free Job Ad" exists
3. Ensure the first row has these headers (exactly as shown):
   - A1: `timestamp`
   - B1: `company_name`
   - C1: `email`
   - D1: `phone_number`
   - E1: `hiring_status`
   - F1: `click_register_pop_up_after_submit`
   - G1: `click_login_pop_up_after_submit`

## Step 2: Create the Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste the code below:

```javascript
// Google Apps Script to handle form submissions
const SHEET_NAME = 'Free Job Ad';

function doPost(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('Received POST request');
    Logger.log('Contents: ' + e.postData.contents);
    
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // Open the spreadsheet and get the sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }
    
    // Check if entry already exists by email AND phone number
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    
    // Find column indices
    const emailCol = headers.indexOf('email');
    const phoneCol = headers.indexOf('phone_number');
    
    let existingRow = -1;
    
    // Search for existing entry (start from row 1 to skip header)
    for (let i = 1; i < values.length; i++) {
      const rowEmail = values[i][emailCol];
      const rowPhone = values[i][phoneCol];
      
      if (rowEmail === data.email && rowPhone === data.phone_number) {
        existingRow = i + 1; // Convert to 1-indexed
        Logger.log('Found existing row: ' + existingRow);
        break;
      }
    }
    
    // Prepare the row data
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
      // Update existing row
      Logger.log('Updating existing row');
      
      // Get existing data
      const existingData = sheet.getRange(existingRow, 1, 1, 7).getValues()[0];
      
      // Merge logic:
      // - Always update timestamp (index 0)
      // - Click columns (5-6): keep "yes" if already set
      // - Other columns: keep existing if not empty
      const mergedData = rowData.map((newValue, index) => {
        const existingValue = existingData[index] || '';
        
        // Always update timestamp
        if (index === 0) return newValue;
        
        // Click tracking: keep "yes" if already set
        if (index >= 5 && index <= 6) {
          return existingValue === 'yes' ? 'yes' : newValue;
        }
        
        // Other columns: keep existing if not empty
        return existingValue ? existingValue : newValue;
      });
      
      sheet.getRange(existingRow, 1, 1, 7).setValues([mergedData]);
      Logger.log('Updated row successfully');
      
    } else {
      // Append new row
      Logger.log('Appending new row');
      sheet.appendRow(rowData);
      Logger.log('Appended row successfully');
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
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
        click_login_pop_up_after_submit: 'no',
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
}
```

## Step 3: Deploy the Web App

1. Click the **Deploy** button (top right) > **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Fill in the settings:
   - **Description**: "Free Job Ad Form Submission"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (important!)
4. Click **Deploy**
5. Click **Authorize access** and grant the necessary permissions
6. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/XXXX/exec`)

## Step 4: Configure Your App

1. Add the Web app URL to your environment variables:
   - In Vercel: Go to your project settings > Environment Variables
   - Add: `VITE_GOOGLE_APPS_SCRIPT_URL` = your copied URL
2. Redeploy your app or restart your development server

## Step 5: Test

1. Test the script directly in Apps Script:
   - In the Apps Script editor, select the `testDoPost` function from the dropdown
   - Click **Run**
   - Check the **Execution log** to see if it worked
   - Verify a test row was added to your sheet

2. Test from your app:
   - Submit the form
   - Check your Google Sheet to see if the data appears

## Troubleshooting

- **Permission errors**: Make sure you authorized the script and set "Who has access" to "Anyone"
- **Sheet not found**: Verify the sheet name is exactly "Free Job Ad" (case-sensitive)
- **No data appearing**: Check the Apps Script execution logs (View > Executions) for errors
- **CORS errors in browser**: This is expected with Apps Script, data should still be submitted successfully

## How It Works

- The script receives POST requests with JSON data
- It checks if an entry with the same email AND phone number already exists
- If found, it updates the existing row (preserving "yes" values for click tracking)
- If not found, it appends a new row
- All operations are logged for debugging
