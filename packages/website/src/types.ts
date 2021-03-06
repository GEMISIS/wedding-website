export interface PhoneNumber {
  url: string;
  number: string;
}

export interface Hotel {
  name: string;
  url: string;
  mapUrl: string;
  phoneNumber?: PhoneNumber;
}

export interface HotelInfo {
  hotels: Hotel[];
  bookStart: string;
  bookEnd: string;
  deadline: string;
  previewImage: string;
}

export interface MethodOfTransport {
  brandName: string;
  validLocations: string[];
  validStarting: string;
  validEnding: string;
  couponCode: string;
  isFree: boolean;
}

export interface TransportationInfo {
  methodsOfTransport: MethodOfTransport[];
  previewImage: string;
}

export interface WeddingEvent {
  name: string;
  startTime: string;
}

export interface VenueInfo {
  name: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  mapUrl: string;
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
  isChild?:boolean;
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

  constructor(loginInfo: LoginRequest, familyInfo: FamilyInfo) {
    super();
    this.loginInfo = loginInfo;
    this.familyInfo = familyInfo;
  }
}

/**
 * The results from the API.
 */
export interface APIResult {
  success: boolean;
  familyInfo: FamilyInfo | undefined;
}
