########################################
# NETWORKING
########################################

# VPC
resource "aws_vpc" "default_vpc" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.common_tags, {
    Name = var.vpc_name
  })
}

# Internet Gateway
resource "aws_internet_gateway" "default_gateway" {
  vpc_id = aws_vpc.default_vpc.id

  tags = merge(var.common_tags, {
    Name = "${var.vpc_name}-igw"
  })
}

# Public Subnet
resource "aws_subnet" "public_subnet" {
  count                   = var.subnet_count.public
  cidr_block              = var.subnet_cidr_blocks_public[count.index]
  vpc_id                  = aws_vpc.default_vpc.id
  map_public_ip_on_launch = true
  availability_zone       = var.vpc_availability_zones[count.index]

  tags = merge(var.common_tags, {
    Name = "${var.vpc_name}-public-subnet-${count.index}"
  })
}

# Private Subnets
resource "aws_subnet" "private_subnets" {
  count                   = var.subnet_count.private
  cidr_block              = var.subnet_cidr_blocks_private[count.index]
  vpc_id                  = aws_vpc.default_vpc.id
  map_public_ip_on_launch = false
  availability_zone       = var.vpc_availability_zones[count.index]

  tags = merge(var.common_tags, {
    Name = "${var.vpc_name}-private-subnet-${count.index}"
  })
}

# Routing
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.default_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.default_gateway.id
  }

  tags = merge(var.common_tags, {
    Name = "${var.vpc_name}-route-table"
  })
}

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.default_vpc.id

  tags = merge(var.common_tags, {
    Name = "${var.vpc_name}-route-table"
  })
}

resource "aws_route_table_association" "public" {
  count          = var.subnet_count.public
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "private" {
  count          = var.subnet_count.private
  subnet_id      = aws_subnet.private_subnets[count.index].id
  route_table_id = aws_route_table.private_route_table.id
}
