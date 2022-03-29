import fs = require('fs');
import yargs = require('yargs');
import xlsx from 'node-xlsx';
import { hideBin } from 'yargs/helpers';
import { Converter } from "aws-sdk/clients/dynamodb";
import { ArgDefs, AttendingStatus, FamilyInfo, HouseHold } from './types';
import { putHouseholds } from './utils/db';

const rootDir: string = `${__dirname}/../../..`;

const argDefs: ArgDefs = {
  'filename': {
    type: 'string',
    default: 'guests.xlsx'
  },
  'groupname': {
    type: 'string',
    default: 'a'
  },
  'tablename': {
    type: 'string',
    default: undefined
  }
}
const argv = yargs(hideBin(process.argv)).options(argDefs).parseSync();

// Find the specific sheet within the spreadsheet we want.
const worksheet = xlsx.parse(`${rootDir}/${argv.filename}`);
const guestSheet = worksheet.find(sheet => sheet.name.toLowerCase() == 'guest parties')?.data;

if (guestSheet) {
  var houseHolds: HouseHold[] = [];
  guestSheet.forEach(cell => {
    const cellString: string = String(cell);
    const values: string[] = cellString.split(',');
    const address: string = values[15].split(' ')[0];

    if (values[0].toLowerCase() !== 'rsvp id' && address !== "" && values[29].toLowerCase() === argv.groupname) {
      const family: FamilyInfo = {
        email: values[26],
        phoneNumber: values[27],
        people: [
        ]
      };

      // Add Guest 1
      if (values[5]) {
        const surname = ((values[6] ?? '') != '') ? values[6] : values[3];
        family.people.push({
          firstName: values[5],
          lastName: surname,
          attending: AttendingStatus.Unknown
        });
      }

      // Add Guest 2
      if (values[9]) {
        const surname = ((values[10] ?? '') != '') ? values[10] : values[3];
        family.people.push({
          firstName: values[9],
          lastName: surname,
          attending: AttendingStatus.Unknown
        });
      }

      // Add Others
      if (values[12]) {
        values[12].split(', ').join(',').split(' and ').join(',').split(',').forEach(name => {
          family.people.push({
            firstName: name,
            lastName: values[3],
            attending: AttendingStatus.Unknown
          });
        });
      }

      const household = houseHolds.find(household => household.addressNumber == address);
      if (household) {
        household.families.push(family);
      } else {
        houseHolds.push({
          addressNumber: address,
          families: [family]
        })
      }
    }
  });

  // Write the results to guests.json
  const dynamodbFriendly = houseHolds.map(household => Converter.marshall(household));
  fs.writeFileSync(`${rootDir}/guests.json`, JSON.stringify({ dynamodbFriendly }), 'utf8');

  // Write to DynamoDB in chunks of 25 items.
  const chunkSize = 25;
  for (let i = 0; i < houseHolds.length; i += chunkSize) {
    const chunk = houseHolds.slice(i, i + chunkSize);

    var queryResults = putHouseholds(argv.tablename, chunk).then(result => {
      console.log(JSON.stringify(result));
    });
  }
}
