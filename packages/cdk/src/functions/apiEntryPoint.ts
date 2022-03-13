import { APIRequest, APIRequestTypes, FamilyInfo, LoginRequest, APIResult, UpdateFamilyInfoRequest } from "website/src/types";
import { getFamilyInfo, updateFamilyInfo } from "./utils/RegistrationInfo";

export async function handler(request: APIRequest): Promise<APIResult> {
  console.log(`Received request: ${JSON.stringify(request)}`);

  var familyInfo: FamilyInfo | undefined;
  switch (request.type) {
    case APIRequestTypes.LoginRequest:
      familyInfo = await getFamilyInfo(request as LoginRequest);
      break;
    case APIRequestTypes.UpdateFamilyInfoRequest:
      familyInfo = await updateFamilyInfo(request as UpdateFamilyInfoRequest);
      break;
    default:
      console.log(`Unknown request type: ${request.type}`);
      break;
  }

  console.log(`Family result: ${JSON.stringify(familyInfo)}`);

  return {
    success: familyInfo !== undefined,
    familyInfo: familyInfo
  }
}
