resource "aws_launch_configuration" "default" {
  name_prefix     = "aws-asg-"
  image_id        = "ami-0e9947f83884eae81"
  instance_type   = "t2.micro"
  security_groups = [aws_security_group.ebs_allow_tcp.id, aws_security_group.db_allow_tcp.id]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "default" {
  min_size             = 1
  max_size             = 1
  desired_capacity     = 1
  launch_configuration = aws_launch_configuration.default.name

  lifecycle {
    ignore_changes = all
  }
}
