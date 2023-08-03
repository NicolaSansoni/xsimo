#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DeployStack } from "../lib/deploy-stack";
import { PipelineStack } from "../lib/pipeline-stack";
import { CrossAccountStack } from "../lib/crossaccount-stack";

const app = new cdk.App();

const pipelineAccountId = process.env.PIPELINE_ACCOUNT;
const pipelineRegion = process.env.PIPELINE_REGION || "eu-west-1";

const deployAccountId = process.env.DEPLOY_ACCOUNT;
const deployRegion = process.env.DEPLOY_REGION || "eu-west-1";

if (!pipelineAccountId || !deployAccountId) {
  throw new Error(
    "Please set the required environment variables PIPELINE_ACCOUNT and DEPLOY_ACCOUNT",
  );
}

const deployStack = new DeployStack(app, "DeployStack", {
  env: { account: deployAccountId, region: deployRegion },
  pipelineAccountId,
});

const crossAccountStack = new CrossAccountStack(app, "CrossAccountStack", {
  deployAccountId,
  deployAccountRole: deployStack.crossAccountRole,
  env: { account: pipelineAccountId, region: pipelineRegion },
});

const FrontendPipelineStack = new PipelineStack(app, "FrontendPipelineStack", {
  env: { account: pipelineAccountId, region: pipelineRegion },
  repositoryName: "front-end",
  branch: "prod",
  buildSpecFileName: "buildspec_prod.yml",
  codePipelineRole: deployStack.crossAccountRole,
  artifactBucket: crossAccountStack.artifactBucket,
  key: crossAccountStack.key,
  deployAccountId,
  service: deployStack.frontend.service,
  taskExecutionRole: deployStack.frontend.taskDefinition.executionRole!,
});
