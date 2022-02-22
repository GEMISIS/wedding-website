# My Wedding Website

## Overview
This is the website used for registering guests for my wedding. Because of COVID-19, we wanted to ensure all of our guests were vaccinated, and thus needed a custom website at the time to handle this with our other registration information.

## Technical Design
The project uses CDK to deploy via AWS, which hosts a very simple React website that users can interact with. An architecture diagram of the website can be seen below:

![The architecture diagram for the website.](https://github.com/GEMISIS/wedding-website/blob/main/diagrams/architecture.png?raw=true)

The website primarily

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
