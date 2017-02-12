// Imports
const 
    google = require('googleapis'),
    hsbc = require('./utils/hsbc-parser'),
    { setCredentials, googleApiAuthHelper } = require('./utils/google-api-helper'),
    config = require('./config'),
    credentials = require(config.googleApiCredentials)


// Globals
const sheets = google.sheets('v4')



// Utils
const
    getExampleSheetData = id => {
        return googleApiAuthHelper(
            sheets.spreadsheets.values.get, 
            {
                spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
                range: 'Class Data!A2:E',
            }
        )
        .then(response => {
            var rows = response.values;
            if (rows.length == 0) {
                console.log('No data found.');
            } else {
                console.log('Name, Major:');
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    // Print columns A and E, which correspond to indices 0 and 4.
                    console.log('%s, %s', row[0], row[4]);
                }
            }
        })
    }



// --------------------------------------
// Init
setCredentials(credentials)


hsbc.parseAllBankStatementsFromFolder(config.docsFolder)
    .then(console.log)
    .then(getExampleSheetData)
    .catch(console.error)
