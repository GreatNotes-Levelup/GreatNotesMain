# Public Hosted zone
resource "aws_route53_zone" "zone_apex" {
  name    = var.hosted_zone_name
  comment = "Hosted Zone for ${var.hosted_zone_name}"

  tags = var.common_tags
}

# CNAME record
resource "aws_route53_record" "record_apex_great_notes" {
  type    = "CNAME"
  name    = "great-notes"
  ttl     = 300
  zone_id = aws_route53_zone.zone_apex.id
  records = ["${aws_elastic_beanstalk_environment.great_notes_app_env.endpoint_url}"]
}
