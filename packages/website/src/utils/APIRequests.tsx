import { APIRequest, APIResult } from "../types";

export function makeAPIRequest(apiRequest: APIRequest, successCallback: (successful: boolean, serverResult: APIResult | undefined) => (void)) {
  fetch(`https://api.geraldandmegan.com/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiRequest)
  }).then(response => response.json()).then(
    (serverResult: APIResult) => {
      console.log(serverResult);
      successCallback(serverResult.success, serverResult);
    },
    (error: Error) => {
      console.log(error.message);
      successCallback(false, undefined);
    }
  );
}