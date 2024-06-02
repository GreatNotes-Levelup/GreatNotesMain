resource "aws_lb_listener" "front_end" {
  load_balancer_arn = var.load_balancer_arn
  port              = "443"
  protocol          = "TLS"
  certificate_arn = var.certificate_arn
  alpn_policy     = "HTTP2Preferred"

  default_action {
    type             = "forward"
    target_group_arn = var.target_group_arn
  }
}
