import fs = require('fs');
import yargs = require('yargs');
import xlsx from 'node-xlsx';
import { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Converter } from "aws-sdk/clients/dynamodb";

interface ArgDefs {
  [key: string]: Options;
}


export interface EntreeEntry {
  name: string;
  description: string;
}

/**
 * The possible vaccination statuses for individuals.
 */
export enum VaxStatuses {
  Unknown = 'Unknown',
  Unvaccinated = 'Unvaccinated',
  Vaccinated = 'Vaccinated',
  Boosted = 'Vaccinated and Boosted',
}

export enum AttendingStatus {
  Unknown = 'Unknown',
  No = 'No',
  Yes = 'Yes'
}

/**
 * The registration info for each person.
 */
export interface PersonInfo {
  firstName: string;
  lastName: string;
  attending: AttendingStatus;
  isChild?: boolean;
  entree?: number;
  vaxStatus?: VaxStatuses;
}

/**
 * The registration info for an entire family.
 */
export interface FamilyInfo {
  people: PersonInfo[];
  email: string;
  phoneNumber: string;
}

interface HouseHold {
  addressNumber: string;
  families: FamilyInfo[];
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

    if (values[0].toLowerCase() !== 'rsvp id' && values[28].toLowerCase() === argv.groupname) {
      const address: string = values[15].split(' ')[0];
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
}
