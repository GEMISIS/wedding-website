import { DynamoDB } from "aws-sdk";
import { Converter, GetItemInput, GetItemOutput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { FamilyInfo, LoginRequest, UpdateFamilyInfoRequest } from "website/src/types";
import { registrationTableName } from "../constants/EnvironmentProps";

const registrationInfoTable = new DynamoDB();

function personMatch(loginInfo: LoginRequest, dbEntry: DynamoDB.AttributeValue): boolean {
  return dbEntry?.M?.firstName?.S?.toLowerCase() == `${loginInfo.firstName.toLowerCase()}` &&
    dbEntry?.M?.lastName?.S?.toLowerCase() == `${loginInfo.lastName.toLowerCase()}`;
}

async function getHouseInfo(addressNumber: string): Promise<GetItemOutput> {
  var getItemParams: GetItemInput = {
    TableName: registrationTableName,
    Key: {
      addressNumber: {
        S: addressNumber
      }
    }
  };
  return await registrationInfoTable.getItem(getItemParams).promise();
}

export async function getFamilyInfo(loginInfo: LoginRequest): Promise<FamilyInfo | undefined> {
  var getResults = await getHouseInfo(loginInfo.addressNumber);
  const family = (getResults.Item?.families.L ?? [])
    .find(family => family.M?.people?.L?.some(person => personMatch(loginInfo, person)))?.M;
  return family ? (Converter.unmarshall(family) as FamilyInfo) : undefined;
}

export async function updateFamilyInfo(updateRequest: UpdateFamilyInfoRequest): Promise<FamilyInfo | undefined> {
  var results = undefined;
  var getResults = await getHouseInfo(updateRequest.loginInfo.addressNumber);

  const familyIndex = (getResults.Item?.families.L ?? [])
    .findIndex((family => family?.M?.people?.L?.some(person => personMatch(updateRequest.loginInfo, person))))
  
  if (familyIndex > -1) {
    var updateItemParams: UpdateItemInput = {
      TableName: registrationTableName,
      Key: {
        addressNumber: {
          S: `${updateRequest.loginInfo.addressNumber}`
        }
      },
      UpdateExpression: `SET families[${familyIndex}] = :family`,
      ExpressionAttributeValues: {
        ':family': {
          M: Converter.marshall(updateRequest.familyInfo)
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
    } catch (error) {
      console.log(`Update params: ${JSON.stringify(updateItemParams)}`);
      console.log(`Exception updating item: ${JSON.stringify(error)}`);
    }
  }

  return results;
}
