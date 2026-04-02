import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    // Redirect URI will be constructed dynamically
  );

  const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  // Helper to get redirect URI
  const getRedirectUri = (req: express.Request) => {
    // Priority: X-Forwarded-Host (from proxy) -> Host header
    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    // Google requires HTTPS for all non-localhost redirect URIs.
    // We force HTTPS here because the app is accessed via an HTTPS proxy.
    const protocol = 'https';
    const uri = `${protocol}://${host}/api/auth/google/callback`;
    console.log(`Generated Redirect URI: ${uri}`);
    return uri;
  };

  // 1. Get Google Auth URL
  app.get("/api/auth/google/url", (req, res) => {
    const redirectUri = getRedirectUri(req);
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      redirect_uri: redirectUri,
      prompt: 'consent',
    });
    res.json({ url, redirectUri });
  });

  // 2. Google Auth Callback
  app.get("/api/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    const redirectUri = getRedirectUri(req);

    try {
      const { tokens } = await oauth2Client.getToken({
        code: code as string,
        redirect_uri: redirectUri,
      });

      // Store tokens in a secure cookie
      res.cookie('google_tokens', JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. You can close this window.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // 3. Export to Google Sheets (Single Sheet)
  app.post("/api/google/sheets/export", async (req, res) => {
    const { title, headers, rows } = req.body;
    const tokensCookie = req.cookies['google_tokens'];

    if (!tokensCookie) {
      return res.status(401).json({ error: "Not authenticated with Google" });
    }

    try {
      const tokens = JSON.parse(tokensCookie);
      oauth2Client.setCredentials(tokens);

      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: { title: `${title} - ${new Date().toLocaleDateString()}` },
        },
      });

      const spreadsheetId = spreadsheet.data.spreadsheetId;

      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId!,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [headers, ...rows] },
      });

      res.json({ success: true, spreadsheetId, url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` });
    } catch (error) {
      console.error("Error exporting to Google Sheets:", error);
      res.status(500).json({ error: "Export failed" });
    }
  });

  // 3b. Export All to Google Sheets (Multiple Sheets)
  app.post("/api/google/sheets/export-all", async (req, res) => {
    const { projectName, datasets, spreadsheetId: existingId } = req.body;
    const tokensCookie = req.cookies['google_tokens'];

    if (!tokensCookie) {
      return res.status(401).json({ error: "Not authenticated with Google" });
    }

    try {
      const tokens = JSON.parse(tokensCookie);
      oauth2Client.setCredentials(tokens);
      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

      let spreadsheetId = existingId;

      // 1. Create new spreadsheet only if no ID provided
      if (!spreadsheetId) {
        const spreadsheet = await sheets.spreadsheets.create({
          requestBody: {
            properties: { title: `${projectName} ERP Export - ${new Date().toLocaleDateString()}` },
            sheets: datasets.map((d: any) => ({ properties: { title: d.sheetName } }))
          },
        });
        spreadsheetId = spreadsheet.data.spreadsheetId;
      }

      // 2. Get current spreadsheet to check existing sheets
      const spreadsheetRes = await sheets.spreadsheets.get({ spreadsheetId });
      const existingSheetNames = spreadsheetRes.data.sheets?.map(s => s.properties?.title) || [];

      // 3. Create missing sheets if updating existing spreadsheet
      const sheetsToCreate = datasets.filter((d: any) => !existingSheetNames.includes(d.sheetName));
      if (sheetsToCreate.length > 0) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: sheetsToCreate.map((d: any) => ({
              addSheet: { properties: { title: d.sheetName } }
            }))
          }
        });
      }

      // 4. Populate all sheets (Handling specific header rows)
      const dataToUpdate = datasets.map((d: any) => {
        // Default header row is 3 (A3), except Design Register which is 4 (A4)
        const startRow = d.sheetName === 'Design Register' ? 'A4' : 'A3';
        return {
          range: `${d.sheetName}!${startRow}`,
          values: [d.headers, ...d.rows]
        };
      });

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: spreadsheetId!,
        requestBody: {
          valueInputOption: 'RAW',
          data: dataToUpdate
        }
      });

      // 5. Format headers (Bold and Background)
      // Re-fetch to get updated sheet IDs
      const updatedSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const requests = updatedSpreadsheet.data.sheets?.map(sheet => {
        const sheetName = sheet.properties?.title;
        const startRowIndex = sheetName === 'Design Register' ? 3 : 2; // 0-indexed (Row 4 is index 3)
        
        return {
          repeatCell: {
            range: {
              sheetId: sheet.properties?.sheetId,
              startRowIndex: startRowIndex,
              endRowIndex: startRowIndex + 1
            },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 }
              }
            },
            fields: 'userEnteredFormat(textFormat,backgroundColor)'
          }
        };
      });

      if (requests && requests.length > 0) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: spreadsheetId!,
          requestBody: { requests }
        });
      }

      res.json({ success: true, spreadsheetId, url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` });
    } catch (error) {
      console.error("Error exporting all to Google Sheets:", error);
      res.status(500).json({ error: "Bulk export failed" });
    }
  });

  // 4. Import from Google Sheets (Single Sheet)
  app.post("/api/google/sheets/import", async (req, res) => {
    const { spreadsheetId, range } = req.body;
    const tokensCookie = req.cookies['google_tokens'];

    if (!tokensCookie) {
      return res.status(401).json({ error: "Not authenticated with Google" });
    }

    try {
      const tokens = JSON.parse(tokensCookie);
      oauth2Client.setCredentials(tokens);

      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: range || 'Sheet1!A1:Z100',
      });

      res.json({ success: true, values: response.data.values });
    } catch (error) {
      console.error("Error importing from Google Sheets:", error);
      res.status(500).json({ error: "Import failed" });
    }
  });

  // 5. Import ALL Sheets from Google Sheets
  app.post("/api/google/sheets/import-all", async (req, res) => {
    const { spreadsheetId } = req.body;
    const tokensCookie = req.cookies['google_tokens'];

    if (!tokensCookie) {
      return res.status(401).json({ error: "Not authenticated with Google" });
    }

    try {
      const tokens = JSON.parse(tokensCookie);
      oauth2Client.setCredentials(tokens);
      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

      // 1. Get spreadsheet metadata to find all sheet names
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      const sheetNames = spreadsheet.data.sheets?.map(s => s.properties?.title).filter(Boolean) as string[];
      
      if (!sheetNames || sheetNames.length === 0) {
        return res.status(404).json({ error: "No sheets found in spreadsheet" });
      }

      // 2. Batch get all values
      const response = await sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges: sheetNames.map(name => `${name}!A1:Z500`),
      });

      const allData: Record<string, any[][]> = {};
      response.data.valueRanges?.forEach((vr, index) => {
        const name = sheetNames[index];
        allData[name] = vr.values || [];
      });

      res.json({ success: true, allData });
    } catch (error) {
      console.error("Error importing all from Google Sheets:", error);
      res.status(500).json({ error: "Bulk import failed" });
    }
  });

  // Check auth status
  app.get("/api/auth/google/status", (req, res) => {
    const tokensCookie = req.cookies['google_tokens'];
    res.json({ isAuthenticated: !!tokensCookie });
  });

  // Logout
  app.post("/api/auth/google/logout", (req, res) => {
    res.clearCookie('google_tokens');
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
