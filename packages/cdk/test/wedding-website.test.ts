import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as WeddingWebsite from '../src/wedding-website-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/wedding-website-stack.ts
test('S3 Bucket Created', () => {
  const app = new cdk.App();
  const stack = new WeddingWebsite.WeddingWebsiteStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    AccessControl: 'PublicRead',
    WebsiteConfiguration: {
      IndexDocument: 'index.html',
      ErrorDocument: '404.html',
    }
  });
});
