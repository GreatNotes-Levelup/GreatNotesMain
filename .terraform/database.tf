# Security Group
resource "aws_security_group" "db_allow_tcp" {
  name        = "db-allow-tcp"
  description = "Allow TCP inbound traffic and outbound traffic"
  vpc_id      = aws_vpc.default_vpc.id

  tags = var.common_tags

  ingress {
    description     = "Allow all traffic from only ebs sg"
    from_port       = "5432"
    to_port         = "5432"
    protocol        = "tcp"
    security_groups = [aws_security_group.ebs_allow_tcp.id]
  }

  egress {
    description     = "Allow all traffic to only ebs sg"
    from_port       = "5432"
    to_port         = "5432"
    protocol        = "tcp"
    security_groups = [aws_security_group.ebs_allow_tcp.id]
  }
}

# Subnet Group
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.vpc_name}-private-subnet-group"
  subnet_ids = aws_subnet.private_subnets[*].id

  tags = var.common_tags
}

#########################################
# DATABASE
#########################################
# RDS Database
resource "random_password" "master_password" {
  length           = 16
  special          = true
  override_special = "_!%^"
}

resource "aws_db_instance" "great_notes_db" {
  identifier              = var.db_name
  username                = var.db_username
  password                = random_password.master_password.result
  allocated_storage       = 20
  storage_type            = "gp2"
  engine                  = "postgres"
  engine_version          = "15.6"
  instance_class          = "db.t3.micro"
  db_subnet_group_name    = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.db_allow_tcp.id]
  maintenance_window      = "Mon:00:00-Mon:01:00"
  publicly_accessible     = true
  skip_final_snapshot     = true
  multi_az                = true
  backup_retention_period = 0

  tags = var.common_tags
}

resource "aws_secretsmanager_secret" "rds_credentials" {
  name = "credentials"
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id     = aws_secretsmanager_secret.rds_credentials.id
  secret_string = <<EOF
  {
    db_username = "${var.db_name}"
    db_password = "${random_password.master_password.result}"
    db_host     = "${aws_db_instance.great_notes_db.endpoint}"
    db_port     = "${aws_db_instance.great_notes_db.port}"
  }
  EOF
}
