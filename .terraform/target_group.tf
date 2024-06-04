resource "aws_lb_target_group" "http-target-group" {
  port     = 80
  protocol = "TCP"
  vpc_id   = aws_vpc.default_vpc.id

  lifecycle {
    ignore_changes = all
  }
}

resource "aws_lb_target_group" "http-target-group8080" {
  name       = "http-target-group8080"
  port       = 8080
  protocol   = "TCP"
  vpc_id     = aws_vpc.default_vpc.id
  slow_start = 0

  health_check {
    enabled             = true
    healthy_threshold   = 5
    interval            = 10
    port                = "traffic-port"
    protocol            = "TCP"
    timeout             = 10
    unhealthy_threshold = 5
  }

  stickiness {
    cookie_duration = 0
    enabled         = false
    type            = "source_ip"
  }

  target_health_state {
    enable_unhealthy_connection_termination = true
  }
}
