# STEP BY STEP FIX FOR BAD GATEWAY ISSUE

## Problem
- Bad gateway error when submitting form
- Data not appearing in Google Sheet

## Solution: Properly Deploy Apps Script

### Step 1: Open Your Spreadsheet
1. Go to: https://docs.google.com/spreadsheets/d/1kppk_NJn7U3xdj1yYGPPsGiHS1LXCVTv7HldkyJbHlo/edit
2. Make sure you have a sheet named **exactly** "Free Job Ad"
3. First row should have these headers (in this order):
   ```
   timestamp | company_name | email | phone_number | hiring_status | click_register_pop_up_after_submit | click_login_pop_up_after_submit
   ```

### Step 2: Open Apps Script Editor
1. In your spreadsheet, click **Extensions** > **Apps Script**
2. If there's existing code, delete it all
3. Open the file `CODE_FOR_APPS_SCRIPT.gs` in this project
4. Copy ALL the code
5. Paste it into the Apps Script editor
6. Click the **Save** icon (disk icon) or press Ctrl+S

### Step 3: Test the Script (IMPORTANT!)
1. In the Apps Script editor, find the dropdown at the top (says "Select function")
2. Select **testScript**
3. Click **Run** (play button icon)
4. If asked, click **Review permissions** > Choose your account > **Advanced** > **Go to Untitled project** > **Allow**
5. Check the **Execution log** at the bottom - should say "Data saved"
6. Open your Google Sheet - you should see a test row added!
7. If test row appears, the script works! ✓

### Step 4: Deploy as Web App
1. In Apps Script editor, click **Deploy** > **New deployment**
2. Click the **gear icon** next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: Free Job Ads Form Handler
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** (IMPORTANT!)
5. Click **Deploy**
6. **COPY THE WEB APP URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

### Step 5: Add URL to Environment Variable
1. In v0, look at the sidebar on the left
2. Click **Vars** (or **Settings**)
3. Add a new environment variable:
   - **Key**: `VITE_GOOGLE_APPS_SCRIPT_URL`
   - **Value**: (paste the Web app URL you copied)
4. Save

### Step 6: Test Your Form
1. Refresh your preview
2. Fill out the form
3. Submit
4. Check your Google Sheet - the data should appear!

## Troubleshooting

### "Bad Gateway" Error
- Make sure you deployed as "Anyone" access (not "Only myself")
- Try creating a NEW deployment instead of updating existing one
- Make sure the URL ends with `/exec` not `/dev`

### Data Not Appearing
- Check sheet name is exactly "Free Job Ad" (case sensitive)
- Check headers are in the correct order
- Run the `testScript` function again to verify script works
- Check Apps Script execution logs: View > Executions

### Still Not Working?
1. In Apps Script, go to **View** > **Executions**
2. Look for recent executions and check for errors
3. The error message will tell you exactly what's wrong
