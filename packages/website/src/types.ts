
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
 * The possible request types that can be sent to the APIs.
 */
export enum APIRequestTypes {
  Unknown,
  LoginRequest,
  UpdateFamilyInfoRequest,
  UpdatePersonInfoRequest
}

/**
 * The base class for all API requests.
 */
export class APIRequest {
  readonly type?: APIRequestTypes = APIRequestTypes.Unknown;
}

/**
 * The information a user needs to provide to login.
 */
export class LoginRequest extends APIRequest {
  firstName: string = '';
  lastName: string = '';
  addressNumber: string = '';
  readonly type?: APIRequestTypes = APIRequestTypes.LoginRequest;
}

/**
 * The information a user needs to update their family's registration info.
 */
export class UpdateFamilyInfoRequest extends APIRequest {
  loginInfo!: LoginRequest;
  familyInfo!: FamilyInfo;
  readonly type: APIRequestTypes = APIRequestTypes.UpdateFamilyInfoRequest;
}

/**
 * The results from the API.
 */
export interface APIResult {
  success: boolean;
  loginInfo: LoginRequest | undefined;
  familyInfo: FamilyInfo | undefined;
}
