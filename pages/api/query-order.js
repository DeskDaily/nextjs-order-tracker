import { google } from 'googleapis';

const SHEET_ID = '1hygLTbyLMef1Od995wnxIDX78j8od7tdM8HnQT4BJks';
const RANGE = 'Sheet1';

// Google Sheets API Setup
async function getGoogleSheetData() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.SERVICE_ACCOUNT_JSON),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });

  return response.data.values;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { customerID, orderNumber } = req.body;

    try {
      const rows = await getGoogleSheetData();
      const match = rows.find(row => row[0] === customerID && row[3] === orderNumber);

      if (match) {
        res.status(200).json({
          data: {
            customerCompanyName: match[1],
            projectName: match[2],
            orderNumber: match[3],
            orderStatus: match[4],
            depositInvoice: match[5],
            balanceInvoice: match[6],
            expectedShipDate: match[7],
            actualShipDate: match[8],
            courier: match[9],
            trackingNumber: match[10],
            shipToAddress: match[11],
          },
        });
      } else {
        res.status(200).json({ data: null });
      }
    } catch (error) {
      console.error('Error querying Google Sheet:', error);
      res.status(500).json({ error: 'Error querying Google Sheet' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
