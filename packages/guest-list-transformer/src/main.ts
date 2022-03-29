import fs = require('fs');
import yargs = require('yargs');
import xlsx from 'node-xlsx';
import { hideBin } from 'yargs/helpers';
import { Converter } from "aws-sdk/clients/dynamodb";
import { ArgDefs, AttendingStatus, FamilyInfo, HouseHold } from './types';
import { putHouseholds } from './utils/db';

function isStringArray(x: any): x is string[] {
  return typeof x === 'object';
}

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
    // Need to determine the type here or things will break since the default type is unknown.
    if (isStringArray(cell)) {
      const values: string[] = cell as string[];
      var address: string = values[15].split(' ')[0];
      if (address.toLowerCase().startsWith("po")) {
        address = values[15].split(' ').pop() ?? ' '; // Should always be defined since the list should not be empty.
      }

      if (values[0].toLowerCase() !== 'rsvp id' && address !== "" && values[28].toLowerCase() === argv.groupname) {
        const family: FamilyInfo = {
          email: values[25],
          phoneNumber: values[26],
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
