# Apps Script Deployment Checklist

## Step 1: Set Up the Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1kppk_NJn7U3xdj1yYGPPsGiHS1LXCVTv7HldkyJbHlo/edit
2. Make sure you have a sheet named exactly **"Free Job Ad"** (case sensitive)
3. Make sure Row 1 has these headers:
   ```
   timestamp | company_name | email | phone_number | hiring_status | click_register_pop_up_after_submit | click_login_pop_up_after_submit
   ```

4. Go to **Extensions > Apps Script**
5. Delete any existing code
6. Copy the code from `SIMPLE_APPS_SCRIPT.gs` and paste it
7. Click **Save** (disk icon)
8. Name the project "Free Job Ad Submission Handler"

## Step 2: Test the Script

1. In Apps Script editor, select the **testDoPost** function from the dropdown
2. Click **Run** (play button)
3. Grant permissions when prompted (you may see security warnings - click Advanced and proceed)
4. Check the execution log - you should see `{"success":true}`
5. Check your "Free Job Ad" sheet - you should see a test row added

## Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: "Free Job Ad Form Handler"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. **Copy the Web app URL** - it should look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 4: Add URL to Environment Variables

1. In v0, go to the sidebar
2. Click **Vars** (environment variables)
3. Add a new variable:
   - **Key**: `VITE_GOOGLE_APPS_SCRIPT_URL`
   - **Value**: (paste the Web app URL you copied)
4. Save

## Step 5: Test the Form

1. Fill out the form on your website
2. Submit it
3. Open your browser console (F12) and look for logs starting with `[v0]`
4. Check your Google Sheet - the data should appear within a few seconds

## Troubleshooting

### Bad Gateway Error
- **Cause**: Apps Script URL is wrong or not deployed
- **Fix**: Verify the URL in environment variables matches the deployment URL exactly

### No Data in Sheet
- **Cause**: Script is writing to wrong sheet or has errors
- **Fix**: Run `testDoPost()` function and check execution logs for errors

### Console Shows "VITE_GOOGLE_APPS_SCRIPT_URL not set"
- **Cause**: Environment variable not configured
- **Fix**: Add the variable in v0's Vars section and make sure it starts with `VITE_`

### Permission Errors
- **Cause**: Apps Script needs authorization
- **Fix**: Run the test function and grant permissions when prompted

## Need to Update the Script?

If you modify the Apps Script code:
1. Save the changes in Apps Script editor
2. Go to **Deploy > Manage deployments**
3. Click the pencil icon ✏️ to edit
4. Change **Version** to "New version"
5. Click **Deploy**
6. The URL stays the same, no need to update environment variables
