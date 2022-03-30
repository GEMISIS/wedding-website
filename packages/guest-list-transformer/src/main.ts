import fs = require('fs');
import yargs = require('yargs');
import xlsx from 'node-xlsx';
import { hideBin } from 'yargs/helpers';
import { Converter } from "aws-sdk/clients/dynamodb";
import { ArgDefs, FamilyInfo, HouseHold } from './types';
import { putHouseholds } from './utils/db';

function isUnknownArray(val: any): val is unknown[] {
  return Array.isArray(val);
}

function asString(val: unknown, defVal: string) {
  return typeof val === "string" ? val : defVal;
}

function asNumber(val: unknown, defVal: number) {
  return typeof val === "number" ? val : defVal;
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
    if (isUnknownArray(cell)) {
      var address: string = asString(cell[15], '').split(' ')[0];
      if (address.toLowerCase().startsWith("po")) {
        address = asString(cell[15], '').split(' ').pop() ?? ' '; // Should always be defined since the list should not be empty.
      }

      if (asString(cell[0], '').toLowerCase() !== 'rsvp id' && address !== "" && asString(cell[28], '').toLowerCase() === argv.groupname) {
        const family: FamilyInfo = {
          email: asString(cell[25], ''),
          phoneNumber: asString(cell[26], ''),
          people: [
          ]
        };

        // Add Guest 1
        const firstGuest = asString(cell[5], '');
        if (firstGuest) {
          const surname = asString(cell[6], '');
          family.people.push({
            firstName: firstGuest,
            lastName: surname != '' ? surname : asString(cell[3], '')
          });
        }

        // Add Guest 2
        const secondGuest = asString(cell[9], '');
        if (secondGuest) {
          const surname = asString(cell[10], '');
          family.people.push({
            firstName: secondGuest,
            lastName: surname != '' ? surname : asString(cell[3], '')
          });
        }

        // Add Others
        const others = asString(cell[12], '');
        if (others) {
          others.split(', ').join(',').split(' and ').join(',').split(',').forEach(name => {
            family.people.push({
              firstName: name,
              lastName: asString(cell[3], '')
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
          });
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

    putHouseholds(argv.tablename, chunk).then(result => {
      console.log(JSON.stringify(result));
    });
  }
}
