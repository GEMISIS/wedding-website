import { LoginInfo, LoginServerResults, UpdateFamilyInfoRequest } from "wedding-website-react/src/types";
import { getFamilyInfo, updateFamilyInfo } from "./utils/RegistrationInfo";

function isLoginRequest(request: LoginInfo | UpdateFamilyInfoRequest): request is LoginInfo {
  return (<LoginInfo>request).firstName !== undefined
}

export async function handler(request: LoginInfo | UpdateFamilyInfoRequest): Promise<LoginServerResults> {
  console.log(`Received request: ${JSON.stringify(request)}`);

  var loginInfo ,familyInfo;
  if (isLoginRequest(request)) {
    loginInfo = request;
    familyInfo = await getFamilyInfo(request);
  } else {
    loginInfo = request.loginInfo;
    familyInfo = await updateFamilyInfo(request);
  }

  console.log(`Family result: ${JSON.stringify(familyInfo)}`);

  return {
    success: familyInfo != undefined,
    loginInfo: loginInfo,
    familyInfo: familyInfo
  }
}
