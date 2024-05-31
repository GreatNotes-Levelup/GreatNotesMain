# State bucket
terraform {
  backend "s3" {
    bucket  = "great-notes-state-bucket"
    key     = "great-notes-state-bucket/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}
