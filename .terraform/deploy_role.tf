# Deploy role
data "aws_iam_policy_document" "deploy_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type = "Service"
      identifiers = [
        "secretsmanager.amazonaws.com",
        "s3.amazonaws.com"
      ]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "aws_deploy_role" {
  name               = "aws_deploy_role"
  assume_role_policy = data.aws_iam_policy_document.deploy_assume_role.json
  tags               = var.common_tags
}

# Attaching policies to role
resource "aws_iam_role_policy_attachment" "SecretsManagerReadWrite" {
  role       = aws_iam_role.aws_deploy_role.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

resource "aws_iam_role_policy_attachment" "AmazonS3FullAccess" {
  role       = aws_iam_role.aws_deploy_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}
