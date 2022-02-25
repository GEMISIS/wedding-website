import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export class WeddingWebsiteStack extends Stack {
  website = require('wedding-website-react');

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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

    const apiLambda = new NodejsFunction(this, 'wedding-api-lambda', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, '../functions/apiEntryPoint.ts'),
      handler: 'handler'
    });
  }
}
