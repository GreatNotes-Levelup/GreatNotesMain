resource "aws_lb" "eb_load_balancer" {
  subnets = aws_subnet.public_subnet[*].id
  lifecycle {
    ignore_changes = all
  }
}

resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.eb_load_balancer.arn
  port              = "443"
  protocol          = "TLS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.default.arn
  alpn_policy       = "HTTP1Only"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.http-target-group.arn
  }
}

resource "aws_lb_listener" "front_end80" {
  load_balancer_arn = aws_lb.eb_load_balancer.arn
  port              = "80"
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.http-target-group8080.arn
  }
}
