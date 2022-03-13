import { App } from 'aws-cdk-lib';
import { WeddingWebsiteStack } from './stacks/wedding-website-stack';

const app = new App();
new WeddingWebsiteStack(app, 'WeddingWebsiteStack');
