import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

const iam = cdk.aws_iam;
const codecommit = cdk.aws_codecommit;
const codebuild = cdk.aws_codebuild;
const codepipeline = cdk.aws_codepipeline;
const codepipeline_actions = cdk.aws_codepipeline_actions;
const ecr = cdk.aws_ecr;

export interface PipelineStackProps extends cdk.StackProps {
  readonly deployAccountId: string;
  readonly service: cdk.aws_ecs.IBaseService;
  readonly taskExecutionRole: cdk.aws_iam.IRole;
  readonly codePipelineRole: cdk.aws_iam.IRole;
  readonly artifactBucket: cdk.aws_s3.Bucket;
  readonly key: cdk.aws_kms.Key;
  readonly repositoryName: string;
  readonly buildSpecFileName?: string;
  readonly branch?: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const build_project = new codebuild.PipelineProject(this, `${id}Build`, {
      buildSpec: codebuild.BuildSpec.fromSourceFilename(
        props.buildSpecFileName || "buildspec.yml"
      ),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
        privileged: true,
      },
      encryptionKey: props.key,
    });

    const output_source = new codepipeline.Artifact();
    const output_build = new codepipeline.Artifact();

    // repo
    const repo = codecommit.Repository.fromRepositoryName(
      this,
      `repo-${id}`,
      props.repositoryName
    );

    const ecr_repo = new ecr.Repository(this, "EcrRepo", {
      encryptionKey: props.key,
      repositoryName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });

    ecr_repo.grantPullPush(build_project);
    ecr_repo.grantPull(new iam.AccountPrincipal(props.deployAccountId));
    ecr_repo.grantPull(props.taskExecutionRole);

    // Pipeline definition
    const pipeline = new codepipeline.Pipeline(this, `${id}Pipeline`, {
      pipelineName: `${id}Pipeline`,
      artifactBucket: props.artifactBucket,
      stages: [
        {
          stageName: "Source",
          actions: [
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: "CodeCommit_Source",
              repository: repo,
              output: output_source,
              branch: props.branch || "main",
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: "Application_Build",
              project: build_project,
              input: output_source,
              outputs: [output_build],
              environmentVariables: {
                REPOSITORY_URI: { value: ecr_repo.repositoryUri },
              },
            }),
          ],
        },
        {
          stageName: "Deploy",
          actions: [
            new codepipeline_actions.EcsDeployAction({
              actionName: "Deploy",
              service: props.service,
              input: output_build,
              role: props.codePipelineRole,
            }),
          ],
        },
      ],
    });

    // Add the target accounts to the pipeline policy
    pipeline.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["sts:AssumeRole"],
        resources: [`arn:aws:iam::${props.deployAccountId}:role/*`],
      })
    );
  }
}
