# My Wedding Website

## Overview
This is the website used for registering guests for my wedding. Because of COVID-19, we wanted to ensure all of our guests were vaccinated, and thus needed a custom website at the time to handle this with our other registration information.

## Technical Design
The project uses CDK to deploy via AWS, which hosts a very simple React website that users can interact with. An architecture diagram of the website can be seen below:

![The architecture diagram for the website.](https://github.com/GEMISIS/wedding-website/blob/main/diagrams/architecture.png?raw=true)

For the database, we need to store several pieces of information. Because we don't want to worry about sending registration codes for people, we instead decided to use pieces of information known to the users to register. Thus, the database needs to reflect this, and be able to handle conflicting scenarios.

The primary info we will use is a person's name and address numbre. This can result in conflicts however, so we will need sub-objects for each family to be in. To that end, the structure of the table that has been chosen looks like so:

|Key Type|Name|Data Format|Sample Value|Description|
|---|---|---|---|---|
|Partition Key|Address Number|String|1337|The number on their home for the address this family lives at.|
|List of Items|Families|List of Family Objects|[[Object Object],[Object Object]]|A list of family objects. This is because multiple famlies can live in the same home.

A family object will look like so:
```json
{
  'people': [
    {
      'firstName': 'John',
      'lastName': 'Doe',
      'attending': true,
      'isChild': false,
      'entree': 'vegetarian',
      'vaxCard': 'VAX_IMAGE_NAME1.JPG'
    },
    {
      'firstName': 'Jane',
      'lastName': 'Doe',
      'attending': true,
      'isChild': false,
      'entree': 'beef',
      'vaxCard': 'VAX_IMAGE_NAME2.JPG'
    }
  ],
  'email': 'john.doe@gmail.com',
  'phoneNumber': '111-111-1111'
}
```

## Setup
You will need to install the following before you can use this project:
- AWS CDK (Cloud Development Kit)
- Docker (For deploying several things via CDK)

## Commands

### lerna run build
Builds everything required for the site. Will output a build folder for the website, and a bin folder for the cdk project.

### lerna run synth
Synthesizes the CDK project to be deployed.

### lerna run bootstrap
Bootstrap the CDK project so that it is deployed to your account.

### lerna run deploy
Deploys the previously synthesized CDK project. This effectively deploys the entire website.

### lerna run start
Runs the website to be tested locally, instead of requiring an entire deployment each time. Note however that this will only run the website files, and that any APIs will still need to be deployed at least once before testing locally will work.