import { Options } from "yargs";

export interface ArgDefs {
  [key: string]: Options;
}

/**
 * The registration info for each person.
 */
export interface PersonInfo {
  firstName: string;
  lastName: string;
}

/**
 * The registration info for an entire family.
 */
export interface FamilyInfo {
  people: PersonInfo[];
  email: string;
  phoneNumber: string;
}

/**
 * Baseline info regarding the household.
 */
export interface HouseHold {
  addressNumber: string;
  families: FamilyInfo[];
}

