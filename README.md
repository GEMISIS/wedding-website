# My Wedding Website

## Overview
This is the website used for registering guests for my wedding. Because of COVID-19, we wanted to ensure all of our guests were vaccinated, and thus needed a custom website at the time to handle this with our other registration information.

## Technical Design
The project uses CDK to deploy via AWS, which hosts a very simple React website that users can interact with. An architecture diagram of the website can be seen below:

![The architecture diagram for the website.](https://github.com/GEMISIS/wedding-website/blob/main/diagrams/architecture.png?raw=true)

## Commands

### lerna run build
Builds everything required for the site. Will output a build folder for the website, and a bin folder for the cdk project.

### lerna run test
Runs all of the tests for the projects. An interactive test can be run in the website package specifically.

### lerna run synth
Synthesizes the CDK project to be deployed.

### lerna run bootstrap
Bootstrap the CDK project so that it is deployed to your account.

### lerna run deploy
Deploys the previously synthesized CDK project. This effectively deploys the entire website.

### lerna run start
Runs the website to be tested locally, instead of requiring an entire deployment each time. Note however that this will only run the website files, and that any APIs will still need to be deployed at least once before testing locally will work.