import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

const s3 = cdk.aws_s3;
const ec2 = cdk.aws_ec2;
const rds = cdk.aws_rds;
const ecs = cdk.aws_ecs;
const ecs_patterns = cdk.aws_ecs_patterns;
const iam = cdk.aws_iam;

interface DeployStackProps extends cdk.StackProps {
  pipelineAccountId: string;
}

export class DeployStack extends cdk.Stack {
  readonly crossAccountRole: cdk.aws_iam.Role;
  readonly frontend: cdk.aws_ecs_patterns.ApplicationLoadBalancedFargateService;

  constructor(scope: Construct, id: string, props: DeployStackProps) {
    super(scope, id, props);

    const crossAccountRole = new iam.Role(this, "PipelineAccountRole", {
      roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: new iam.AccountPrincipal(props.pipelineAccountId),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AWSCodePipeline_FullAccess",
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonEC2ContainerRegistryFullAccess",
        ),
      ],
    });
    this.crossAccountRole = crossAccountRole;

    // VPC
    const vpc = new ec2.Vpc(this, "vpc");

    // Buckets
    const bucket_dotnet = new s3.Bucket(this, "dotnetsync", {
      versioned: true,
    });

    const bucket_storage = new s3.Bucket(this, "storage", {
      versioned: true,
    });

    // Database

    const db = new rds.DatabaseInstance(this, "db", {
      vpc,
      credentials: rds.Credentials.fromGeneratedSecret("admin"),
      engine: rds.DatabaseInstanceEngine.sqlServerEx({
        version: rds.SqlServerEngineVersion.VER_15,
      }),
      licenseModel: rds.LicenseModel.LICENSE_INCLUDED,
      instanceType: new ec2.InstanceType("t3.small"),
    });

    // ECS

    const cluster = new ecs.Cluster(this, "cluster", {
      vpc,
      clusterName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });

    this.frontend = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "frontend",
      {
        cluster,
        publicLoadBalancer: true,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
          containerName: "app",
        },
        serviceName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      },
    );
  }
}
