# AJobThing Free Job Ads - Setup Guide

## Google Sheets Integration with Apps Script

This project uses Google Apps Script to send form submissions directly to Google Sheets.

### Quick Setup

Follow the instructions in `APPS_SCRIPT_SETUP.md` to:
1. Create a Google Apps Script web app
2. Deploy it and get the deployment URL
3. Add the URL to `VITE_GOOGLE_APPS_SCRIPT_URL` environment variable

### Sheet Structure

The first row (header) should have these columns:
- Column A: `timestamp`
- Column B: `company_name`
- Column C: `email`
- Column D: `phone_number`
- Column E: `hiring_status`
- Column F: `click_register_pop_up_after_submit`
- Column G: `click_login_pop_up_after_submit`

### How It Works

1. User fills out the form on the landing page
2. User can click "Register" or "Login" buttons (tracked as yes/no)
3. On form submission, data is sent directly to your Google Apps Script web app
4. The Apps Script checks if an entry already exists with the same email AND phone number
5. If found, it updates the existing row (preserving click tracking - "yes" stays "yes")
6. If not found, it appends a new row to the "Free Job Ad" sheet

### Testing

After deployment, test the integration by:
1. Filling out the form
2. Clicking the Register or Login buttons
3. Submitting the form
4. Checking your Google Sheet for the new row

### Troubleshooting

If data isn't appearing in the sheet:
1. Check that `VITE_GOOGLE_APPS_SCRIPT_URL` is set correctly in environment variables
2. Verify the Apps Script is deployed as a web app with "Anyone" access
3. Look at the browser console for any error messages (prefixed with `[v0]`)
4. Check the Apps Script execution logs in the Google Apps Script editor
