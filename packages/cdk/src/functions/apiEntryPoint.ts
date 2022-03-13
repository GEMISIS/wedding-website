import { APIRequest, APIRequestTypes, FamilyInfo, LoginRequest, APIResult, UpdateFamilyInfoRequest } from "website/src/types";
import { getFamilyInfo, updateFamilyInfo } from "./utils/RegistrationInfo";

export async function handler(request: APIRequest): Promise<APIResult> {
  console.log(`Received request: ${JSON.stringify(request)}`);

  var loginInfo: LoginRequest | undefined, familyInfo: FamilyInfo | undefined;
  switch (request.type) {
    case APIRequestTypes.LoginRequest:
      loginInfo = request as LoginRequest;
      familyInfo = await getFamilyInfo(request as LoginRequest);
      break;
    case APIRequestTypes.UpdateFamilyInfoRequest:
      loginInfo = (request as UpdateFamilyInfoRequest).loginInfo;
      familyInfo = await updateFamilyInfo(request as UpdateFamilyInfoRequest);
      break;
  }

  console.log(`Family result: ${JSON.stringify(familyInfo)}`);

  return {
    success: (loginInfo !== undefined && familyInfo !== undefined),
    loginInfo: loginInfo,
    familyInfo: familyInfo
  }
}
