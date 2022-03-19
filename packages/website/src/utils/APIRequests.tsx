import { APIRequest, APIResult } from "../types";
const config = require('../config.json');
const apiUrl: string = config.apiUrl

export function makeAPIRequest(apiRequest: APIRequest, successCallback: (successful: boolean, serverResult: APIResult | undefined) => (void)) {
  fetch(`https://${apiUrl}/registration`, {
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