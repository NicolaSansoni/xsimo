import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

const iam = cdk.aws_iam;
const kms = cdk.aws_kms;
const s3 = cdk.aws_s3;

export interface CrossAccountStackProps extends cdk.StackProps {
  readonly deployAccountId: string;
  readonly deployAccountRole: cdk.aws_iam.Role;
}

export class CrossAccountStack extends cdk.Stack {
  readonly key: cdk.aws_kms.Key;
  readonly artifactBucket: cdk.aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: CrossAccountStackProps) {
    super(scope, id, props);

    // cross-account roles
    const deployAccountRootPrincipal = new iam.AccountPrincipal(
      props.deployAccountId
    );

    // Create KMS key and update policy with cross-account access
    const key = new kms.Key(this, "ArtifactKey");
    key.grantDecrypt(deployAccountRootPrincipal);
    key.grantDecrypt(props.deployAccountRole);
    this.key = key;

    // Create S3 bucket with target account cross-account access
    const artifactBucket = new s3.Bucket(this, "ArtifactBucket", {
      bucketName: `artifact-bucket-${this.account}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: key,
    });
    artifactBucket.grantPut(deployAccountRootPrincipal);
    artifactBucket.grantRead(deployAccountRootPrincipal);
    this.artifactBucket = artifactBucket;

    // Publish the KMS Key ARN as an output
    new cdk.CfnOutput(this, "ArtifactBucketEncryptionKeyArn", {
      value: key.keyArn,
      exportName: "ArtifactBucketEncryptionKey",
    });
  }
}
