import yargs = require('yargs');
import xlsx from 'node-xlsx';
import { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';

const rootDir: string = `${__dirname}/../../..`;

interface ArgDefs {
  [key: string]: Options;
}
const argDefs: ArgDefs = {
  'filename': {
    type: 'string',
    default: 'guests.xlsx'
  },
}
const argv = yargs(hideBin(process.argv)).options(argDefs).parseSync();

// Find the specific sheet within the spreadsheet we want.
const worksheet = xlsx.parse(`${rootDir}/${argv.filename}`);
const guestSheet = worksheet.find(sheet => sheet.name.toLowerCase() == 'guest parties');

if (guestSheet) {
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      console.log(`${guestSheet.data[i + j * 5]}`);
    }
  }
}
