# Security Group
resource "aws_security_group" "db_allow_tcp" {
  name        = "db-allow-tcp"
  description = "Allow TCP inbound traffic and outbound traffic"
  vpc_id      = aws_vpc.default_vpc.id

  ingress {
    description     = "Allow all traffic from only ebs sg"
    from_port       = "5432"
    to_port         = "5432"
    protocol        = "tcp"
    security_groups = [aws_security_group.ebs_allow_tcp.id, aws_security_group.allow_ssh.id]
  }

  egress {
    description     = "Allow all traffic to only ebs sg"
    from_port       = "5432"
    to_port         = "5432"
    protocol        = "tcp"
    security_groups = [aws_security_group.ebs_allow_tcp.id, aws_security_group.allow_ssh.id]
  }
}

# Subnet Group
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.vpc_name}-private-subnet-group"
  subnet_ids = aws_subnet.private_subnets[*].id
}

#########################################
# DATABASE
#########################################
# RDS Database
resource "random_password" "master_password" {
  length           = 30
  special          = true
  override_special = "_!%^"
}

resource "aws_db_instance" "great_notes_db" {
  identifier                  = var.db_name
  username                    = var.db_username
  password                    = random_password.master_password.result
  allocated_storage           = 20
  storage_type                = "gp2"
  engine                      = "postgres"
  engine_version              = "16.2"
  instance_class              = "db.t3.micro"
  db_subnet_group_name        = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids      = [aws_security_group.db_allow_tcp.id]
  maintenance_window          = "Mon:00:00-Mon:01:00"
  publicly_accessible         = false
  skip_final_snapshot         = true
  multi_az                    = true
  backup_retention_period     = 0
}

resource "aws_secretsmanager_secret" "rds_credentials" {
  name = "credentials"
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id     = aws_secretsmanager_secret.rds_credentials.id
  secret_string = <<EOF
  {
    "username" : "${var.db_username}",
    "password" : "${random_password.master_password.result}",
    "host"     : "${aws_db_instance.great_notes_db.endpoint}",
    "port"     : "${aws_db_instance.great_notes_db.port}"
  }
  EOF

  lifecycle {
    ignore_changes = all
  }
}
