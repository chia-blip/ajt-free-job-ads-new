# AJobThing Free Job Ads - Setup Guide

## Google Sheets Integration

This project integrates with Google Sheets to track form submissions.

### Setup Steps

1. **Google Sheets Configuration**
   - Spreadsheet ID: `1kppk_NJn7U3xdj1yYGPPsGiHS1LXCVTv7HldkyJbHlo`
   - Sheet Name: `Free Job Ad`
   - Service Account: `ajobthing-promo@christmas-promo.iam.gserviceaccount.com`

2. **Share the Spreadsheet**
   - Open your Google Spreadsheet
   - Click "Share" button
   - Add the service account email: `ajobthing-promo@christmas-promo.iam.gserviceaccount.com`
   - Give it "Editor" permissions

3. **Environment Variables**
   - `GOOGLE_PRIVATE_KEY` - Service account private key (already added to your Vercel project)
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email (already added to your Vercel project)
   - Make sure the private key is properly formatted with `\n` characters for line breaks

4. **Sheet Structure**
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
3. On form submission, data is sent to `/api/google-sheets` endpoint
4. The API authenticates with Google Sheets using JWT-based authentication
5. The API checks if an entry already exists with the same email AND phone number
6. If found, it updates the existing row (preserving click tracking - "yes" stays "yes")
7. If not found, it appends a new row to the "Free Job Ad" sheet

### Testing

After deployment, test the integration by:
1. Filling out the form
2. Clicking the Register or Login buttons
3. Submitting the form
4. Checking your Google Sheet for the new row

### Troubleshooting

If data isn't appearing in the sheet:
1. Verify the service account has Editor access to the spreadsheet
2. Check that both `GOOGLE_PRIVATE_KEY` and `GOOGLE_SERVICE_ACCOUNT_EMAIL` environment variables are set correctly
3. Look at the browser console for any error messages (prefixed with `[v0]`)
4. Check Vercel function logs for server-side errors

### Duplicate Prevention

The system prevents duplicate entries by checking both email AND phone number:
- If a user submits with the same email and phone, their existing row is updated
- Click tracking preserves "yes" values (once clicked, always marked as clicked)
- Timestamp is always updated to the latest submission time
