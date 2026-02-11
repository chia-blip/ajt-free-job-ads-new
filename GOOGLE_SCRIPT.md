# Google Apps Script – Free Job Ad (Final Implementation Guide)

## IMPORTANT: Prevents Duplicate Rows

This script ensures that submissions with the same **email AND phone number** will **UPDATE the existing row** instead of creating duplicates.

---

## Spreadsheet Name

The Google Sheet **tab name MUST be exactly**:


(case-sensitive)

---

## Sheet Column Structure

Your Google Sheet must contain **ONLY these columns**, in this exact order (A–G):

| Col | Header | Description | Example |
|----|--------|-------------|---------|
| A | timestamp | Entry creation time | 2026-02-03T10:30:00Z |
| B | company_name | Company name | Tech Company Sdn Bhd |
| C | email | User email **(UNIQUE KEY 1)** | user@company.com |
| D | phone_number | Phone number **(UNIQUE KEY 2)** | +60123456789 |
| E | hiring_status | Hiring status | Actively hiring |
| F | click_register_pop_up_after_submit | Register popup clicked | yes / no |
| G | click_login_pop_up_after_submit | Login popup clicked | yes / no |

---

## Google Apps Script Code

Copy **everything below** and paste into **Apps Script Editor**.

```javascript
function doGet(e) {
  try {
    const sheet = SpreadsheetApp
      .openById('YOUR_SPREADSHEET_ID')
      .getSheetByName('Free Job Ad');

    const params = e.parameter;

    const email = params.email || '';
    const phone = params.phone_number || '';

    // Row data (A–G)
    const rowData = [
      params.timestamp || new Date().toISOString(), // A: timestamp
      params.company_name || '',                     // B: company_name
      email,                                         // C: email
      phone,                                         // D: phone_number
      params.hiring_status || '',                    // E: hiring_status
      params.click_register_pop_up_after_submit || 'no', // F
      params.click_login_pop_up_after_submit || 'no',    // G
    ];

    // Prevent duplicates using email + phone
    if (email && phone) {
      const data = sheet.getDataRange().getValues();
      let existingRow = -1;

      // C = email (index 2), D = phone (index 3)
      for (let i = 1; i < data.length; i++) {
        if (data[i][2] === email && data[i][3] === phone) {
          existingRow = i + 1;
          break;
        }
      }

      // Update existing row
      if (existingRow > 0) {
        const oldRow = sheet
          .getRange(existingRow, 1, 1, 7)
          .getValues()[0];

        const mergedRow = rowData.map((val, idx) => {
          // Always update timestamp
          if (idx === 0) return rowData[0];

          // Click tracking (F & G): once yes, always yes
          if (idx === 5 || idx === 6) {
            return oldRow[idx] === 'yes' ? 'yes' : val;
          }

          // Other fields: keep existing if not empty
          return oldRow[idx] || val;
        });

        sheet
          .getRange(existingRow, 1, 1, 7)
          .setValues([mergedRow]);

        return ContentService.createTextOutput(
          JSON.stringify({ success: true, action: 'updated', row: existingRow })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // No existing row → append new
    sheet.appendRow(rowData);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, action: 'inserted' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
