resource "aws_lb_listener" "front_end" {
  load_balancer_arn = var.load_balancer_arn
  port              = "443"
  protocol          = "TLS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.certificate_arn
  alpn_policy       = "HTTP1Only"

  default_action {
    type             = "forward"
    target_group_arn = var.target_group_arn
  }
}
