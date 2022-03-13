import { DynamoDB } from "aws-sdk";
import { Converter, QueryInput, QueryOutput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { FamilyInfo, LoginRequest, PersonInfo, UpdateFamilyInfoRequest } from "website/src/types";
import { registrationTableName } from "../constants/EnvironmentProps";

const registrationInfoTable = new DynamoDB();

async function getHouseInfo(addressNumber: string): Promise<QueryOutput> {
  var queryParams: QueryInput = {
    TableName: registrationTableName,
    KeyConditionExpression: 'addressNumber = :addressNumber',
    ExpressionAttributeValues: {
      ':addressNumber': {
        S: addressNumber
      }
    }
  };
  return await registrationInfoTable.query(queryParams).promise();
}

export async function getFamilyInfo(loginInfo: LoginRequest): Promise<FamilyInfo | undefined> {
  var queryResults = await getHouseInfo(loginInfo.addressNumber);
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
          const personResults = peopleList
            ?.map(person => person?.M ? Converter.unmarshall(person?.M) as PersonInfo : undefined)
            .filter(x => x);

          return (personResults != undefined && personResults?.length >= 1) ? {
            people: personResults,
            email: family?.M?.email?.S,
            phoneNumber: family?.M?.phoneNumber?.S
          } as FamilyInfo : undefined;
        } else {
          return undefined;
        }
      }).filter(x => x);

      return familyResults?.length == 1 ? familyResults[0] : undefined;
    }).filter(x => x);

    return houseResults?.length == 1 ? houseResults[0] : undefined;
  }
  return undefined;
}

export async function updateFamilyInfo(updateRequest: UpdateFamilyInfoRequest): Promise<FamilyInfo | undefined> {
  var results = undefined;
  var queryResults = await getHouseInfo(updateRequest.loginInfo.addressNumber);
  if ((queryResults.Count ?? 0) > 0) {
    var isInFamily = false;

    // Map each house result that is returned (should be just 1, but just to be safe)
    for (var i = 0; queryResults.Items && i < queryResults.Items.length && !isInFamily; i++) {
      const houses = queryResults.Items[i];

      // Go through all of the famlies in the house to find which one the person belong's to.
      for (var j = 0; houses?.families.L && j < houses.families.L.length && !isInFamily; j++) {
        const family = houses.families.L[j];
        const peopleList = family?.M?.people?.L;

        // Check if the person is in the family.
        isInFamily = (peopleList != undefined) && peopleList.filter(person => {
          const personInfo = person?.M;
          return personInfo?.firstName?.S == `${updateRequest.loginInfo.firstName}` && personInfo?.lastName?.S == `${updateRequest.loginInfo.lastName}`;
        }).length > 0;

        if (isInFamily && (family?.M != undefined)) {
          var updateItemParams: UpdateItemInput = {
            TableName: registrationTableName,
            Key: {
              addressNumber: {
                S: `${updateRequest.loginInfo.addressNumber}`
              }
            },
            UpdateExpression: `SET families[${j}].#email = :email, families[${j}].#phoneNumber = :phoneNumber, families[${j}].#people = :people`,
            ExpressionAttributeNames: {
              '#email': 'email',
              '#phoneNumber': 'phoneNumber',
              '#people': 'people'
            },
            ExpressionAttributeValues: {
              ':email': {
                S: updateRequest.familyInfo.email
              },
              ':phoneNumber': {
                S: updateRequest.familyInfo.phoneNumber
              },
              ':people': {
                L: updateRequest.familyInfo.people.map(person => {
                  return {
                    M: Converter.marshall(person)
                  }
                })
              }
            }
          };
          try {
            const response = await registrationInfoTable.updateItem(updateItemParams).promise();
            if (response.$response.error) {
              console.log(`Update params: ${JSON.stringify(updateItemParams)}`);
              console.log(`Error updating item: ${JSON.stringify(response.$response.error)}`);
            } else {
              results = await getFamilyInfo(updateRequest.loginInfo);
            }
          } catch(error) {
            console.log(`Update params: ${JSON.stringify(updateItemParams)}`);
            console.log(`Exception updating item: ${JSON.stringify(error)}`);
          }
        }
      }
    }
  }

  return results;
}
