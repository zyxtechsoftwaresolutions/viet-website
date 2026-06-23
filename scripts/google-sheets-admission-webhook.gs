/**
 * Google Apps Script — append admission popup submissions to a spreadsheet.
 *
 * IMPORTANT: Create this script FROM your Google Sheet:
 *   Open Sheet → Extensions → Apps Script → paste this code → Save
 *
 * Setup:
 * 1. Row 1 headers: Timestamp | Name | Mobile | Email | Program | Qualification | City | District | Message
 * 2. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Copy the Web App URL (must end in /exec) into Admin → Admission Popup
 * 4. Save settings → Test spreadsheet connection
 *
 * If Google shows "unverified app": Advanced → Go to … (unsafe) → Allow
 */

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseFormUrlEncoded_(contents) {
  const params = {};
  String(contents || '')
    .split('&')
    .forEach(function (pair) {
      const idx = pair.indexOf('=');
      if (idx === -1) return;
      const key = decodeURIComponent(pair.slice(0, idx).replace(/\+/g, ' '));
      const val = decodeURIComponent(pair.slice(idx + 1).replace(/\+/g, ' '));
      if (key) params[key] = val;
    });
  return params;
}

function parseRequestData_(e) {
  if (e && e.parameter && e.parameter.data) {
    return JSON.parse(e.parameter.data);
  }

  if (e && e.postData && e.postData.contents) {
    const type = String(e.postData.type || '').toLowerCase();

    if (type.indexOf('application/json') !== -1) {
      return JSON.parse(e.postData.contents);
    }

    if (type.indexOf('application/x-www-form-urlencoded') !== -1) {
      const params = parseFormUrlEncoded_(e.postData.contents);
      if (params.data) {
        return JSON.parse(params.data);
      }
    }

    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      const params = parseFormUrlEncoded_(e.postData.contents);
      if (params.data) {
        return JSON.parse(params.data);
      }
    }
  }

  throw new Error('No data received. Redeploy the web app and use the /exec URL.');
}

function getTargetSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error(
      'Script is not linked to a spreadsheet. Open your Sheet → Extensions → Apps Script and paste this code there.'
    );
  }
  return spreadsheet.getActiveSheet();
}

function appendLeadRow_(data) {
  const sheet = getTargetSheet_();
  sheet.appendRow([
    data.created_at ? new Date(data.created_at) : new Date(),
    data.name || '',
    data.mobile || '',
    data.email || '',
    data.program || '',
    data.qualification || '',
    data.city || '',
    data.district || '',
    data.message || '',
  ]);
}

function doGet(e) {
  try {
    if (!e || !e.parameter || !e.parameter.data) {
      return jsonResponse_({
        success: false,
        error: 'Missing data parameter. Call this URL with ?data=... from the VIET website.',
      });
    }
    const data = JSON.parse(e.parameter.data);
    appendLeadRow_(data);
    return jsonResponse_({ success: true });
  } catch (err) {
    return jsonResponse_({ success: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const data = parseRequestData_(e);
    appendLeadRow_(data);
    return jsonResponse_({ success: true });
  } catch (err) {
    return jsonResponse_({ success: false, error: String(err) });
  }
}
