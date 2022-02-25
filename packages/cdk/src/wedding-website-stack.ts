import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

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
  }
}
