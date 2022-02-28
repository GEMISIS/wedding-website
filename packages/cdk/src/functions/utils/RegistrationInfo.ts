import { DynamoDB } from "aws-sdk";
import { QueryInput } from "aws-sdk/clients/dynamodb";
import { FamilyInfo, LoginInfo, PersonInfo, UpdateFamilyInfoRequest } from "wedding-website-react/src/types";
import { registrationTableName } from "../constants/EnvironmentProps";

const registrationInfoTable = new DynamoDB();

export async function getFamilyInfo(loginInfo: LoginInfo): Promise<FamilyInfo | undefined> {
  var queryParams: QueryInput = {
    TableName: registrationTableName,
    KeyConditionExpression: 'addressNumber = :addressNumber',
    ExpressionAttributeValues: {
      ':addressNumber': {
        S: `${loginInfo.addressNumber}`
      }
    }
  };
  var queryResults = await registrationInfoTable.query(queryParams).promise();
  if ((queryResults.Count ?? 0) > 0) {
    // Map each house result that is returned (should be just 1, but just to be safe)
    const houseResults = queryResults.Items?.map(houses => {
      // Go through all of the famlies in the house to find which one the person belong's to.
      const familyResults = houses?.families.L?.map(family => {
        // Check if the person is in the family.
        const peopleList = family?.M?.people?.L;
        const isInFamily = peopleList && peopleList.filter(person => {
          const personInfo = person?.M;
          return personInfo?.firstName?.S == `${loginInfo.firstName}` && personInfo?.lastName?.S == `${loginInfo.lastName}`;
        }).length > 0;

        if (isInFamily) {
          // If they are in the family, get all of the other family members too.
          const personResults = peopleList?.map(person => {
            return {
              firstName: person?.M?.firstName.S,
              lastName: person?.M?.lastName.S,
              attending: person?.M?.attending?.BOOL,
              isChild: person?.M?.isChild?.BOOL,
              entree: person?.M?.entree?.S,
              vaxCard: person?.M?.vaxCard?.S,
            } as PersonInfo;
          }).filter(x => x);
          console.log(`Person results: ${JSON.stringify(personResults)}`);

          return (personResults != undefined && personResults?.length >= 1) ? {
            people: personResults,
            email: family?.M?.email?.S,
            phoneNumber: family?.M?.phoneNumber?.S
          } as FamilyInfo : undefined;
        } else {
          return undefined;
        }
      }).filter(x => x);

      console.log(`Family results: ${JSON.stringify(familyResults)}`);
      return familyResults?.length == 1 ? familyResults[0] : undefined;
    }).filter(x => x);

    return houseResults?.length == 1 ? houseResults[0] : undefined;
  }
  return undefined;
}

export async function updateFamilyInfo(updateRequest: UpdateFamilyInfoRequest): Promise<FamilyInfo | undefined> {
  // TODO: Update the family information here.
  return getFamilyInfo(updateRequest.loginInfo);
}
