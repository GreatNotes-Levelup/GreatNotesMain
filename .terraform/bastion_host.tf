data "aws_ami" "ubuntu_ami" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow TCP inbound traffic and outbound traffic on port 22"
  vpc_id      = aws_vpc.default_vpc.id

  ingress {
    description = "Allow all traffic"
    from_port   = "22"
    to_port     = "22"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all traffic"
    from_port   = "22"
    to_port     = "22"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "allow_db" {
  name        = "allow_db"
  description = "Allow traffic from the db"
  vpc_id      = aws_vpc.default_vpc.id

  ingress {
    description     = "Allow all traffic"
    from_port       = "0"
    to_port         = "0"
    protocol        = "-1"
    security_groups = [aws_security_group.db_allow_tcp.id]
  }

  egress {
    description     = "Allow all traffic"
    from_port       = "0"
    to_port         = "0"
    protocol        = "-1"
    security_groups = [aws_security_group.db_allow_tcp.id]
  }
}

resource "aws_instance" "bastion_host" {
  count                       = 1
  ami                         = data.aws_ami.ubuntu_ami.id
  instance_type               = "t2.micro"
  key_name                    = module.key_pair.key_pair_name
  security_groups             = [aws_security_group.allow_ssh.id, aws_security_group.allow_db.id]
  associate_public_ip_address = true

  subnet_id = aws_subnet.public_subnet[count.index].id

  lifecycle {
    ignore_changes = all
  }
}
