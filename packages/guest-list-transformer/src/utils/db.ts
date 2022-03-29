import { DynamoDB } from "aws-sdk";
import { Converter } from "aws-sdk/clients/dynamodb";
import { registrationTableName } from "../constants/EnvironmentProps";
import { HouseHold } from "../types";

const registrationInfoTable = new DynamoDB({
  region: 'us-east-1'
});

function isString(x: any): x is string {
  return typeof x === 'string';
}

export async function putHouseholds(tableName: string | undefined | unknown, households: HouseHold[]): Promise<DynamoDB.BatchWriteItemOutput | undefined> {
  if (isString(tableName)) {
    const batchWriteRequest: DynamoDB.BatchWriteItemInput = {
      RequestItems: {
        [tableName ?? registrationTableName]: households.map(household => {
          const result: DynamoDB.WriteRequest = {
            PutRequest: {
              Item: Converter.marshall(household)
            }
          }
          return result;
        })
      }
    }

    return await registrationInfoTable.batchWriteItem(batchWriteRequest).promise();
  }
  return undefined;
}
