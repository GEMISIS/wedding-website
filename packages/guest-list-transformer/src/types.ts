import { Options } from "yargs";

export interface ArgDefs {
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

export interface HouseHold {
  addressNumber: string;
  families: FamilyInfo[];
}

