resource "aws_s3_bucket" "great_notes" {
  bucket = "great-notes"
  force_destroy = true
}
