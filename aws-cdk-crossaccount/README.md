# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

---

To get account id

    aws sts get-caller-identity

To get region

    aws configure get region

To bootstrap

    cdk bootstrap aws://<account-id>/<region>

---

# Modifiche manuali per farlo andare

1. Aggiunta policy AmazonEC2ContainerRegistryFullAccess al role di Pipeline - CodeBuild
