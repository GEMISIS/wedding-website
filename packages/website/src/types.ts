
/**
 * The information a user needs to provide to login.
 */
export interface LoginInfo {
  firstName: string;
  lastName: string;
  addressNumber: string;
}

/**
 * The types of entrees available to attendees.
 */
export enum EntreeTypes {
  Beef = 'beef',
  Chicken = 'chicken',
  Vegetarian = 'vegetarian'
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

/**
 * The registration info for each person.
 */
export interface PersonInfo {
  firstName: string;
  lastName: string;
  attending?: boolean;
  isChild?:boolean;
  entree?: EntreeTypes;
  vaxStatus?: VaxStatuses;
  // Unused, will rely on folks replying honestly.
  vaxCard?: string;
}

/**
 * The registration info for an entire family.
 */
export interface FamilyInfo {
  people: PersonInfo[];
  email: string;
  phoneNumber: string;
}

export interface UpdateFamilyInfoRequest {
  loginInfo: LoginInfo;
  familyInfo: FamilyInfo;
}

export interface LoginServerResults {
  success: boolean;
  loginInfo: LoginInfo;
  familyInfo: FamilyInfo | undefined;
}

export type APIRequest = LoginInfo | UpdateFamilyInfoRequest;
