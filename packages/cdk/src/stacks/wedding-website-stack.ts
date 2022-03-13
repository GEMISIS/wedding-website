import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export class WeddingWebsiteStack extends Stack {
  website = require('website');

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Setup the S3 bucket where all the code will live.
    const websiteBucket = new Bucket(this, 'wedding-website', {
      publicReadAccess: true,
      accessControl: BucketAccessControl.PUBLIC_READ,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      removalPolicy: RemovalPolicy.DESTROY
    });

    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset(this.website.output)],
      destinationBucket: websiteBucket,
      retainOnDelete: false
    });

    // Create our database with user's info.
    const registrationDatabase = new Table(this, 'wedding-database', {
      partitionKey: {
        name: 'addressNumber',
        type: AttributeType.STRING
      }
    })

    // Create the Lambda for API calls.
    const apiLambda = new NodejsFunction(this, 'wedding-api-lambda', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, '../functions/apiEntryPoint.ts'),
      handler: 'handler',
      environment: {
        REGISTRATION_TABLE: registrationDatabase.tableName
      }
    });
    registrationDatabase.grantReadWriteData(apiLambda);

    // Create our API Gateway
    const weddingAPI = new RestApi(this, 'wedding-api', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });
    const weddingAPIValidator = new RequestValidator(this, 'wedding-api-validator', {
      restApi: weddingAPI,
      validateRequestBody: true,
      validateRequestParameters: true,
    });

    // User authentication endpoint configuration
    const weddingValidateItems = weddingAPI.root.addResource('registration', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });

    // Transform our requests and responses as appropriate.
    const weddingAPIIntegration: LambdaIntegration = new LambdaIntegration(apiLambda, {
      proxy: false,
      requestTemplates: {
        'application/json': '$input.json(\'$\')\r\n',
      },
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'"
          }
        },
        {
          statusCode: '401',
          selectionPattern: '.*[UNAUTHORIZED].*',
          responseTemplates: {
            'application/json': 'invalid request signature',
          },
        },
      ],
    });

    // Add a POST method for the Discord APIs.
    weddingValidateItems.addMethod('POST', weddingAPIIntegration, {
      apiKeyRequired: false,
      requestValidator: weddingAPIValidator,
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
          }
        },
        {
          statusCode: '401',
        },
      ],
    });
  }
}
